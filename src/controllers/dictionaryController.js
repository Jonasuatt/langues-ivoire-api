const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDictionary = async (req, res, next) => {
  try {
    const { langue } = req.params;
    const { page = 1, limit = 50, categorie, tab = 'words' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const language = await prisma.language.findFirst({
      where: { OR: [{ id: langue }, { code: langue }], isActive: true },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    if (tab === 'phrases') {
      const where = { languageId: language.id, status: 'PUBLISHED' };
      if (categorie) where.categorie = categorie;

      const [phrases, total] = await Promise.all([
        prisma.usefulPhrase.findMany({ where, skip, take: parseInt(limit), orderBy: { phrase: 'asc' } }),
        prisma.usefulPhrase.count({ where }),
      ]);
      return res.json({ data: phrases, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
    }

    const where = { languageId: language.id, status: 'PUBLISHED' };
    if (categorie) where.categorie = categorie;

    const [entries, total] = await Promise.all([
      prisma.dictionaryEntry.findMany({ where, skip, take: parseInt(limit), orderBy: { mot: 'asc' } }),
      prisma.dictionaryEntry.count({ where }),
    ]);

    res.json({ data: entries, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const searchDictionary = async (req, res, next) => {
  try {
    const { q, langue } = req.query;
    if (!q) return res.status(400).json({ error: 'Paramètre de recherche manquant' });

    const where = {
      status: 'PUBLISHED',
      OR: [
        { mot: { contains: q, mode: 'insensitive' } },
        { traduction: { contains: q, mode: 'insensitive' } },
      ],
    };
    if (langue) {
      const language = await prisma.language.findFirst({ where: { OR: [{ id: langue }, { code: langue }] } });
      if (language) where.languageId = language.id;
    }

    const results = await prisma.dictionaryEntry.findMany({
      where,
      take: 20,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const getDictionaryEntry = async (req, res, next) => {
  try {
    const entry = await prisma.dictionaryEntry.findUnique({
      where: { id: req.params.id },
      include: { language: { select: { nom: true, code: true } } },
    });
    if (!entry) return res.status(404).json({ error: 'Entrée non trouvée' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

const contributeWord = async (req, res, next) => {
  try {
    const { languageId, mot, traduction, transcription, categorie, contexte } = req.body;
    const contribution = await prisma.contribution.create({
      data: {
        userId: req.user.id,
        type: 'WORD',
        languageId,
        contenu: { mot, traduction, transcription, categorie, contexte },
        status: 'PENDING',
      },
    });
    res.status(201).json(contribution);
  } catch (err) {
    next(err);
  }
};

const contributePhrase = async (req, res, next) => {
  try {
    const { languageId, phrase, traduction, transcription, categorie, contexte } = req.body;
    const contribution = await prisma.contribution.create({
      data: {
        userId: req.user.id,
        type: 'PHRASE',
        languageId,
        contenu: { phrase, traduction, transcription, categorie, contexte },
        status: 'PENDING',
      },
    });
    res.status(201).json(contribution);
  } catch (err) {
    next(err);
  }
};

const adminCreateWord = async (req, res, next) => {
  try {
    const { langueCode, mot, traduction, transcription, categorie, exemplePhrase, audioUrl, exempleTraduction, imageUrl } = req.body;
    const language = await prisma.language.findFirst({ where: { code: langueCode } });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });
    const entry = await prisma.dictionaryEntry.create({
      data: { languageId: language.id, langueCode, mot, traduction, transcription, categorie, exemplePhrase, exempleTraduction, audioUrl, imageUrl, status: 'PUBLISHED' },
    });
    res.status(201).json(entry);
  } catch (err) { next(err); }
};

const adminUpdateWord = async (req, res, next) => {
  try {
    const { mot, traduction, transcription, categorie, exemplePhrase, exempleTraduction, audioUrl, imageUrl, status } = req.body;
    const entry = await prisma.dictionaryEntry.update({
      where: { id: req.params.id },
      data: { mot, traduction, transcription, categorie, exemplePhrase, exempleTraduction, audioUrl, imageUrl, status },
    });
    res.json(entry);
  } catch (err) { next(err); }
};

const generateAudio = async (req, res, next) => {
  try {
    const { text, languageCode, speed } = req.body;
    if (!text || !languageCode) return res.status(400).json({ error: 'text et languageCode requis' });

    const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${AI_URL}/tts/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, languageCode, speed: speed || 1.0 }),
    });

    if (!response.ok) throw new Error('Service TTS indisponible');

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'audio/mp3';
    const mimeType = contentType.includes('wav') ? 'audio/wav' : 'audio/mp3';
    const audioUrl = `data:${mimeType};base64,${base64}`;

    // Si un entryId est fourni, mettre à jour l'entrée
    if (req.body.entryId) {
      await prisma.dictionaryEntry.update({
        where: { id: req.body.entryId },
        data: { audioUrl },
      });
    }

    res.json({ audioUrl, size: arrayBuffer.byteLength });
  } catch (err) {
    res.status(503).json({ error: 'Service de synthèse vocale indisponible. Ajoutez une URL audio manuellement.' });
  }
};

const adminDeleteWord = async (req, res, next) => {
  try {
    await prisma.dictionaryEntry.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getDictionary, searchDictionary, getDictionaryEntry, contributeWord, contributePhrase, adminCreateWord, adminUpdateWord, adminDeleteWord, generateAudio };
