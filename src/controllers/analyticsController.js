const prisma = require('../lib/prisma');

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const day1  = new Date(now - 86400000);
    const day7  = new Date(now - 7 * 86400000);
    const day30 = new Date(now - 30 * 86400000);

    const [
      totalUsers, activeD1, activeD7, activeD30,
      totalLessonsCompleted, totalContributions, pendingContributions,
      totalWords, totalPhrases, totalTutors, totalCultural,
      totalAudioContribs, totalLessons,
      totalPremierSecours, totalCivisme,
      totalMath, totalMonnaie, totalPartenaires,
      newUsersD7,
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
      prisma.tutor.count({ where: { isActive: true } }),
      prisma.culturalItem.count({ where: { isActive: true } }),
      prisma.audioContribution.count({ where: { isActive: true } }),
      prisma.lesson.count({ where: { isActive: true } }),
      prisma.$queryRaw`SELECT COUNT(*)::int FROM premiers_secours_phrases WHERE "isActive" = true`
        .then(r => Number(r[0]?.count) || 0).catch(() => 0),
      prisma.$queryRaw`SELECT COUNT(*)::int FROM civic_content WHERE "isActive" = true`
        .then(r => Number(r[0]?.count) || 0).catch(() => 0),
      prisma.mathContenu.count({ where: { isActive: true } }).catch(() => 0),
      prisma.monnaieContenu.count({ where: { isActive: true } }).catch(() => 0),
      prisma.partenaire.count({ where: { isActive: true } }).catch(() => 0),
      prisma.user.count({ where: { createdAt: { gte: day7 } } }),
    ]);

    // ── Activité journalière réelle (7 derniers jours) ──────────────────────
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const count = await prisma.user.count({
        where: { lastActiveAt: { gte: dayStart, lte: dayEnd } },
      });
      dailyActivity.push({
        name: DAYS[dayStart.getDay()],
        date: dayStart.toISOString().split('T')[0],
        users: count,
      });
    }

    // ── Top langues par leçons complétées ──────────────────────────────────
    const topLanguages = await prisma.userProgress.groupBy({
      by: ['lessonId'],
      where: { statut: 'completed' },
      _count: { lessonId: true },
    }).then(async (groups) => {
      const lessonIds = groups.map(g => g.lessonId);
      const lessons = await prisma.lesson.findMany({
        where: { id: { in: lessonIds } },
        select: { id: true, language: { select: { nom: true, code: true, emoji: true } } },
      });
      const langMap = {};
      lessons.forEach(l => {
        const key = l.language?.code || 'inconnu';
        const count = groups.find(g => g.lessonId === l.id)?._count?.lessonId || 0;
        langMap[key] = {
          nom: l.language?.nom || key,
          emoji: l.language?.emoji || '🌍',
          count: (langMap[key]?.count || 0) + count,
        };
      });
      return Object.entries(langMap)
        .map(([code, v]) => ({ code, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }).catch(() => []);

    res.json({
      users: { total: totalUsers, activeD1, activeD7, activeD30, newUsersD7 },
      content: { totalWords, totalPhrases, totalLessonsCompleted },
      contributions: { total: totalContributions, pending: pendingContributions },
      modules: {
        vocabulary:    totalWords,
        contributions: totalContributions,
        lessons:       totalLessons,
        tutors:        totalTutors,
        cultural:      totalCultural,
        phrases:       totalPhrases,
        audioContribs: totalAudioContribs,
        premierSecours:totalPremierSecours,
        civisme:       totalCivisme,
        math:          totalMath,
        monnaie:       totalMonnaie,
        partenaires:   totalPartenaires,
        textContents:  0,
        images:        0,
      },
      retentionD1:  totalUsers > 0 ? ((activeD1  / totalUsers) * 100).toFixed(1) : 0,
      retentionD7:  totalUsers > 0 ? ((activeD7  / totalUsers) * 100).toFixed(1) : 0,
      retentionD30: totalUsers > 0 ? ((activeD30 / totalUsers) * 100).toFixed(1) : 0,
      dailyActivity,
      topLanguages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
