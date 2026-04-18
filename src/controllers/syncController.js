const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Endpoint de synchronisation globale pour le mode offline de l'app mobile
const fullSync = async (req, res, next) => {
  try {
    const { langue } = req.query;
    const where = { isActive: true };
    if (langue) {
      const language = await prisma.language.findFirst({ where: { OR: [{ id: langue }, { code: langue }] } });
      if (language) where.languageId = language.id;
    }

    const dictWhere = { status: 'PUBLISHED' };
    const phraseWhere = { status: 'PUBLISHED' };
    const lessonWhere = { isActive: true };
    const culturalWhere = { isActive: true };
    if (where.languageId) {
      dictWhere.languageId = where.languageId;
      phraseWhere.languageId = where.languageId;
      lessonWhere.languageId = where.languageId;
      culturalWhere.languageId = where.languageId;
    }

    const [languages, lessons, dictEntries, phrases, tutors, culturalItems] = await Promise.all([
      prisma.language.findMany({ where: { isActive: true }, include: { tutors: { select: { nomAvatar: true, imageUrl: true, genre: true } } } }),
      prisma.lesson.findMany({ where: lessonWhere, include: { steps: { include: { exercises: true } } } }),
      prisma.dictionaryEntry.findMany({ where: dictWhere }),
      prisma.usefulPhrase.findMany({ where: phraseWhere }),
      prisma.tutor.findMany({ where: { isActive: true } }),
      prisma.culturalItem.findMany({ where: culturalWhere, orderBy: { datePublication: 'desc' }, take: 100 }),
    ]);

    res.json({
      version: Date.now(),
      languages,
      lessons,
      dictEntries,
      phrases,
      tutors,
      culturalItems,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { fullSync };
