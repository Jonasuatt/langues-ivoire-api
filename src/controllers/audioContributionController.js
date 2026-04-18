const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Multer en mémoire
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav', 'audio/webm', 'audio/m4a', 'audio/mp4', 'audio/aac'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Type audio non supporté: ${file.mimetype}`), false);
  },
});

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    Readable.from(buffer).pipe(stream);
  });
}

// ============ CONTRIBUTIONS AUDIO ============

// POST /api/audio-contributions — Enregistrer une contribution audio (utilisateur)
const createAudioContribution = async (req, res, next) => {
  try {
    const { languageId, mot, traduction, transcription, categorie } = req.body;
    if (!mot || !languageId) {
      return res.status(400).json({ error: 'Mot et langue requis' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier audio requis' });
    }

    // Upload audio vers Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      `langues-ivoire/audio-contributions/${languageId}`
    );

    const contribution = await prisma.audioContribution.create({
      data: {
        userId: req.user.id,
        languageId,
        mot,
        traduction: traduction || null,
        transcription: transcription || null,
        categorie: categorie || null,
        audioUrl: result.secure_url,
        duree: result.duration ? Math.round(result.duration * 1000) : null,
      },
      include: {
        language: { select: { nom: true, code: true } },
        user: { select: { prenom: true, nom: true } },
      },
    });

    // Incrémenter les points de contribution de l'utilisateur
    await prisma.user.update({
      where: { id: req.user.id },
      data: { pointsContribution: { increment: 5 } },
    });

    res.status(201).json(contribution);
  } catch (err) {
    next(err);
  }
};

// GET /api/audio-contributions — Liste des contributions audio
const getAudioContributions = async (req, res, next) => {
  try {
    const { langue, categorie, validated, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (validated === 'true') where.isValidated = true;
    if (validated === 'false') where.isValidated = false;
    if (categorie) where.categorie = categorie;
    if (langue) {
      const language = await prisma.language.findFirst({
        where: { OR: [{ id: langue }, { code: langue }] },
      });
      if (language) where.languageId = language.id;
    }

    const [items, total] = await Promise.all([
      prisma.audioContribution.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          language: { select: { nom: true, code: true } },
          user: { select: { prenom: true, nom: true } },
        },
      }),
      prisma.audioContribution.count({ where }),
    ]);

    res.json({ data: items, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/audio-contributions/stats — Statistiques pour le CMS
const getAudioStats = async (req, res, next) => {
  try {
    const [total, validated, byLanguage] = await Promise.all([
      prisma.audioContribution.count({ where: { isActive: true } }),
      prisma.audioContribution.count({ where: { isActive: true, isValidated: true } }),
      prisma.audioContribution.groupBy({
        by: ['languageId'],
        _count: { id: true },
        where: { isActive: true },
      }),
    ]);

    // Enrichir avec les noms de langue
    const languages = await prisma.language.findMany();
    const langMap = {};
    languages.forEach(l => { langMap[l.id] = l.nom; });

    res.json({
      total,
      validated,
      pending: total - validated,
      byLanguage: byLanguage.map(b => ({
        language: langMap[b.languageId] || 'Inconnue',
        count: b._count.id,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/audio-contributions/:id/validate — Valider une contribution (éditeur)
const validateAudioContribution = async (req, res, next) => {
  try {
    const { qualityScore, isValidated } = req.body;
    const contribution = await prisma.audioContribution.update({
      where: { id: req.params.id },
      data: {
        isValidated: isValidated !== undefined ? isValidated : true,
        validatedBy: req.user.id,
        validatedAt: new Date(),
        qualityScore: qualityScore ? parseFloat(qualityScore) : null,
      },
      include: {
        language: { select: { nom: true, code: true } },
        user: { select: { prenom: true, nom: true } },
      },
    });
    res.json(contribution);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/audio-contributions/:id
const deleteAudioContribution = async (req, res, next) => {
  try {
    await prisma.audioContribution.delete({ where: { id: req.params.id } });
    res.json({ message: 'Contribution audio supprimée' });
  } catch (err) {
    next(err);
  }
};

// ============ PRATIQUE IA ============

// GET /api/audio-contributions/practice/:langCode — Mots à pratiquer pour une langue
// Renvoie des mots validés avec audio pour l'entraînement
const getPracticeWords = async (req, res, next) => {
  try {
    const { langCode } = req.params;
    const { categorie, limit = 10 } = req.query;

    const language = await prisma.language.findFirst({
      where: { OR: [{ id: langCode }, { code: langCode }] },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    const where = { languageId: language.id, isActive: true };

    // Priorité aux contributions validées, sinon mots du dictionnaire avec audio
    const audioContribs = await prisma.audioContribution.findMany({
      where: { ...where, isValidated: true, ...(categorie ? { categorie } : {}) },
      select: { id: true, mot: true, traduction: true, audioUrl: true, categorie: true, transcription: true },
      take: parseInt(limit),
      orderBy: { timesPlayed: 'asc' }, // mots les moins pratiqués en premier
    });

    // Compléter avec des mots du dictionnaire
    const dictWords = await prisma.dictionaryEntry.findMany({
      where: {
        languageId: language.id,
        status: 'PUBLISHED',
        audioUrl: { not: null },
        ...(categorie ? { categorie } : {}),
      },
      select: { id: true, mot: true, traduction: true, audioUrl: true, categorie: true, transcription: true },
      take: Math.max(0, parseInt(limit) - audioContribs.length),
      orderBy: { createdAt: 'desc' },
    });

    const words = [
      ...audioContribs.map(w => ({ ...w, source: 'contribution' })),
      ...dictWords.map(w => ({ ...w, source: 'dictionary' })),
    ];

    // Incrémenter le compteur timesPlayed pour les contributions servies
    if (audioContribs.length > 0) {
      await prisma.audioContribution.updateMany({
        where: { id: { in: audioContribs.map(c => c.id) } },
        data: { timesPlayed: { increment: 1 } },
      });
    }

    res.json({
      language: { id: language.id, nom: language.nom, code: language.code },
      words,
      totalAvailable: audioContribs.length + dictWords.length,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/audio-contributions/practice/session — Sauvegarder une session de pratique
const savePracticeSession = async (req, res, next) => {
  try {
    const { languageId, tutorId, mode, wordsCount, correctCount, duration } = req.body;
    const session = await prisma.practiceSession.create({
      data: {
        userId: req.user.id,
        languageId,
        tutorId: tutorId || null,
        mode: mode || 'listen_repeat',
        wordsCount: wordsCount || 0,
        correctCount: correctCount || 0,
        duration: duration || null,
      },
    });

    // +2 XP par mot pratiqué
    if (wordsCount > 0) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { pointsContribution: { increment: wordsCount * 2 } },
      });
    }

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  createAudioContribution,
  getAudioContributions,
  getAudioStats,
  validateAudioContribution,
  deleteAudioContribution,
  getPracticeWords,
  savePracticeSession,
};
