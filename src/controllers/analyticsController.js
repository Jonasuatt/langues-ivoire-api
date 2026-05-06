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
      totalLessonsCompleted, totalContributions, pendingContributions,
      totalWords, totalPhrases, totalTutors, totalCultural,
      totalAudioContribs, totalLessons,
      totalPremierSecours, totalCivisme,
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
      prisma.$queryRaw`SELECT COUNT(*)::int FROM premiers_secours_phrases WHERE "isActive" = true`.then(r => Number(r[0]?.count) || 0).catch(() => 0),
      prisma.$queryRaw`SELECT COUNT(*)::int FROM civic_content WHERE "isActive" = true`.then(r => Number(r[0]?.count) || 0).catch(() => 0),
    ]);

    res.json({
      users: { total: totalUsers, activeD1, activeD7, activeD30 },
      content: { totalWords, totalPhrases, totalLessonsCompleted },
      contributions: { total: totalContributions, pending: pendingContributions },
      modules: {
        vocabulary: totalWords,
        contributions: totalContributions,
        lessons: totalLessons,
        tutors: totalTutors,
        cultural: totalCultural,
        phrases: totalPhrases,
        audioContribs: totalAudioContribs,
        premierSecours: totalPremierSecours,
        civisme: totalCivisme,
        textContents: 0,
        images: 0,
      },
      retentionD1: totalUsers > 0 ? ((activeD1 / totalUsers) * 100).toFixed(1) : 0,
      retentionD7: totalUsers > 0 ? ((activeD7 / totalUsers) * 100).toFixed(1) : 0,
      retentionD30: totalUsers > 0 ? ((activeD30 / totalUsers) * 100).toFixed(1) : 0,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
