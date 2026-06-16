const prisma = require('../lib/prisma');
const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');

// GET /api/premiers-secours?languageId=X&situation=X&limit=50
router.get('/', async (req, res, next) => {
  try {
    const { languageId, situation, limit = 50 } = req.query;
    const where = { isActive: true };
    if (languageId) where.languageId = languageId;
    if (situation) where.situation = situation;
    const items = await prisma.premierSecoursPhrase.findMany({
      where,
      take: parseInt(limit),
      orderBy: [{ priorite: 'desc' }, { situation: 'asc' }],
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json({ data: items, total: items.length });
  } catch (err) { next(err); }
});

// POST /api/premiers-secours (auth requis)
router.post('/', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { languageId, situation, consigne, traduction, transcription, audioUrl, audioUrlFr, audioUrlF, audioUrlFrF, imageUrl, genreVoix, priorite } = req.body;
    if (!consigne || !situation) return res.status(400).json({ error: 'consigne et situation requis' });
    const item = await prisma.premierSecoursPhrase.create({
      data: {
        languageId: languageId || null,
        situation,
        consigne,
        traduction: traduction || null,
        transcription: transcription || null,
        audioUrl: audioUrl || null,
        audioUrlFr: audioUrlFr || null,
        audioUrlF: audioUrlF || null,
        audioUrlFrF: audioUrlFrF || null,
        imageUrl: imageUrl || null,
        genreVoix: genreVoix || null,
        priorite: parseInt(priorite) || 0,
      },
      include: { language: { select: { nom: true, code: true } } },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

// PATCH /api/premiers-secours/:id
router.patch('/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    const item = await prisma.premierSecoursPhrase.update({
      where: { id: req.params.id },
      data: req.body,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(item);
  } catch (err) { next(err); }
});

// DELETE /api/premiers-secours/:id (soft delete)
router.delete('/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    await prisma.premierSecoursPhrase.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
