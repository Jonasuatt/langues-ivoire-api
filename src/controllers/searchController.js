const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/search?q=bonjour&langue=baoule
 *
 * Recherche globale sur :
 *   - dictionaryEntry  (mot, traduction, exemple)
 *   - lesson           (titre, description)
 *   - culturalItem     (contenu, traduction, sourceEthnique)
 *
 * Réponse : { query, total, mots: [], lecons: [], culture: [] }
 */
const globalSearch = async (req, res, next) => {
  try {
    const { q, langue } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Requête trop courte (min. 2 caractères)' });
    }

    const term = q.trim();

    // ─── Filtre langue optionnel ───────────────────────────────────────────
    let langFilter = {};
    if (langue) {
      const lang = await prisma.language.findFirst({
        where: { OR: [{ id: langue }, { code: langue }], isActive: true },
        select: { id: true },
      });
      if (lang) langFilter = { languageId: lang.id };
    }

    // ─── Recherches parallèles ─────────────────────────────────────────────
    const [mots, lecons, culture] = await Promise.all([

      // 1. Mots du dictionnaire
      prisma.dictionaryEntry.findMany({
        where: {
          status: 'PUBLISHED',
          ...langFilter,
          OR: [
            { mot:        { contains: term, mode: 'insensitive' } },
            { traduction: { contains: term, mode: 'insensitive' } },
            { exemple:    { contains: term, mode: 'insensitive' } },
          ],
        },
        take: 10,
        orderBy: { mot: 'asc' },
        include: { language: { select: { nom: true, code: true } } },
      }),

      // 2. Leçons
      prisma.lesson.findMany({
        where: {
          isActive: true,
          ...langFilter,
          OR: [
            { titre:       { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: 6,
        orderBy: [{ niveau: 'asc' }, { ordre: 'asc' }],
        include: { language: { select: { id: true, nom: true, code: true } } },
      }),

      // 3. Contenu culturel
      prisma.culturalItem.findMany({
        where: {
          isActive: true,
          ...langFilter,
          OR: [
            { contenu:        { contains: term, mode: 'insensitive' } },
            { traduction:     { contains: term, mode: 'insensitive' } },
            { sourceEthnique: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: 6,
        orderBy: { datePublication: 'desc' },
        include: { language: { select: { nom: true, code: true } } },
      }),
    ]);

    res.json({
      query: term,
      total: mots.length + lecons.length + culture.length,
      mots,
      lecons,
      culture,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { globalSearch };
