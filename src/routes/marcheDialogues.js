/**
 * Routes Dialogues du Marché
 * Public  : GET /api/marche-dialogues          — liste par langue
 * Admin   : GET /api/marche-dialogues/admin/list
 *           POST|PATCH|DELETE /api/marche-dialogues/admin/:id
 */
const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INCLUDE = {
  language: { select: { nom: true, code: true } },
};

// ─── Admin : liste paginée ────────────────────────────────────────────────────

// GET /api/marche-dialogues/admin/list?page=1&limit=20&langue=
router.get('/admin/list', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, langue } = req.query;
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (langue) where.languageId = langue;

    const [data, total] = await Promise.all([
      prisma.marcheDialogue.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: INCLUDE,
      }),
      prisma.marcheDialogue.count({ where }),
    ]);

    res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { next(err); }
});

// POST /api/marche-dialogues/admin
router.post('/admin', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { languageId, vendeur, vendeurDesc, salutation, repliques, audioSalutation, isActive } = req.body;
    if (!languageId) return res.status(400).json({ error: 'languageId est obligatoire' });
    if (!vendeur?.trim()) return res.status(400).json({ error: 'Le nom du vendeur est obligatoire' });
    if (!salutation?.trim()) return res.status(400).json({ error: 'La salutation est obligatoire' });

    const dialogue = await prisma.marcheDialogue.create({
      data: {
        languageId,
        vendeur: vendeur.trim(),
        vendeurDesc: vendeurDesc?.trim() || null,
        salutation: salutation.trim(),
        repliques: repliques || [],
        audioSalutation: audioSalutation?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: INCLUDE,
    });
    res.status(201).json(dialogue);
  } catch (err) { next(err); }
});

// PATCH /api/marche-dialogues/admin/:id
router.patch('/admin/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { languageId, vendeur, vendeurDesc, salutation, repliques, audioSalutation, isActive } = req.body;
    const data = {};
    if (languageId      !== undefined) data.languageId      = languageId;
    if (vendeur         !== undefined) data.vendeur         = vendeur?.trim();
    if (vendeurDesc     !== undefined) data.vendeurDesc     = vendeurDesc?.trim() || null;
    if (salutation      !== undefined) data.salutation      = salutation?.trim();
    if (repliques       !== undefined) data.repliques       = repliques;
    if (audioSalutation !== undefined) data.audioSalutation = audioSalutation?.trim() || null;
    if (isActive        !== undefined) data.isActive        = isActive;

    const dialogue = await prisma.marcheDialogue.update({
      where: { id: req.params.id },
      data,
      include: INCLUDE,
    });
    res.json(dialogue);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Dialogue introuvable' });
    next(err);
  }
});

// DELETE /api/marche-dialogues/admin/:id
router.delete('/admin/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    await prisma.marcheDialogue.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Dialogue introuvable' });
    next(err);
  }
});

// ─── Public ───────────────────────────────────────────────────────────────────

// GET /api/marche-dialogues?languageCode=dioula&languageId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { languageCode, languageId } = req.query;
    const where = { isActive: true };

    if (languageId) {
      where.languageId = languageId;
    } else if (languageCode) {
      const lang = await prisma.language.findFirst({ where: { code: languageCode } });
      if (!lang) return res.json({ data: [] });
      where.languageId = lang.id;
    }

    const dialogues = await prisma.marcheDialogue.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: INCLUDE,
    });
    res.json({ data: dialogues, total: dialogues.length });
  } catch (err) { next(err); }
});

// GET /api/marche-dialogues/:id
router.get('/:id', async (req, res, next) => {
  try {
    const dialogue = await prisma.marcheDialogue.findUnique({
      where: { id: req.params.id },
      include: INCLUDE,
    });
    if (!dialogue) return res.status(404).json({ error: 'Dialogue introuvable' });
    res.json(dialogue);
  } catch (err) { next(err); }
});

module.exports = router;
