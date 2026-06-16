const prisma = require('../lib/prisma');

// Endpoint de synchronisation globale pour le mode offline de l'app mobile
const fullSync = async (req, res, next) => {
  try {
    const { langue } = req.query;

    // Résoudre le languageId depuis le code ou l'id passé en paramètre
    let languageId = null;
    if (langue) {
      const language = await prisma.language.findFirst({
        where: { OR: [{ id: langue }, { code: langue }] },
      });
      if (language) languageId = language.id;
    }

    // Filtre appliqué à toutes les collections liées à une langue
    const byLang = languageId ? { languageId } : {};

    const [languages, lessons, dictEntries, phrases, tutors, culturalItems] = await Promise.all([
      // Liste des langues — toujours complète (utile pour l'UI)
      prisma.language.findMany({
        where: { isActive: true },
        include: { tutors: { select: { nomAvatar: true, imageUrl: true, genre: true } } },
      }),
      // Leçons filtrées par langue
      prisma.lesson.findMany({
        where: { isActive: true, ...byLang },
        include: { steps: { include: { exercises: true } } },
      }),
      // Dictionnaire filtré par langue
      prisma.dictionaryEntry.findMany({
        where: { status: 'PUBLISHED', ...byLang },
      }),
      // Phrases utiles filtrées par langue
      prisma.usefulPhrase.findMany({
        where: { status: 'PUBLISHED', ...byLang },
      }),
      // Tuteurs filtrés par langue
      prisma.tutor.findMany({
        where: { isActive: true, ...byLang },
      }),
      // Contenus culturels filtrés par langue (limité à 200)
      prisma.culturalItem.findMany({
        where: { isActive: true, ...byLang },
        orderBy: { datePublication: 'desc' },
        take: 200,
      }),
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
