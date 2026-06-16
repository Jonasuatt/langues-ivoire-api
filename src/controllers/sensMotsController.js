const prisma = require('../lib/prisma');

// GET /api/sens-mots
const getAllSensMots = async (req, res, next) => {
  try {
    const { languageId, status, page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (languageId) where.languageId = languageId;
    if (status)     where.status     = status;
    if (search) {
      where.OR = [
        { motSource:        { contains: search, mode: 'insensitive' } },
        { sensHistoriqueFr: { contains: search, mode: 'insensitive' } },
        { sensVeritable:    { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.sensMot.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [{ createdAt: 'desc' }],
        include: { language: { select: { nom: true, code: true } } },
      }),
      prisma.sensMot.count({ where }),
    ]);

    res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/sens-mots/:id
const getSensMot = async (req, res, next) => {
  try {
    const item = await prisma.sensMot.findUnique({
      where: { id: req.params.id },
      include: { language: { select: { nom: true, code: true } } },
    });
    if (!item) return res.status(404).json({ error: 'Fiche introuvable' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/sens-mots
const createSensMot = async (req, res, next) => {
  try {
    const {
      languageId, motSource, transcription, audioUrl,
      sensHistoriqueFr, sensVeritable, contexteErreur, source, status,
    } = req.body;

    if (!motSource?.trim())        return res.status(400).json({ error: 'Le mot source est obligatoire' });
    if (!sensHistoriqueFr?.trim()) return res.status(400).json({ error: 'Le sens historique FR est obligatoire' });
    if (!sensVeritable?.trim())    return res.status(400).json({ error: 'Le sens véritable est obligatoire' });

    const item = await prisma.sensMot.create({
      data: {
        languageId:       languageId       || null,
        motSource:        motSource.trim(),
        transcription:    transcription    || null,
        audioUrl:         audioUrl         || null,
        sensHistoriqueFr: sensHistoriqueFr.trim(),
        sensVeritable:    sensVeritable.trim(),
        contexteErreur:   contexteErreur   || null,
        source:           source           || null,
        status:           status           || 'DRAFT',
      },
      include: { language: { select: { nom: true, code: true } } },
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/sens-mots/:id
const updateSensMot = async (req, res, next) => {
  try {
    const {
      languageId, motSource, transcription, audioUrl,
      sensHistoriqueFr, sensVeritable, contexteErreur, source, status, isActive,
    } = req.body;

    const data = {};
    if (languageId       !== undefined) data.languageId       = languageId || null;
    if (motSource        !== undefined) data.motSource        = motSource?.trim();
    if (transcription    !== undefined) data.transcription    = transcription || null;
    if (audioUrl         !== undefined) data.audioUrl         = audioUrl || null;
    if (sensHistoriqueFr !== undefined) data.sensHistoriqueFr = sensHistoriqueFr?.trim();
    if (sensVeritable    !== undefined) data.sensVeritable    = sensVeritable?.trim();
    if (contexteErreur   !== undefined) data.contexteErreur   = contexteErreur || null;
    if (source           !== undefined) data.source           = source || null;
    if (status           !== undefined) data.status           = status;
    if (isActive         !== undefined) data.isActive         = isActive;

    const item = await prisma.sensMot.update({
      where: { id: req.params.id },
      data,
      include: { language: { select: { nom: true, code: true } } },
    });

    res.json(item);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Fiche introuvable' });
    next(err);
  }
};

// DELETE /api/sens-mots/:id (soft delete)
const deleteSensMot = async (req, res, next) => {
  try {
    await prisma.sensMot.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Fiche introuvable' });
    next(err);
  }
};

module.exports = {
  getAllSensMots,
  getSensMot,
  createSensMot,
  updateSensMot,
  deleteSensMot,
};
