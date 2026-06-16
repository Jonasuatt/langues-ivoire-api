const prisma = require('../lib/prisma');
/**
 * Routes Galeries d'Images
 * Public  : GET /api/image-galleries, GET /api/image-galleries/rubriques, GET /api/image-galleries/:id
 * Admin   : GET|POST /api/image-galleries/admin/list, POST|PATCH|DELETE /api/image-galleries/admin/:id
 *           POST|DELETE /api/image-galleries/admin/:id/images/:imageId
 */
const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const galleryInclude = {
  language: { select: { nom: true, code: true } },
  images: { orderBy: { ordre: 'asc' } },
};

// ─── Rubriques disponibles ────────────────────────────────────────────────────

// GET /api/image-galleries/rubriques — liste des rubriques existantes (autocomplete)
router.get('/rubriques', async (req, res, next) => {
  try {
    const rows = await prisma.imageGallery.findMany({
      select: { rubrique: true },
      distinct: ['rubrique'],
      where: { rubrique: { not: '' } },
      orderBy: { rubrique: 'asc' },
    });
    res.json(rows.map(r => r.rubrique));
  } catch (err) { next(err); }
});

// ─── Admin : liste paginée ────────────────────────────────────────────────────

// GET /api/image-galleries/admin/list?page=1&limit=12&langue=&rubrique=&status=
router.get('/admin/list', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { page = 1, limit = 12, langue, rubrique, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (langue)   where.languageId = langue;
    if (rubrique) where.rubrique   = { contains: rubrique, mode: 'insensitive' };
    if (status)   where.status     = status;

    const [data, total] = await Promise.all([
      prisma.imageGallery.findMany({
        where, skip, take: parseInt(limit),
        orderBy: [{ ordre: 'asc' }, { createdAt: 'desc' }],
        include: {
          language: { select: { nom: true, code: true } },
          _count: { select: { images: true } },
        },
      }),
      prisma.imageGallery.count({ where }),
    ]);

    res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { next(err); }
});

// ─── Admin : CRUD galerie ─────────────────────────────────────────────────────

// POST /api/image-galleries/admin
router.post('/admin', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { languageId, rubrique, titre, description, coverUrl, ordre, status } = req.body;
    if (!titre?.trim()) return res.status(400).json({ error: 'Le titre est obligatoire' });

    const gallery = await prisma.imageGallery.create({
      data: {
        languageId: languageId || null,
        rubrique: rubrique?.trim() || '',
        titre: titre.trim(),
        description: description?.trim() || null,
        coverUrl: coverUrl?.trim() || null,
        ordre: parseInt(ordre) || 0,
        status: status || 'DRAFT',
      },
      include: galleryInclude,
    });
    res.status(201).json(gallery);
  } catch (err) { next(err); }
});

// PATCH /api/image-galleries/admin/:id
router.patch('/admin/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { languageId, rubrique, titre, description, coverUrl, ordre, status } = req.body;
    const data = {};
    if (languageId  !== undefined) data.languageId  = languageId || null;
    if (rubrique    !== undefined) data.rubrique    = rubrique?.trim() || '';
    if (titre       !== undefined) data.titre       = titre?.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (coverUrl    !== undefined) data.coverUrl    = coverUrl?.trim() || null;
    if (ordre       !== undefined) data.ordre       = parseInt(ordre) || 0;
    if (status      !== undefined) data.status      = status;

    const gallery = await prisma.imageGallery.update({
      where: { id: req.params.id },
      data,
      include: galleryInclude,
    });
    res.json(gallery);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Galerie introuvable' });
    next(err);
  }
});

// DELETE /api/image-galleries/admin/:id
router.delete('/admin/:id', authenticate, requireEditor, async (req, res, next) => {
  try {
    await prisma.imageGallery.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Galerie introuvable' });
    next(err);
  }
});

// ─── Admin : images dans une galerie ─────────────────────────────────────────

// POST /api/image-galleries/admin/:id/images
router.post('/admin/:id/images', authenticate, requireEditor, async (req, res, next) => {
  try {
    const { imageUrl, legende, transcription, traduction, ordre } = req.body;
    if (!imageUrl?.trim()) return res.status(400).json({ error: "L'URL de l'image est obligatoire" });

    const image = await prisma.galleryImage.create({
      data: {
        galleryId: req.params.id,
        imageUrl: imageUrl.trim(),
        legende: legende?.trim() || null,
        transcription: transcription?.trim() || null,
        traduction: traduction?.trim() || null,
        ordre: parseInt(ordre) || 1,
      },
    });
    res.status(201).json(image);
  } catch (err) { next(err); }
});

// DELETE /api/image-galleries/admin/:id/images/:imageId
router.delete('/admin/:id/images/:imageId', authenticate, requireEditor, async (req, res, next) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.imageId } });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Image introuvable' });
    next(err);
  }
});

// ─── Public ───────────────────────────────────────────────────────────────────

// GET /api/image-galleries — liste publique (PUBLISHED uniquement)
router.get('/', async (req, res, next) => {
  try {
    const { langue, rubrique, limit = 20 } = req.query;
    const where = { status: 'PUBLISHED' };
    if (langue)   where.languageId = langue;
    if (rubrique) where.rubrique   = { contains: rubrique, mode: 'insensitive' };

    const galleries = await prisma.imageGallery.findMany({
      where,
      take: parseInt(limit),
      orderBy: [{ ordre: 'asc' }, { createdAt: 'desc' }],
      include: {
        language: { select: { nom: true, code: true } },
        _count: { select: { images: true } },
      },
    });
    res.json({ data: galleries, total: galleries.length });
  } catch (err) { next(err); }
});

// GET /api/image-galleries/:id — détail galerie + images
router.get('/:id', async (req, res, next) => {
  try {
    const gallery = await prisma.imageGallery.findUnique({
      where: { id: req.params.id },
      include: galleryInclude,
    });
    if (!gallery) return res.status(404).json({ error: 'Galerie introuvable' });
    res.json(gallery);
  } catch (err) { next(err); }
});

module.exports = router;
