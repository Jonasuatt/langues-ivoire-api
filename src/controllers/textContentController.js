const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/text-contents/admin/list
const listTextContents = async (req, res, next) => {
  try {
    const { langue, type, status, page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (langue)  where.languageId = langue;
    if (type)    where.type       = type;
    if (status)  where.status     = status;

    const [data, total] = await Promise.all([
      prisma.textContent.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [{ createdAt: 'desc' }],
        include: { language: { select: { nom: true, code: true } } },
      }),
      prisma.textContent.count({ where }),
    ]);

    res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/text-contents — liste publique (PUBLISHED uniquement)
const getPublicTextContents = async (req, res, next) => {
  try {
    const { langue, type, niveau, page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { status: 'PUBLISHED' };
    if (langue) where.languageId = langue;
    if (type)   where.type       = type;
    if (niveau) where.niveau     = niveau;

    const [data, total] = await Promise.all([
      prisma.textContent.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [{ createdAt: 'desc' }],
        include: { language: { select: { nom: true, code: true } } },
      }),
      prisma.textContent.count({ where }),
    ]);

    res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/text-contents/:id — détail public
const getTextContent = async (req, res, next) => {
  try {
    const item = await prisma.textContent.findUnique({
      where: { id: req.params.id },
      include: { language: { select: { nom: true, code: true } } },
    });
    if (!item) return res.status(404).json({ error: 'Texte introuvable' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/text-contents/admin — création (admin)
const createTextContent = async (req, res, next) => {
  try {
    const {
      languageId, type, titre, contenu, traduction, transcription,
      resume, audioUrl, imageUrl, niveau, auteur, sourceEthnique,
      tags, dureeMin, status,
    } = req.body;

    if (!titre?.trim()) return res.status(400).json({ error: 'Le titre est obligatoire' });
    if (!contenu?.trim()) return res.status(400).json({ error: 'Le contenu est obligatoire' });

    const item = await prisma.textContent.create({
      data: {
        languageId: languageId || null,
        type: type || 'CONTE',
        titre: titre.trim(),
        contenu: contenu.trim(),
        traduction: traduction || null,
        transcription: transcription || null,
        resume: resume || null,
        audioUrl: audioUrl || null,
        imageUrl: imageUrl || null,
        niveau: niveau || 'A1',
        auteur: auteur || null,
        sourceEthnique: sourceEthnique || null,
        tags: Array.isArray(tags) ? tags : [],
        dureeMin: dureeMin ? parseInt(dureeMin) : null,
        status: status || 'DRAFT',
      },
      include: { language: { select: { nom: true, code: true } } },
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/text-contents/admin/:id — mise à jour (admin)
const updateTextContent = async (req, res, next) => {
  try {
    const {
      languageId, type, titre, contenu, traduction, transcription,
      resume, audioUrl, imageUrl, niveau, auteur, sourceEthnique,
      tags, dureeMin, status,
    } = req.body;

    const data = {};
    if (languageId    !== undefined) data.languageId    = languageId || null;
    if (type          !== undefined) data.type          = type;
    if (titre         !== undefined) data.titre         = titre?.trim();
    if (contenu       !== undefined) data.contenu       = contenu?.trim();
    if (traduction    !== undefined) data.traduction    = traduction || null;
    if (transcription !== undefined) data.transcription = transcription || null;
    if (resume        !== undefined) data.resume        = resume || null;
    if (audioUrl      !== undefined) data.audioUrl      = audioUrl || null;
    if (imageUrl      !== undefined) data.imageUrl      = imageUrl || null;
    if (niveau        !== undefined) data.niveau        = niveau;
    if (auteur        !== undefined) data.auteur        = auteur || null;
    if (sourceEthnique !== undefined) data.sourceEthnique = sourceEthnique || null;
    if (tags          !== undefined) data.tags          = Array.isArray(tags) ? tags : [];
    if (dureeMin      !== undefined) data.dureeMin      = dureeMin ? parseInt(dureeMin) : null;
    if (status        !== undefined) data.status        = status;

    const item = await prisma.textContent.update({
      where: { id: req.params.id },
      data,
      include: { language: { select: { nom: true, code: true } } },
    });

    res.json(item);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Texte introuvable' });
    next(err);
  }
};

// DELETE /api/text-contents/admin/:id — suppression (admin)
const deleteTextContent = async (req, res, next) => {
  try {
    await prisma.textContent.delete({ where: { id: req.params.id } });
    res.json({ message: 'Texte supprimé' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Texte introuvable' });
    next(err);
  }
};

module.exports = {
  listTextContents,
  getPublicTextContents,
  getTextContent,
  createTextContent,
  updateTextContent,
  deleteTextContent,
};
