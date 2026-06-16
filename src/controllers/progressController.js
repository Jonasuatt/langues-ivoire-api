const prisma = require('../lib/prisma');

// Grades culturels (synchronisés avec le mobile)
const GRADES = [
  { name: "L'Apprenti",              minXp: 0,    icon: '🌱' },
  { name: 'Le Voyageur',             minXp: 150,  icon: '🚶' },
  { name: "L'Ambassadeur",           minXp: 400,  icon: '🤝' },
  { name: 'Le Maître de la Parole',  minXp: 700,  icon: '👑' },
];

function getGrade(xp) {
  let grade = GRADES[0];
  let nextGrade = GRADES[1];
  for (let i = GRADES.length - 1; i >= 0; i--) {
    if (xp >= GRADES[i].minXp) {
      grade = GRADES[i];
      nextGrade = GRADES[i + 1] || null;
      break;
    }
  }
  return { grade, nextGrade };
}

const getUserProgress = async (req, res, next) => {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId: req.user.id },
      include: {
        lesson: {
          select: { titre: true, niveau: true, pointsXp: true,
                    language: { select: { nom: true, code: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const lessonXp = progress
      .filter(p => p.statut === 'completed')
      .reduce((sum, p) => sum + (p.xpGained ?? p.lesson.pointsXp ?? 0), 0);

    // Inclure le bonusXp (jeux, SOS, Marché…)
    const bonusXp = req.user.bonusXp ?? 0;
    const totalXp = lessonXp + bonusXp;

    const { grade, nextGrade } = getGrade(totalXp);

    const stats = {
      totalLessons: progress.length,
      completed: progress.filter(p => p.statut === 'completed').length,
      totalXp,
      bonusXp,
      streak: req.user.streak,
      grade: grade.name,
      gradeIcon: grade.icon,
      nextGrade: nextGrade ? nextGrade.name : null,
      nextGradeXp: nextGrade ? nextGrade.minXp : null,
      xpToNextGrade: nextGrade ? Math.max(0, nextGrade.minXp - totalXp) : 0,
    };

    res.json({ progress, stats });
  } catch (err) {
    next(err);
  }
};

const completeLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) return res.status(404).json({ error: 'Leçon non trouvée' });

    // XP proportionnel au score (min 20% même à 0%)
    const scorePct = Math.max(20, Math.min(100, score ?? 100));
    const xpGained = Math.round(lesson.pointsXp * scorePct / 100);

    const progress = await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: req.user.id, lessonId: id } },
      create: {
        userId: req.user.id,
        lessonId: id,
        statut: 'completed',
        score: scorePct,
        dateCompletion: new Date(),
        attempts: 1,
        xpGained,
      },
      update: {
        statut: 'completed',
        score: scorePct,
        dateCompletion: new Date(),
        attempts: { increment: 1 },
        xpGained,
      },
    });

    // Mettre à jour le streak
    const lastActive = req.user.lastActiveAt;
    const now = new Date();
    const diffHours = lastActive ? (now - lastActive) / 3600000 : 999;
    let newStreak = req.user.streak;
    if (diffHours > 48) newStreak = 1;
    else if (diffHours > 20) newStreak = req.user.streak + 1;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { lastActiveAt: now, streak: newStreak },
    });

    // Vérifier les nouveaux badges
    const newBadges = await checkBadges(req.user.id);

    res.json({
      progress,
      pointsXp: lesson.pointsXp,
      xpGained,
      streak: newStreak,
      newBadges,
    });
  } catch (err) {
    next(err);
  }
};

const checkBadges = async (userId) => {
  const badges = await prisma.badge.findMany();
  const userBadges = await prisma.userBadge.findMany({ where: { userId } });
  const userBadgeIds = new Set(userBadges.map(b => b.badgeId));
  const newBadges = [];

  const [completedLessons, contributions] = await Promise.all([
    prisma.userProgress.count({ where: { userId, statut: 'completed' } }),
    prisma.contribution.count({ where: { userId } }),
  ]);

  for (const badge of badges) {
    if (userBadgeIds.has(badge.id)) continue;
    const cond = badge.condition;
    let earned = false;

    if (cond.type === 'lessons_completed' && completedLessons >= cond.count) earned = true;
    if (cond.type === 'contributions' && contributions >= cond.count) earned = true;

    if (earned) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      newBadges.push(badge);
    }
  }
  return newBadges;
};

const getUserBadges = async (req, res, next) => {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: req.user.id },
      include: { badge: true },
      orderBy: { obtainedAt: 'desc' },
    });
    res.json(userBadges);
  } catch (err) {
    next(err);
  }
};

// ── Ajouter du XP hors-leçons (mini-jeux, SOS, Marché…) ─────────────────────
const addXp = async (req, res, next) => {
  try {
    const { xp, source } = req.body;
    if (!xp || typeof xp !== 'number' || xp <= 0 || xp > 500) {
      return res.status(400).json({ error: 'xp doit être un entier entre 1 et 500' });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        bonusXp: { increment: Math.round(xp) },
        lastActiveAt: new Date(),
      },
      select: { bonusXp: true, streak: true },
    });

    res.json({ bonusXp: user.bonusXp, source: source || 'unknown' });
  } catch (err) {
    next(err);
  }
};

// ── Leaderboard hebdomadaire / global ────────────────────────────────────────
const getLeaderboard = async (req, res, next) => {
  try {
    const { type = 'weekly', limit = 20 } = req.query;
    const safeLimit = Math.min(50, parseInt(limit) || 20);

    let leaderboard;

    if (type === 'weekly') {
      // XP gagnés depuis le lundi de la semaine courante
      const monday = new Date();
      monday.setDate(monday.getDate() - monday.getDay() + (monday.getDay() === 0 ? -6 : 1));
      monday.setHours(0, 0, 0, 0);

      // Agréger XP (leçons) + bonusXp de cette semaine via userProgress
      const weeklyData = await prisma.userProgress.groupBy({
        by: ['userId'],
        where: { dateCompletion: { gte: monday }, statut: 'completed' },
        _sum: { xpGained: true },
        orderBy: { _sum: { xpGained: 'desc' } },
        take: safeLimit,
      });

      // Récupérer les infos utilisateurs
      const userIds = weeklyData.map(d => d.userId);
      const users   = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, prenom: true, nom: true, photoUrl: true, bonusXp: true, streak: true },
      });
      const usersMap = Object.fromEntries(users.map(u => [u.id, u]));

      // Calcul XP total pour le grade
      const allProgress = await prisma.userProgress.groupBy({
        by: ['userId'],
        where: { userId: { in: userIds }, statut: 'completed' },
        _sum: { xpGained: true },
      });
      const totalXpMap = Object.fromEntries(
        allProgress.map(d => [d.userId, (d._sum.xpGained || 0) + (usersMap[d.userId]?.bonusXp || 0)])
      );

      leaderboard = weeklyData
        .filter(d => usersMap[d.userId])
        .map(d => ({
          userId:    d.userId,
          prenom:    usersMap[d.userId]?.prenom,
          photoUrl:  usersMap[d.userId]?.photoUrl,
          weeklyXp:  d._sum.xpGained || 0,
          totalXp:   totalXpMap[d.userId] || 0,
          streak:    usersMap[d.userId]?.streak || 0,
        }));
    } else {
      // Global : XP total (leçons + bonus)
      const progress = await prisma.userProgress.groupBy({
        by: ['userId'],
        where: { statut: 'completed' },
        _sum: { xpGained: true },
        orderBy: { _sum: { xpGained: 'desc' } },
        take: safeLimit,
      });

      const userIds = progress.map(d => d.userId);
      const users   = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, prenom: true, nom: true, photoUrl: true, bonusXp: true, streak: true },
      });
      const usersMap = Object.fromEntries(users.map(u => [u.id, u]));

      const withBonus = progress.map(d => ({
        userId:   d.userId,
        totalXp:  (d._sum.xpGained || 0) + (usersMap[d.userId]?.bonusXp || 0),
        prenom:   usersMap[d.userId]?.prenom,
        photoUrl: usersMap[d.userId]?.photoUrl,
        streak:   usersMap[d.userId]?.streak || 0,
      })).filter(d => d.prenom);

      withBonus.sort((a, b) => b.totalXp - a.totalXp);
      leaderboard = withBonus;
    }

    // Trouver le rang de l'utilisateur courant
    const myRankIdx = leaderboard.findIndex(e => e.userId === req.user.id);
    const myRank    = myRankIdx >= 0 ? myRankIdx + 1 : null;

    res.json({ leaderboard, myRank, type });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProgress, completeLesson, getUserBadges, addXp, getLeaderboard };
