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

    const [languages, lessons, dictEntries, phrases, tutors, culturalItems] = await Promise.all([
      prisma.language.findMany({ where: { isActive: true }, include: { tutor: { select: { nomAvatar: true, imageUrl: true } } } }),
      prisma.lesson.findMany({ where: { isActive: true }, include: { steps: { include: { exercises: true } } } }),
      prisma.dictionaryEntry.findMany({ where: { status: 'PUBLISHED' } }),
      prisma.usefulPhrase.findMany({ where: { status: 'PUBLISHED' } }),
      prisma.tutor.findMany({ where: { isActive: true } }),
      prisma.culturalItem.findMany({ where: { isActive: true }, orderBy: { datePublication: 'desc' }, take: 100 }),
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
