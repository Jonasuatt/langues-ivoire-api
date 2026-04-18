const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/videos — Liste publique (mobile)
const getVideos = async (req, res, next) => {
  try {
    const { langue, categorie, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (categorie) where.categorie = categorie;
    if (langue) {
      const language = await prisma.language.findFirst({
        where: { OR: [{ id: langue }, { code: langue }] },
      });
      if (language) where.languageId = language.id;
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [{ ordre: 'asc' }, { createdAt: 'desc' }],
        include: { language: { select: { nom: true, code: true } } },
      }),
      prisma.video.count({ where }),
    ]);

    res.json({ data: videos, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/videos/:id
const getVideo = async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: { language: { select: { nom: true, code: true } } },
    });
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.json(video);
  } catch (err) {
    next(err);
  }
};

// GET /api/videos/categories — Liste des catégories disponibles
const getCategories = async (req, res, next) => {
  try {
    const cats = await prisma.video.groupBy({
      by: ['categorie'],
      _count: { id: true },
      where: { isActive: true },
      orderBy: { _count: { id: 'desc' } },
    });
    res.json(cats.map(c => ({ categorie: c.categorie, count: c._count.id })));
  } catch (err) {
    next(err);
  }
};

// POST /api/videos — Créer (admin)
const createVideo = async (req, res, next) => {
  try {
    const { languageId, titre, description, url, thumbnailUrl, duree, categorie, source, ordre } = req.body;
    if (!titre || !url) return res.status(400).json({ error: 'Titre et URL requis' });

    // Auto-extraire le thumbnail YouTube si non fourni
    let thumb = thumbnailUrl;
    if (!thumb && url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYoutubeId(url);
      if (videoId) thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    const video = await prisma.video.create({
      data: {
        languageId: languageId || null,
        titre,
        description: description || null,
        url,
        thumbnailUrl: thumb || null,
        duree: duree ? parseInt(duree) : null,
        categorie: categorie || 'culturel',
        source: source || detectSource(url),
        ordre: ordre ? parseInt(ordre) : 0,
      },
      include: { language: { select: { nom: true, code: true } } },
    });
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/videos/:id — Modifier (admin)
const updateVideo = async (req, res, next) => {
  try {
    const { languageId, titre, description, url, thumbnailUrl, duree, categorie, source, ordre, isActive } = req.body;
    const data = {};
    if (titre !== undefined) data.titre = titre;
    if (description !== undefined) data.description = description;
    if (url !== undefined) data.url = url;
    if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;
    if (duree !== undefined) data.duree = duree ? parseInt(duree) : null;
    if (categorie !== undefined) data.categorie = categorie;
    if (source !== undefined) data.source = source;
    if (ordre !== undefined) data.ordre = parseInt(ordre);
    if (isActive !== undefined) data.isActive = isActive;
    if (languageId !== undefined) data.languageId = languageId || null;

    const video = await prisma.video.update({
      where: { id: req.params.id },
      data,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(video);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/videos/:id
const deleteVideo = async (req, res, next) => {
  try {
    await prisma.video.delete({ where: { id: req.params.id } });
    res.json({ message: 'Vidéo supprimée' });
  } catch (err) {
    next(err);
  }
};

// Helpers
function extractYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function detectSource(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('cloudinary.com')) return 'cloudinary';
  return 'externe';
}

module.exports = { getVideos, getVideo, getCategories, createVideo, updateVideo, deleteVideo };
