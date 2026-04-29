const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPhrases = async (req, res, next) => {
  try {
    const { languageId, categorie, status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (languageId) where.languageId = languageId;
    if (categorie)  where.categorie  = categorie;
    if (status)     where.status     = status;

    const [phrases, total] = await Promise.all([
      prisma.usefulPhrase.findMany({
        where, skip, take: parseInt(limit),
        orderBy: [{ languageId: 'asc' }, { categorie: 'asc' }, { phrase: 'asc' }],
        include: { language: { select: { nom: true, code: true } } },
      }),
      prisma.usefulPhrase.count({ where }),
    ]);

    res.json({ data: phrases, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const createPhrase = async (req, res, next) => {
  try {
    const { languageId, phrase, transcription, traduction, audioUrl, categorie, contexte, status } = req.body;
    if (!languageId || !phrase || !traduction) {
      return res.status(400).json({ error: 'Champs obligatoires : languageId, phrase, traduction' });
    }
    const p = await prisma.usefulPhrase.create({
      data: {
        languageId, phrase, transcription, traduction, audioUrl,
        categorie: categorie || 'urgence',
        contexte,
        status: status || 'PUBLISHED',
        contributorId: req.user.id,
      },
      include: { language: { select: { nom: true, code: true } } },
    });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

const updatePhrase = async (req, res, next) => {
  try {
    const { phrase, transcription, traduction, audioUrl, categorie, contexte, status } = req.body;
    const data = {};
    if (phrase        !== undefined) data.phrase        = phrase;
    if (transcription !== undefined) data.transcription = transcription;
    if (traduction    !== undefined) data.traduction    = traduction;
    if (audioUrl      !== undefined) data.audioUrl      = audioUrl;
    if (categorie     !== undefined) data.categorie     = categorie;
    if (contexte      !== undefined) data.contexte      = contexte;
    if (status        !== undefined) data.status        = status;

    const p = await prisma.usefulPhrase.update({
      where: { id: req.params.id },
      data,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(p);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Phrase introuvable' });
    next(err);
  }
};

const deletePhrase = async (req, res, next) => {
  try {
    await prisma.usefulPhrase.delete({ where: { id: req.params.id } });
    res.json({ message: 'Phrase supprimée' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Phrase introuvable' });
    next(err);
  }
};

module.exports = { getPhrases, createPhrase, updatePhrase, deletePhrase };
