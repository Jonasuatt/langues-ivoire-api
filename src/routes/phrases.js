/**
 * Route publique — Phrases utiles / SOS
 * Accessible sans authentification (lecture seule)
 */
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/phrases?languageCode=dioula&categorie=urgence&limit=50
router.get('/', async (req, res, next) => {
  try {
    const { languageCode, languageId, categorie, status = 'PUBLISHED', limit = 50 } = req.query;

    const where = { status };

    if (languageId) {
      where.languageId = languageId;
    } else if (languageCode) {
      // Résoudre le code en ID
      const lang = await prisma.language.findFirst({ where: { code: languageCode } });
      if (!lang) return res.json({ data: [] });
      where.languageId = lang.id;
    }

    if (categorie) where.categorie = categorie;

    const phrases = await prisma.usefulPhrase.findMany({
      where,
      take: parseInt(limit),
      orderBy: [{ categorie: 'asc' }, { phrase: 'asc' }],
      select: {
        id: true,
        phrase: true,
        transcription: true,
        traduction: true,
        audioUrl: true,
        categorie: true,
        contexte: true,
        languageId: true,
      },
    });

    res.json({ data: phrases, total: phrases.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
