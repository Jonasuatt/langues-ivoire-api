const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const { notifyUser } = require('../utils/notify');

const prisma = new PrismaClient();

// --- Helpers ---

function getMention(moyenne) {
  if (moyenne >= 16) return 'EXCELLENT';
  if (moyenne >= 14) return 'TRES_BIEN';
  if (moyenne >= 12) return 'BIEN';
  if (moyenne >= 10) return 'ASSEZ_BIEN';
  if (moyenne >= 8)  return 'PASSABLE';
  return 'INSUFFISANT';
}

function genCode(annee, trimestre) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `BUL-${annee}-${trimestre}-${code}`;
}

// Détermine le trimestre courant ivoirien
function trimestreCourant() {
  const m = new Date().getMonth() + 1; // 1-12
  if (m >= 9 || m <= 12) return { trimestre: 'T1', annee: m >= 9 ? new Date().getFullYear() : new Date().getFullYear() - 1 };
  if (m <= 3)  return { trimestre: 'T2', annee: new Date().getFullYear() };
  return { trimestre: 'T3', annee: new Date().getFullYear() };
}

// --------------------------------------------------------------------------
// POST /api/notes/record  (auth)
// Enregistre la note d'une leçon dans le cahier de notes du cursus.
// Body: { lessonId, languageId, score, trimestre?, annee? }
// --------------------------------------------------------------------------
async function recordNote(req, res) {
  try {
    const userId = req.user.id;
    const { lessonId, languageId, score } = req.body;
    if (!lessonId || !languageId || score === undefined) {
      return res.status(400).json({ error: 'lessonId, languageId et score requis.' });
    }

    const tc = trimestreCourant();
    const trimestre = req.body.trimestre || tc.trimestre;
    const annee    = req.body.annee    || tc.annee;
    const note     = Math.round((score / 5) * 10) / 10; // /20, 1 décimale

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId, languageId } },
    });
    if (!enrollment) return res.status(404).json({ error: 'Inscription non trouvée.' });

    const existing = await prisma.noteLecon.findUnique({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    });

    let saved;
    if (existing) {
      // Conserver uniquement la meilleure note
      if (note > existing.note) {
        saved = await prisma.noteLecon.update({
          where: { id: existing.id },
          data: { score, note, tentative: existing.tentative + 1, completedAt: new Date() },
        });
      } else {
        saved = existing;
      }
    } else {
      saved = await prisma.noteLecon.create({
        data: { enrollmentId: enrollment.id, lessonId, score, note, trimestre, annee },
      });
    }

    res.json({ note: saved });
  } catch (err) {
    console.error('recordNote:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/notes/:languageId/cahier  (auth)
// Cahier de notes complet pour une langue, groupé par trimestre.
// --------------------------------------------------------------------------
async function getCahierNotes(req, res) {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId, languageId } },
      include: { gradeLevel: true },
    });
    if (!enrollment) return res.status(404).json({ error: 'Inscription non trouvée.' });

    const notes = await prisma.noteLecon.findMany({
      where: { enrollmentId: enrollment.id },
      include: {
        lesson: {
          select: { id: true, titre: true, pilier: true, ordre: true },
        },
      },
      orderBy: [{ annee: 'asc' }, { trimestre: 'asc' }, { completedAt: 'asc' }],
    });

    // Grouper par trimestre
    const grouped = {};
    for (const n of notes) {
      const key = `${n.annee}-${n.trimestre}`;
      if (!grouped[key]) grouped[key] = { annee: n.annee, trimestre: n.trimestre, notes: [] };
      grouped[key].notes.push(n);
    }

    // Calculer la moyenne par groupe
    const cahier = Object.values(grouped).map((g) => {
      const avg = g.notes.reduce((s, n) => s + n.note, 0) / g.notes.length;
      return { ...g, moyenne: Math.round(avg * 10) / 10 };
    });

    res.json({ enrollment, cahier });
  } catch (err) {
    console.error('getCahierNotes:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/notes/:languageId/bulletins  (auth)
// Bulletins trimestriels de l'élève pour une langue.
// --------------------------------------------------------------------------
async function getBulletins(req, res) {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId, languageId } },
    });
    if (!enrollment) return res.status(404).json({ error: 'Inscription non trouvée.' });

    const bulletins = await prisma.bulletin.findMany({
      where: { enrollmentId: enrollment.id },
      include: { gradeLevel: { select: { code: true, nom: true, cycle: true } } },
      orderBy: [{ annee: 'desc' }, { trimestre: 'desc' }],
    });

    res.json({ bulletins });
  } catch (err) {
    console.error('getBulletins:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// POST /api/notes/admin/bulletin  (admin)
// Génère un bulletin trimestriel à partir des NoteLecon existantes.
// Body: { enrollmentId, trimestre, annee }
// --------------------------------------------------------------------------
async function generateBulletin(req, res) {
  try {
    const { enrollmentId, trimestre, annee } = req.body;
    if (!enrollmentId || !trimestre || !annee) {
      return res.status(400).json({ error: 'enrollmentId, trimestre et annee requis.' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { gradeLevel: true, user: { select: { nom: true, prenom: true } } },
    });
    if (!enrollment) return res.status(404).json({ error: 'Inscription non trouvée.' });

    // Notes du trimestre demandé
    const notes = await prisma.noteLecon.findMany({
      where: { enrollmentId, trimestre, annee },
      include: { lesson: { select: { pilier: true } } },
    });

    // Moyennes par pilier
    const byPilier = { LANGUE_COMMUNICATION: [], CULTURE_CITOYENNETE: [], PRATIQUE_METIERS: [] };
    for (const n of notes) {
      if (n.lesson.pilier && byPilier[n.lesson.pilier]) {
        byPilier[n.lesson.pilier].push(n.note);
      }
    }

    const avg = (arr) => arr.length ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : null;
    const moyenneLangue    = avg(byPilier.LANGUE_COMMUNICATION);
    const moyenneCulture   = avg(byPilier.CULTURE_CITOYENNETE);
    const moyennePratique  = avg(byPilier.PRATIQUE_METIERS);

    const valides = [moyenneLangue, moyenneCulture, moyennePratique].filter((v) => v !== null);
    const moyenneGenerale  = valides.length ? Math.round((valides.reduce((s, v) => s + v, 0) / valides.length) * 10) / 10 : null;
    const mention          = moyenneGenerale !== null ? getMention(moyenneGenerale) : null;

    // Upsert — si le bulletin existe déjà on le recalcule
    const bulletin = await prisma.bulletin.upsert({
      where: { enrollmentId_trimestre_annee: { enrollmentId, trimestre, annee } },
      create: {
        enrollmentId,
        gradeLevelId: enrollment.gradeLevelId,
        trimestre,
        annee,
        moyenneLangue,
        moyenneCulture,
        moyennePratique,
        moyenneGenerale,
        mention,
        codeVerification: genCode(annee, trimestre),
      },
      update: {
        gradeLevelId:   enrollment.gradeLevelId,
        moyenneLangue,
        moyenneCulture,
        moyennePratique,
        moyenneGenerale,
        mention,
        validatedBy: null,
        validatedAt: null,
        pdfUrl: null,
      },
      include: { gradeLevel: true },
    });

    res.json({ bulletin, eleve: enrollment.user, nbNotes: notes.length });
  } catch (err) {
    console.error('generateBulletin:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// PATCH /api/notes/admin/bulletin/:id/validate  (admin)
// Valide le bulletin (observations optionnelles, pdfUrl optionnel).
// Body: { observations?, pdfUrl? }
// --------------------------------------------------------------------------
async function validateBulletin(req, res) {
  try {
    const { id } = req.params;
    const { observations, pdfUrl } = req.body;

    const bulletin = await prisma.bulletin.update({
      where: { id },
      data: {
        validatedBy: req.user.id,
        validatedAt: new Date(),
        ...(observations !== undefined && { observations }),
        ...(pdfUrl       !== undefined && { pdfUrl }),
      },
      include: {
        gradeLevel: true,
        enrollment: { select: { userId: true } },
      },
    });

    // Notifier l'élève
    await notifyUser(
      prisma,
      bulletin.enrollment.userId,
      'BULLETIN_VALIDE',
      '📋 Bulletin disponible',
      `Votre bulletin du ${bulletin.trimestre.replace('T', 'Trimestre ')} ${bulletin.annee} est validé. Code : ${bulletin.codeVerification ?? '—'}`,
      { bulletinId: bulletin.id, trimestre: bulletin.trimestre, annee: bulletin.annee },
    );

    res.json({ bulletin });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Bulletin non trouvé.' });
    console.error('validateBulletin:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/notes/admin/bulletins  (admin)
// Liste tous les bulletins avec pagination et filtres.
// Query: page, limit, trimestre, annee, validated
// --------------------------------------------------------------------------
async function listBulletinsAdmin(req, res) {
  try {
    const page     = parseInt(req.query.page)  || 1;
    const limit    = parseInt(req.query.limit) || 20;
    const skip     = (page - 1) * limit;
    const { trimestre, annee, validated } = req.query;

    const where = {};
    if (trimestre)  where.trimestre = trimestre;
    if (annee)      where.annee     = parseInt(annee);
    if (validated === 'true')  where.validatedAt = { not: null };
    if (validated === 'false') where.validatedAt = null;

    const [total, bulletins] = await Promise.all([
      prisma.bulletin.count({ where }),
      prisma.bulletin.findMany({
        where,
        include: {
          gradeLevel: { select: { code: true, nom: true } },
          enrollment: {
            include: {
              user:     { select: { nom: true, prenom: true, email: true } },
              language: { select: { nom: true, code: true } },
            },
          },
        },
        orderBy: [{ annee: 'desc' }, { trimestre: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    res.json({ total, page, limit, bulletins });
  } catch (err) {
    console.error('listBulletinsAdmin:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/verify/:code  (public — pas d'auth)
// Vérification publique d'un bulletin via son code QR.
// --------------------------------------------------------------------------
async function verifyBulletin(req, res) {
  try {
    const { code } = req.params;
    const bulletin = await prisma.bulletin.findUnique({
      where: { codeVerification: code },
      include: {
        gradeLevel: { select: { code: true, nom: true, cycle: true } },
        enrollment: {
          include: {
            user:     { select: { nom: true, prenom: true } },
            language: { select: { nom: true, code: true } },
          },
        },
      },
    });

    if (!bulletin) return res.status(404).json({ error: 'Code invalide ou bulletin non trouvé.' });
    if (!bulletin.validatedAt) return res.status(403).json({ error: 'Ce bulletin n\'a pas encore été validé.' });

    res.json({
      valide: true,
      bulletin: {
        code:             bulletin.codeVerification,
        eleve:            `${bulletin.enrollment.user.prenom} ${bulletin.enrollment.user.nom}`,
        langue:           bulletin.enrollment.language.nom,
        classe:           bulletin.gradeLevel.nom,
        cycle:            bulletin.gradeLevel.cycle,
        trimestre:        bulletin.trimestre,
        annee:            bulletin.annee,
        mention:          bulletin.mention,
        moyenneGenerale:  bulletin.moyenneGenerale,
        validatedAt:      bulletin.validatedAt,
      },
    });
  } catch (err) {
    console.error('verifyBulletin:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

module.exports = {
  recordNote,
  getCahierNotes,
  getBulletins,
  generateBulletin,
  validateBulletin,
  listBulletinsAdmin,
  verifyBulletin,
};
