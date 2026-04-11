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

    // Vérifier les nouveaux badges
    const newBadges = await checkBadges(req.user.id);

    res.json({ progress, pointsXp: lesson.pointsXp, streak: newStreak, newBadges });
  } catch (err) {
    next(err);
  }
};

const checkBadges = async (userId) => {
  const badges = await prisma.badge.findMany();
  const userBadges = await prisma.userBadge.findMany({ where: { userId } });
  const userBadgeIds = new Set(userBadges.map(b => b.badgeId));
  const newBadges = [];

  const completedLessons = await prisma.userProgress.count({
    where: { userId, statut: 'completed' },
  });
  const contributions = await prisma.contribution.count({ where: { userId } });

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

module.exports = { getUserProgress, completeLesson, getUserBadges };
