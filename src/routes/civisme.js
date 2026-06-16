const prisma = require('../lib/prisma');
const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');

// GET /api/civisme?languageId=X&type=X&limit=50
router.get('/', async (req, res, next) => {
  try {
    const { languageId, type, valeur, limit = 50 } = req.query;
    const where = { isActive: true };
    if (languageId) where.languageId = languageId;
    if (type) where.type = type;
    if (valeur) where.valeur = valeur;
    const items = await prisma.civicContent.findMany({
      where,
      take: parseInt(limit),
      orderBy: [{ type: 'asc' }, { titre: 'asc' }],
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json({ data: items, total: items.length });
  } catch (err) { next(err); }
});

// POST /api/civisme
router.post('/', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { languageId, type, titre, contenu, traduction, explication, audioUrl, imageUrl, genreVoix, valeur } = req.body;
    if (!titre || !contenu) return res.status(400).json({ error: 'titre et contenu requis' });
    const item = await prisma.civicContent.create({
      data: {
        languageId: languageId || null,
        type: type || 'proverbe_civique',
        titre,
        contenu,
        traduction: traduction || null,
        explication: explication || null,
        audioUrl: audioUrl || null,
        imageUrl: imageUrl || null,
        genreVoix: genreVoix || null,
        valeur: valeur || null,
      },
      include: { language: { select: { nom: true, code: true } } },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

// PATCH /api/civisme/:id
router.patch('/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    const item = await prisma.civicContent.update({
      where: { id: req.params.id },
      data: req.body,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(item);
  } catch (err) { next(err); }
});

// DELETE /api/civisme/:id (soft delete)
router.delete('/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    await prisma.civicContent.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
