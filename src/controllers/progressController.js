const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    const stats = {
      totalLessons: progress.length,
      completed: progress.filter(p => p.statut === 'completed').length,
      totalXp: progress.filter(p => p.statut === 'completed').reduce((sum, p) => sum + (p.lesson.pointsXp || 0), 0),
      streak: req.user.streak,
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

    const progress = await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: req.user.id, lessonId: id } },
      create: {
        userId: req.user.id,
        lessonId: id,
        statut: 'completed',
        score: score || 100,
        dateCompletion: new Date(),
        attempts: 1,
      },
      update: {
        statut: 'completed',
        score: score || 100,
        dateCompletion: new Date(),
        attempts: { increment: 1 },
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

    // Bonus XP basé sur le streak
    let streakBonus = 0;
    if (newStreak >= 30) streakBonus = Math.round(lesson.pointsXp * 0.5);
    else if (newStreak >= 14) streakBonus = Math.round(lesson.pointsXp * 0.3);
    else if (newStreak >= 7) streakBonus = Math.round(lesson.pointsXp * 0.2);
    else if (newStreak >= 3) streakBonus = Math.round(lesson.pointsXp * 0.1);

    // Vérifier les nouveaux badges
    const newBadges = await checkBadges(req.user.id);

    res.json({
      progress,
      pointsXp: lesson.pointsXp,
      streakBonus,
      totalXpEarned: lesson.pointsXp + streakBonus,
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

  // Récupérer les stats une seule fois
  const [user, completedLessons, contributions, completedProgress] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { streak: true } }),
    prisma.userProgress.count({ where: { userId, statut: 'completed' } }),
    prisma.contribution.count({ where: { userId } }),
    prisma.userProgress.findMany({
      where: { userId, statut: 'completed' },
      include: { lesson: { select: { pointsXp: true, niveau: true, languageId: true } } },
    }),
  ]);

  const totalXp = completedProgress.reduce((sum, p) => sum + (p.lesson.pointsXp || 0), 0);
  const languagesStudied = new Set(completedProgress.map(p => p.lesson.languageId)).size;
  const levelsReached = new Set(completedProgress.map(p => p.lesson.niveau));

  for (const badge of badges) {
    if (userBadgeIds.has(badge.id)) continue;
    const cond = badge.condition;
    let earned = false;

    switch (cond.type) {
      case 'lessons_completed':
        earned = completedLessons >= cond.count;
        break;
      case 'contributions':
        earned = contributions >= cond.count;
        break;
      case 'streak':
        earned = (user?.streak || 0) >= cond.count;
        break;
      case 'total_xp':
        earned = totalXp >= cond.count;
        break;
      case 'languages_studied':
        earned = languagesStudied >= cond.count;
        break;
      case 'level_reached':
        earned = levelsReached.has(cond.level);
        break;
      case 'cultural_views':
        // Pour le moment, basé sur un compteur futur
        break;
    }

    if (earned) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      // Créer une notification pour le badge gagné
      await prisma.notification.create({
        data: {
          userId,
          type: 'BADGE_EARNED',
          titre: 'Nouveau badge !',
          corps: `Vous avez gagné le badge "${badge.nom}" ! +${badge.pointsXp} XP`,
          data: { badgeId: badge.id, badgeName: badge.nom, pointsXp: badge.pointsXp },
        },
      });
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

module.exports = { getUserProgress, completeLesson, getUserBadges };
