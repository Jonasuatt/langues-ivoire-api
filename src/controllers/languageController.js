const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLanguages = async (req, res, next) => {
  try {
    const { mvpOnly, country } = req.query;
    const where = { isActive: true };
    if (mvpOnly === 'true') where.isInMvp = true;
    // Filtre multi-pays (Phase 5) — ex: ?country=CI ou ?country=ML
    if (country) where.countryCode = country.toUpperCase();

    const languages = await prisma.language.findMany({
      where,
      orderBy: { ordreAffichage: 'asc' },
      include: {
        tutors: { select: { nomAvatar: true, imageUrl: true, genre: true } },
        _count: { select: { lessons: true, dictEntries: { where: { status: 'PUBLISHED' } } } },
      },
    });
    res.json(languages);
  } catch (err) {
    next(err);
  }
};

const getLanguage = async (req, res, next) => {
  try {
    const language = await prisma.language.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }], isActive: true },
      include: {
        tutors: true,
        _count: {
          select: {
            lessons: true,
            dictEntries: { where: { status: 'PUBLISHED' } },
            usefulPhrases: { where: { status: 'PUBLISHED' } },
          },
        },
      },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });
    res.json(language);
  } catch (err) {
    next(err);
  }
};

const createLanguage = async (req, res, next) => {
  try {
    const language = await prisma.language.create({ data: req.body });
    res.status(201).json(language);
  } catch (err) {
    next(err);
  }
};

const updateLanguage = async (req, res, next) => {
  try {
    const {
      nom, code, famille, region, locuteurs, imageDrapeau,
      description, ordreAffichage, isActive, isInMvp,
      traditionalAudioUrl, welcomeMessage,
      lat, lng, couleur, emoji,
    } = req.body;

    const data = {};
    if (nom               !== undefined) data.nom               = nom;
    if (code              !== undefined) data.code              = code;
    if (famille           !== undefined) data.famille           = famille;
    if (region            !== undefined) data.region            = region;
    if (locuteurs         !== undefined) data.locuteurs         = locuteurs;
    if (imageDrapeau      !== undefined) data.imageDrapeau      = imageDrapeau;
    if (description       !== undefined) data.description       = description;
    if (ordreAffichage    !== undefined) data.ordreAffichage    = ordreAffichage;
    if (isActive          !== undefined) data.isActive          = isActive;
    if (isInMvp           !== undefined) data.isInMvp           = isInMvp;
    if (traditionalAudioUrl !== undefined) data.traditionalAudioUrl = traditionalAudioUrl || null;
    if (welcomeMessage    !== undefined) data.welcomeMessage    = welcomeMessage || null;
    if (lat               !== undefined) data.lat               = lat !== null ? parseFloat(lat) : null;
    if (lng               !== undefined) data.lng               = lng !== null ? parseFloat(lng) : null;
    if (couleur           !== undefined) data.couleur           = couleur || null;
    if (emoji             !== undefined) data.emoji             = emoji || null;

    const language = await prisma.language.update({
      where: { id: req.params.id },
      data,
    });
    res.json(language);
  } catch (err) {
    next(err);
  }
};

const getAllLanguagesAdmin = async (req, res, next) => {
  try {
    const languages = await prisma.language.findMany({
      orderBy: [
        { isActive: 'desc' },
        { ordreAffichage: 'asc' },
        { nom: 'asc' },
      ],
      include: {
        tutors: { select: { nomAvatar: true, imageUrl: true, genre: true } },
        _count: { select: { lessons: true, dictEntries: { where: { status: 'PUBLISHED' } } } },
      },
    });
    res.json(languages);
  } catch (err) {
    next(err);
  }
};

const activateLanguage = async (req, res, next) => {
  try {
    const language = await prisma.language.update({
      where: { id: req.params.id },
      data: { isActive: true },
    });
    res.json(language);
  } catch (err) {
    next(err);
  }
};

// ─── Initialisation depuis une langue source (MVP) ───────────────────────────
// Copie la structure française (traductions, audio FR, catégories, situations)
// depuis la langue source vers la langue cible, laissant les champs locaux vides.
// Active également la langue cible en fin de transaction.
const initFromLanguage = async (req, res, next) => {
  try {
    const { id: targetId, sourceId } = req.params;

    // Vérification des deux langues
    const [target, source] = await Promise.all([
      prisma.language.findUnique({ where: { id: targetId } }),
      prisma.language.findUnique({ where: { id: sourceId } }),
    ]);
    if (!target) return res.status(404).json({ error: 'Langue cible non trouvée' });
    if (!source) return res.status(404).json({ error: 'Langue source non trouvée' });

    // Sécurité : ne pas écraser si la cible a déjà du contenu
    const existingCount = await prisma.dictionaryEntry.count({ where: { languageId: targetId } });
    if (existingCount > 0) {
      return res.status(400).json({
        error: `La langue "${target.nom}" contient déjà ${existingCount} entrées. Initialisation annulée pour éviter les doublons.`,
      });
    }

    // Récupération du contenu source publié
    const [dictEntries, usefulPhrases, premierSecours] = await Promise.all([
      prisma.dictionaryEntry.findMany({
        where: { languageId: sourceId, status: 'PUBLISHED' },
        select: {
          traduction: true, categorie: true, imageUrl: true,
          exempleTraduction: true,
        },
      }),
      prisma.usefulPhrase.findMany({
        where: { languageId: sourceId, status: 'PUBLISHED' },
        select: {
          traduction: true, audioUrlFr: true, audioUrlFrF: true,
          categorie: true, contexte: true,
        },
      }),
      prisma.premierSecoursPhrase.findMany({
        where: { languageId: sourceId, isActive: true },
        select: {
          situation: true, traduction: true, audioUrlFr: true,
          audioUrlFrF: true, imageUrl: true, priorite: true,
        },
      }),
    ]);

    // Transaction : création des squelettes + activation de la langue
    const [dictResult, phraseResult, sosResult, langue] = await prisma.$transaction([
      // Entrées dictionnaire — traduction FR copiée, mot local vide
      prisma.dictionaryEntry.createMany({
        data: dictEntries.map(e => ({
          languageId:       targetId,
          mot:              '',          // à compléter par l'équipe audio / éditeur
          traduction:       e.traduction,
          categorie:        e.categorie  || null,
          imageUrl:         e.imageUrl   || null,
          exempleTraduction:e.exempleTraduction || null,
          status:           'DRAFT',
        })),
        skipDuplicates: true,
      }),

      // Phrases utiles — traduction FR + audio FR copiés, phrase locale vide
      prisma.usefulPhrase.createMany({
        data: usefulPhrases.map(p => ({
          languageId:  targetId,
          phrase:      '',              // à compléter par l'équipe audio / éditeur
          traduction:  p.traduction,
          audioUrlFr:  p.audioUrlFr  || null,
          audioUrlFrF: p.audioUrlFrF || null,
          categorie:   p.categorie   || null,
          contexte:    p.contexte    || null,
          status:      'DRAFT',
        })),
        skipDuplicates: true,
      }),

      // Premiers secours — même structure, audio FR identique, consigne locale vide
      prisma.premierSecoursPhrase.createMany({
        data: premierSecours.map(p => ({
          languageId:  targetId,
          situation:   p.situation,
          consigne:    '',              // à compléter par l'équipe audio / éditeur
          traduction:  p.traduction  || null,
          audioUrlFr:  p.audioUrlFr  || null,
          audioUrlFrF: p.audioUrlFrF || null,
          imageUrl:    p.imageUrl    || null,
          priorite:    p.priorite    ?? 0,
          isActive:    false,
        })),
        skipDuplicates: true,
      }),

      // Activation de la langue cible
      prisma.language.update({
        where: { id: targetId },
        data:  { isActive: true },
      }),
    ]);

    res.json({
      message: `"${target.nom}" initialisée et activée depuis "${source.nom}"`,
      langue,
      stats: {
        dictEntries:    dictResult.count,
        usefulPhrases:  phraseResult.count,
        premierSecours: sosResult.count,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLanguages, getLanguage, createLanguage, updateLanguage,
  getAllLanguagesAdmin, activateLanguage, initFromLanguage,
};
