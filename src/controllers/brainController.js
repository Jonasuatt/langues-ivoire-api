const prisma = require('../lib/prisma');

/**
 * 🧠 Cerveau Numérique — la mémoire centrale de LANGUES IVOIRE.
 *
 * Tous les modules écrivent dans la même base ; le Cerveau en est la vue
 * unifiée : pour chaque langue, combien de connaissances existent dans
 * chaque domaine (mots, phrases, leçons, culture, textes, audio certifié…),
 * et quels domaines restent à nourrir. C'est l'outil de pilotage de la
 * couverture linguistique — et la preuve mesurable du patrimoine numérisé.
 */

// GET /api/brain/overview
const getOverview = async (req, res, next) => {
  try {
    // Regroupements par langue, en parallèle (une requête par domaine)
    const [
      languages,
      dict, phrases, lessons, cultural, textes, videos,
      sensMots, math, monnaie, marche, secours, civisme, tutors,
      audioTotal, audioCertified,
      totalUsers, totalSrsCards, totalClassrooms, totalEnrollments,
    ] = await Promise.all([
      prisma.language.findMany({
        where: { isActive: true },
        select: { id: true, nom: true, code: true, emoji: true, famille: true, iso639_3: true, isInMvp: true },
        orderBy: { nom: 'asc' },
      }),
      prisma.dictionaryEntry.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.usefulPhrase.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.lesson.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.culturalItem.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.textContent.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.video.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.sensMot.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.mathContenu.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.monnaieContenu.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.marcheDialogue.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.premierSecoursPhrase.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.civicContent.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.tutor.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.audioContribution.groupBy({ by: ['languageId'], _count: { _all: true } }),
      prisma.audioContribution.groupBy({
        by: ['languageId'], _count: { _all: true },
        where: { certificationStatus: 'CERTIFIED_ILA' },
      }),
      prisma.user.count(),
      prisma.srsCard.count(),
      prisma.classroom.count(),
      prisma.enrollment.count(),
    ]);

    const toMap = (rows) => Object.fromEntries(rows.map(r => [r.languageId, r._count._all]));
    const maps = {
      mots: toMap(dict), phrases: toMap(phrases), lecons: toMap(lessons),
      culture: toMap(cultural), textes: toMap(textes), videos: toMap(videos),
      sensMots: toMap(sensMots), math: toMap(math), monnaie: toMap(monnaie),
      marche: toMap(marche), secours: toMap(secours), civisme: toMap(civisme),
      tuteurs: toMap(tutors), audios: toMap(audioTotal), audiosCertifies: toMap(audioCertified),
    };

    const parLangue = languages.map(l => {
      const row = { langue: l };
      let total = 0;
      for (const [domaine, map] of Object.entries(maps)) {
        const n = map[l.id] ?? 0;
        row[domaine] = n;
        if (domaine !== 'audiosCertifies') total += n;
      }
      row.totalNeurones = total; // volume total de connaissances pour cette langue
      return row;
    });
    parLangue.sort((a, b) => b.totalNeurones - a.totalNeurones);

    // Totaux globaux (toutes langues + contenus universels sans langue)
    const sum = (map) => Object.values(map).reduce((s, n) => s + n, 0);
    const global = {
      langues: languages.length,
      mots: sum(maps.mots), phrases: sum(maps.phrases), lecons: sum(maps.lecons),
      culture: sum(maps.culture), textes: sum(maps.textes), videos: sum(maps.videos),
      audios: sum(maps.audios), audiosCertifies: sum(maps.audiosCertifies),
      utilisateurs: totalUsers, cartesRevision: totalSrsCards,
      classes: totalClassrooms, elevesInscrits: totalEnrollments,
    };
    global.totalNeurones = parLangue.reduce((s, r) => s + r.totalNeurones, 0);

    res.json({ global, parLangue, generatedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/brain/answers — mémoire du Cerveau, la plus réutilisée d'abord.
 * Permet à l'équipe éditoriale de relire ce que l'IA a produit et qui est
 * désormais servi à sa place.
 */
const listAnswers = async (req, res, next) => {
  try {
    const { scope, languageId, q, take = 50, skip = 0 } = req.query;
    const where = {
      ...(scope ? { scope } : {}),
      ...(languageId ? { languageId } : {}),
      ...(q ? { questionNorm: { contains: String(q).toLowerCase() } } : {}),
    };
    const [total, reponses, cumul] = await Promise.all([
      prisma.brainAnswer.count({ where }),
      prisma.brainAnswer.findMany({
        where, orderBy: [{ hits: 'desc' }, { createdAt: 'desc' }],
        take: Math.min(Number(take) || 50, 200), skip: Number(skip) || 0,
      }),
      prisma.brainAnswer.aggregate({ _sum: { hits: true }, _count: true }),
    ]);
    res.json({
      total,
      reponses,
      memoire: {
        entrees: cumul._count,
        reutilisations: cumul._sum.hits || 0, // appels IA évités
      },
    });
  } catch (err) { next(err); }
};

/** PATCH /api/brain/answers/:id — activer/désactiver une réponse mémorisée. */
const toggleAnswer = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const maj = await prisma.brainAnswer.update({
      where: { id: req.params.id },
      data: { isActive: isActive !== false },
    });
    res.json(maj);
  } catch (err) { next(err); }
};

module.exports = { getOverview, listAnswers, toggleAnswer };
