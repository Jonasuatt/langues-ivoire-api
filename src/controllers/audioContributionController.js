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

// Rôles de confiance — leurs contributions sont auto-validées
const TRUSTED_ROLES = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'];

// POST /api/audio-contributions — Enregistrer une contribution audio (utilisateur ou admin CMS)
const createAudioContribution = async (req, res, next) => {
  try {
    const { languageId, mot, traduction, transcription, categorie } = req.body;
    if (!mot || !languageId) {
      return res.status(400).json({ error: 'Mot et langue requis' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier audio requis' });
    }

    const isTrusted = TRUSTED_ROLES.includes(req.user.role);

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
        // Auto-validation pour les admins/éditeurs — qualité garantie
        isValidated: isTrusted,
        validatedBy: isTrusted ? req.user.id : null,
        validatedAt: isTrusted ? new Date() : null,
        qualityScore: isTrusted ? 5 : null,
      },
      include: {
        language: { select: { nom: true, code: true } },
        user: { select: { prenom: true, nom: true } },
      },
    });

    if (!isTrusted) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { pointsContribution: { increment: 5 } },
      });
    }

    res.status(201).json(contribution);
  } catch (err) {
    next(err);
  }
};

// POST /api/audio-contributions/bulk-import — Import massif depuis le CMS (admin)
const bulkImportAudio = async (req, res, next) => {
  try {
    const { languageId, categorie, texts } = req.body;
    const files = req.files;

    if (!languageId) return res.status(400).json({ error: 'Langue requise' });
    if (!files || files.length === 0) return res.status(400).json({ error: 'Aucun fichier audio fourni' });

    // Textes personnalisés envoyés par le frontend (mots ou phrases)
    let customTexts = [];
    try { customTexts = texts ? JSON.parse(texts) : []; } catch (_) { customTexts = []; }

    const results = { success: [], errors: [] };

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      try {
        // Priorité : texte fourni par le frontend (mot ou phrase saisie manuellement)
        // Fallback : extraire depuis le nom de fichier
        const mot = (customTexts[idx] && customTexts[idx].trim())
          ? customTexts[idx].trim()
          : file.originalname
              .replace(/\.[^.]+$/, '')   // enlever extension
              .replace(/[-_]/g, ' ')     // tirets/underscores → espaces
              .trim();

        const cloudResult = await uploadToCloudinary(
          file.buffer,
          `langues-ivoire/audio-contributions/${languageId}`
        );

        await prisma.audioContribution.create({
          data: {
            userId: req.user.id,
            languageId,
            mot,
            categorie: categorie || null,
            audioUrl: cloudResult.secure_url,
            duree: cloudResult.duration ? Math.round(cloudResult.duration * 1000) : null,
            // Auto-validé car import admin
            isValidated: true,
            validatedBy: req.user.id,
            validatedAt: new Date(),
            qualityScore: 5,
          },
        });

        results.success.push(mot);
      } catch (err) {
        results.errors.push({ file: file.originalname, error: err.message });
      }
    }

    res.json({
      message: `${results.success.length} audio(s) importé(s) avec succès`,
      success: results.success,
      errors: results.errors,
    });
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

// PATCH /api/audio-contributions/:id — Modifier les métadonnées (éditeur)
const updateAudioContribution = async (req, res, next) => {
  try {
    const { mot, traduction, transcription, categorie, estVoixOfficielle, genreVoix } = req.body;
    const data = {};
    if (mot !== undefined) data.mot = mot;
    if (traduction !== undefined) data.traduction = traduction;
    if (transcription !== undefined) data.transcription = transcription;
    if (categorie !== undefined) data.categorie = categorie || null;
    if (estVoixOfficielle !== undefined) data.estVoixOfficielle = Boolean(estVoixOfficielle);
    if (genreVoix !== undefined) data.genreVoix = genreVoix || null;

    const contribution = await prisma.audioContribution.update({
      where: { id: req.params.id },
      data,
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
// Ordre de priorité :
//   1. Voix officielle du genre de l'agent (estVoixOfficielle=true, genreVoix=F|M)
//   2. Voix officielle de l'autre genre (complément si manque)
//   3. Autres contributions validées
//   4. Mots du dictionnaire avec audio
const getPracticeWords = async (req, res, next) => {
  try {
    const { langCode } = req.params;
    const { categorie, limit = 10, genreVoix } = req.query;
    const n = parseInt(limit);

    const language = await prisma.language.findFirst({
      where: { OR: [{ id: langCode }, { code: langCode }] },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    const baseWhere = {
      languageId: language.id,
      isActive: true,
      isValidated: true,
      ...(categorie ? { categorie } : {}),
    };

    const selectFields = {
      id: true, mot: true, traduction: true, audioUrl: true,
      categorie: true, transcription: true,
      estVoixOfficielle: true, genreVoix: true,
    };

    const collected = [];
    const seenIds = new Set();

    const addWords = (rows, source) => {
      for (const w of rows) {
        if (!seenIds.has(w.id)) {
          seenIds.add(w.id);
          collected.push({ ...w, source });
        }
      }
    };

    // ── Étape 1 : voix officielle du genre demandé (tuteur choisi) ──
    if (genreVoix) {
      const official = await prisma.audioContribution.findMany({
        where: { ...baseWhere, estVoixOfficielle: true, genreVoix },
        select: selectFields,
        take: n,
        orderBy: { timesPlayed: 'asc' },
      });
      addWords(official, 'voix_officielle');
    }

    // ── Étape 2 : voix officielle de l'autre genre si manque ──
    if (collected.length < n) {
      const autreGenre = genreVoix ? (genreVoix === 'F' ? 'M' : 'F') : null;
      const whereAutre = autreGenre
        ? { ...baseWhere, estVoixOfficielle: true, genreVoix: autreGenre }
        : { ...baseWhere, estVoixOfficielle: true };
      const officialOther = await prisma.audioContribution.findMany({
        where: whereAutre,
        select: selectFields,
        take: n - collected.length,
        orderBy: { timesPlayed: 'asc' },
      });
      addWords(officialOther, 'voix_officielle');
    }

    // ── Étape 3 : autres contributions validées ──
    if (collected.length < n) {
      const others = await prisma.audioContribution.findMany({
        where: { ...baseWhere, estVoixOfficielle: false },
        select: selectFields,
        take: n - collected.length,
        orderBy: { timesPlayed: 'asc' },
      });
      addWords(others, 'contribution');
    }

    // ── Étape 4 : mots du dictionnaire avec audio ──
    if (collected.length < n) {
      const dictWords = await prisma.dictionaryEntry.findMany({
        where: {
          languageId: language.id,
          status: 'PUBLISHED',
          audioUrl: { not: null },
          ...(categorie ? { categorie } : {}),
        },
        select: { id: true, mot: true, traduction: true, audioUrl: true, categorie: true, transcription: true },
        take: n - collected.length,
        orderBy: { createdAt: 'desc' },
      });
      addWords(dictWords.map(w => ({ ...w, estVoixOfficielle: false, genreVoix: null })), 'dictionary');
    }

    // Incrémenter timesPlayed uniquement pour les contributions servies
    const contribIds = collected
      .filter(w => w.source !== 'dictionary')
      .map(w => w.id);
    if (contribIds.length > 0) {
      await prisma.audioContribution.updateMany({
        where: { id: { in: contribIds } },
        data: { timesPlayed: { increment: 1 } },
      });
    }

    res.json({
      language: { id: language.id, nom: language.nom, code: language.code },
      words: collected,
      totalAvailable: collected.length,
      genreVoixDemande: genreVoix || null,
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
  bulkImportAudio,
  getAudioContributions,
  getAudioStats,
  updateAudioContribution,
  validateAudioContribution,
  deleteAudioContribution,
  getPracticeWords,
  savePracticeSession,
};
