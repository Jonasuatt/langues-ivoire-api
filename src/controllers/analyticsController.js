const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const day1 = new Date(now - 86400000);
    const day7 = new Date(now - 7 * 86400000);
    const day30 = new Date(now - 30 * 86400000);

    const [
      totalUsers, activeD1, activeD7, activeD30,
      totalLessonsCompleted, totalContributions,
      pendingContributions, totalWords, totalPhrases,
      totalBadgesEarned, totalLessons, totalCultural,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { lastActiveAt: { gte: day1 } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: day7 } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: day30 } } }),
      prisma.userProgress.count({ where: { statut: 'completed' } }),
      prisma.contribution.count(),
      prisma.contribution.count({ where: { status: 'PENDING' } }),
      prisma.dictionaryEntry.count({ where: { status: 'PUBLISHED' } }),
      prisma.usefulPhrase.count({ where: { status: 'PUBLISHED' } }),
      prisma.userBadge.count(),
      prisma.lesson.count({ where: { isActive: true } }),
      prisma.culturalItem.count({ where: { isActive: true } }),
    ]);

    res.json({
      users: { total: totalUsers, activeD1, activeD7, activeD30 },
      content: { totalWords, totalPhrases, totalLessonsCompleted, totalLessons, totalCultural },
      contributions: { total: totalContributions, pending: pendingContributions },
      gamification: { totalBadgesEarned },
      retentionD1: totalUsers > 0 ? ((activeD1 / totalUsers) * 100).toFixed(1) : 0,
      retentionD7: totalUsers > 0 ? ((activeD7 / totalUsers) * 100).toFixed(1) : 0,
      retentionD30: totalUsers > 0 ? ((activeD30 / totalUsers) * 100).toFixed(1) : 0,
    });
  } catch (err) {
    next(err);
  }
};

// Activité quotidienne sur les 30 derniers jours
const getDailyActivity = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 86400000);

    // Utilisateurs actifs par jour
    const activeUsers = await prisma.$queryRaw`
      SELECT DATE("lastActiveAt") as date, COUNT(DISTINCT id)::int as count
      FROM users
      WHERE "lastActiveAt" >= ${since}
      GROUP BY DATE("lastActiveAt")
      ORDER BY date
    `;

    // Leçons complétées par jour
    const lessonsCompleted = await prisma.$queryRaw`
      SELECT DATE("dateCompletion") as date, COUNT(*)::int as count
      FROM user_progress
      WHERE statut = 'completed' AND "dateCompletion" >= ${since}
      GROUP BY DATE("dateCompletion")
      ORDER BY date
    `;

    // Contributions par jour
    const contributions = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM contributions
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    // Fusionner en un seul tableau par date
    const dateMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      const key = d.toISOString().split('T')[0];
      dateMap[key] = { date: key, activeUsers: 0, lessonsCompleted: 0, contributions: 0 };
    }
    activeUsers.forEach(r => { const k = r.date.toISOString().split('T')[0]; if (dateMap[k]) dateMap[k].activeUsers = r.count; });
    lessonsCompleted.forEach(r => { const k = r.date.toISOString().split('T')[0]; if (dateMap[k]) dateMap[k].lessonsCompleted = r.count; });
    contributions.forEach(r => { const k = r.date.toISOString().split('T')[0]; if (dateMap[k]) dateMap[k].contributions = r.count; });

    res.json(Object.values(dateMap));
  } catch (err) {
    next(err);
  }
};

// Statistiques par langue
const getLanguageStats = async (req, res, next) => {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      select: {
        id: true, nom: true, code: true,
        _count: {
          select: {
            dictEntries: { where: { status: 'PUBLISHED' } },
            usefulPhrases: { where: { status: 'PUBLISHED' } },
            lessons: { where: { isActive: true } },
            contributions: true,
            culturalItems: { where: { isActive: true } },
          },
        },
      },
      orderBy: { ordreAffichage: 'asc' },
    });

    // Nombre de leçons complétées par langue
    const completionsByLanguage = await prisma.$queryRaw`
      SELECT l."languageId", COUNT(*)::int as completed
      FROM user_progress up
      JOIN lessons l ON l.id = up."lessonId"
      WHERE up.statut = 'completed'
      GROUP BY l."languageId"
    `;
    const completionMap = {};
    completionsByLanguage.forEach(r => { completionMap[r.languageId] = r.completed; });

    // Nombre d'apprenants uniques par langue
    const learnersByLanguage = await prisma.$queryRaw`
      SELECT l."languageId", COUNT(DISTINCT up."userId")::int as learners
      FROM user_progress up
      JOIN lessons l ON l.id = up."lessonId"
      GROUP BY l."languageId"
    `;
    const learnersMap = {};
    learnersByLanguage.forEach(r => { learnersMap[r.languageId] = r.learners; });

    const result = languages.map(lang => ({
      id: lang.id,
      nom: lang.nom,
      code: lang.code,
      words: lang._count.dictEntries,
      phrases: lang._count.usefulPhrases,
      lessons: lang._count.lessons,
      contributions: lang._count.contributions,
      culturalItems: lang._count.culturalItems,
      lessonsCompleted: completionMap[lang.id] || 0,
      learners: learnersMap[lang.id] || 0,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Top utilisateurs (engagement)
const getTopUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topByXp = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true, prenom: true, nom: true, streak: true,
        _count: { select: { progress: { where: { statut: 'completed' } }, badges: true, contributions: true } },
      },
      orderBy: { streak: 'desc' },
      take: limit,
    });

    // Calculer XP total pour chaque user
    const userIds = topByXp.map(u => u.id);
    const xpData = await prisma.$queryRaw`
      SELECT up."userId",
        COALESCE(SUM(l."pointsXp"), 0)::int as "totalXp"
      FROM user_progress up
      JOIN lessons l ON l.id = up."lessonId"
      WHERE up.statut = 'completed' AND up."userId" = ANY(${userIds})
      GROUP BY up."userId"
    `;
    const xpMap = {};
    xpData.forEach(r => { xpMap[r.userId] = r.totalXp; });

    const result = topByXp.map(u => ({
      id: u.id,
      prenom: u.prenom,
      nom: u.nom,
      streak: u.streak,
      totalXp: xpMap[u.id] || 0,
      lessonsCompleted: u._count.progress,
      badges: u._count.badges,
      contributions: u._count.contributions,
    }));

    // Trier par XP total
    result.sort((a, b) => b.totalXp - a.totalXp);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getDailyActivity, getLanguageStats, getTopUsers };
