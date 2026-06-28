const prisma = require('../lib/prisma');
const { v4: uuidv4 } = require('uuid');
const { notifyUser } = require('../utils/notify');


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
// Helper interne : calcule et upsert le bulletin d'une inscription.
// Retourne { bulletin, nbNotes }.
// --------------------------------------------------------------------------
async function _computeAndUpsertBulletin(enrollmentId, trimestre, annee, gradeLevelId) {
  const notes = await prisma.noteLecon.findMany({
    where: { enrollmentId, trimestre, annee },
    include: { lesson: { select: { pilier: true } } },
  });

  const byPilier = { LANGUE_COMMUNICATION: [], CULTURE_CITOYENNETE: [], PRATIQUE_METIERS: [] };
  for (const n of notes) {
    if (n.lesson.pilier && byPilier[n.lesson.pilier]) {
      byPilier[n.lesson.pilier].push(n.note);
    }
  }

  const avg = (arr) => arr.length ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : null;
  const moyenneLangue   = avg(byPilier.LANGUE_COMMUNICATION);
  const moyenneCulture  = avg(byPilier.CULTURE_CITOYENNETE);
  const moyennePratique = avg(byPilier.PRATIQUE_METIERS);

  const valides = [moyenneLangue, moyenneCulture, moyennePratique].filter((v) => v !== null);
  const moyenneGenerale = valides.length
    ? Math.round((valides.reduce((s, v) => s + v, 0) / valides.length) * 10) / 10
    : null;
  const mention = moyenneGenerale !== null ? getMention(moyenneGenerale) : null;

  const bulletin = await prisma.bulletin.upsert({
    where: { enrollmentId_trimestre_annee: { enrollmentId, trimestre, annee } },
    create: {
      enrollmentId, gradeLevelId, trimestre, annee,
      moyenneLangue, moyenneCulture, moyennePratique, moyenneGenerale, mention,
      codeVerification: genCode(annee, trimestre),
    },
    update: {
      gradeLevelId, moyenneLangue, moyenneCulture, moyennePratique, moyenneGenerale, mention,
      validatedBy: null, validatedAt: null, pdfUrl: null,
    },
    include: { gradeLevel: true },
  });

  // Recalculer le rang de toute la classe pour ce trimestre/année
  await _updateClassRanks(gradeLevelId, trimestre, annee);

  // Retourner le bulletin avec le rang mis à jour
  const bulletinWithRang = await prisma.bulletin.findUnique({
    where: { id: bulletin.id },
    include: { gradeLevel: true },
  });

  return { bulletin: bulletinWithRang, nbNotes: notes.length };
}

// Recalcule et met à jour le rang de tous les élèves d'une même classe/trimestre/année
async function _updateClassRanks(gradeLevelId, trimestre, annee) {
  const classBulletins = await prisma.bulletin.findMany({
    where: { gradeLevelId, trimestre, annee, moyenneGenerale: { not: null } },
    select: { id: true, moyenneGenerale: true },
    orderBy: { moyenneGenerale: 'desc' },
  });

  const nombreEleves = classBulletins.length;
  await Promise.all(
    classBulletins.map((b, idx) =>
      prisma.bulletin.update({
        where: { id: b.id },
        data: { rang: idx + 1, nombreEleves },
      })
    )
  );
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

    const { bulletin, nbNotes } = await _computeAndUpsertBulletin(
      enrollmentId, trimestre, parseInt(annee), enrollment.gradeLevelId,
    );

    res.json({ bulletin, eleve: enrollment.user, nbNotes });
  } catch (err) {
    console.error('generateBulletin:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// POST /api/notes/admin/bulletins/batch  (admin)
// Génère les bulletins de TOUTES les inscriptions actives pour un trimestre.
// Body: { trimestre, annee, force? }
//   force=false (défaut) : ignore les bulletins déjà existants
//   force=true           : recalcule même les bulletins déjà générés (non validés)
// --------------------------------------------------------------------------
async function generateBulletinBatch(req, res) {
  try {
    const { trimestre, annee, force = false } = req.body;
    if (!trimestre || !annee) {
      return res.status(400).json({ error: 'trimestre et annee requis.' });
    }
    const anneeInt = parseInt(annee);

    const enrollments = await prisma.enrollment.findMany({
      select: { id: true, gradeLevelId: true },
    });

    // Si pas force, on exclut les inscriptions qui ont déjà un bulletin validé
    const existingValidated = force ? new Set() : new Set(
      (await prisma.bulletin.findMany({
        where: { trimestre, annee: anneeInt, validatedAt: { not: null } },
        select: { enrollmentId: true },
      })).map(b => b.enrollmentId)
    );

    let generated = 0;
    let skipped   = 0;
    let errors    = 0;

    for (const e of enrollments) {
      if (existingValidated.has(e.id)) { skipped++; continue; }
      try {
        await _computeAndUpsertBulletin(e.id, trimestre, anneeInt, e.gradeLevelId);
        generated++;
      } catch {
        errors++;
      }
    }

    res.json({ generated, skipped, errors, total: enrollments.length });
  } catch (err) {
    console.error('generateBulletinBatch:', err);
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

// --------------------------------------------------------------------------
// GET /api/notes/admin/bulletin/:id/html  (admin)
// Retourne une page HTML prête à imprimer (format bulletin scolaire A4).
// --------------------------------------------------------------------------
const MENTION_LABELS = {
  EXCELLENT: 'Excellent', TRES_BIEN: 'Très Bien', BIEN: 'Bien',
  ASSEZ_BIEN: 'Assez Bien', PASSABLE: 'Passable', INSUFFISANT: 'Insuffisant',
};
const MENTION_COLORS = {
  EXCELLENT: '#15803d', TRES_BIEN: '#1d4ed8', BIEN: '#0891b2',
  ASSEZ_BIEN: '#d97706', PASSABLE: '#ea580c', INSUFFISANT: '#dc2626',
};
const TRIM_LABELS = { T1: '1er Trimestre (Sept – Déc)', T2: '2e Trimestre (Janv – Mars)', T3: '3e Trimestre (Avr – Juin)' };

async function getBulletinHtml(req, res) {
  try {
    const b = await prisma.bulletin.findUnique({
      where: { id: req.params.id },
      include: {
        gradeLevel: true,
        enrollment: {
          include: {
            user:     { select: { nom: true, prenom: true } },
            language: { select: { nom: true, code: true, emoji: true } },
          },
        },
        validator: { select: { prenom: true, nom: true } },
      },
    });
    if (!b) return res.status(404).json({ error: 'Bulletin non trouvé.' });

    const eleve   = `${b.enrollment.user.prenom} ${b.enrollment.user.nom}`;
    const langue  = `${b.enrollment.language.emoji ?? ''} ${b.enrollment.language.nom}`;
    const mention = b.mention ? MENTION_LABELS[b.mention] : '—';
    const mentionColor = b.mention ? MENTION_COLORS[b.mention] : '#6b7280';
    const moy     = (v) => v != null ? `${v}/20` : '—';
    const rang    = b.rang ? `${b.rang}${b.rang === 1 ? 'er' : 'e'} / ${b.nombreEleves ?? '?'} élèves` : '—';
    const valide  = b.validatedAt ? `Validé le ${new Date(b.validatedAt).toLocaleDateString('fr-FR')}` : 'Non encore validé';
    const validateur = b.validator ? `${b.validator.prenom} ${b.validator.nom}` : '—';

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Bulletin — ${eleve}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff;
          padding: 12mm 14mm; display: flex; flex-direction: column; gap: 14px; }

  /* En-tête */
  .header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #0B3D2E; padding-bottom: 12px; }
  .logo-circle { width: 56px; height: 56px; border-radius: 50%; background: #0B3D2E;
                  display: flex; align-items: center; justify-content: center;
                  color: #F47920; font-size: 22px; font-weight: 900; flex-shrink: 0; }
  .header-text h1 { font-size: 18px; font-weight: 900; color: #0B3D2E; }
  .header-text p  { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .header-right   { margin-left: auto; text-align: right; }
  .header-right .trim { font-size: 13px; font-weight: 700; color: #0B3D2E; }
  .header-right .annee { font-size: 11px; color: #6b7280; }

  /* Info élève */
  .eleve-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px;
                display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
  .eleve-row { display: flex; gap: 6px; align-items: baseline; }
  .eleve-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
  .eleve-val   { font-size: 13px; font-weight: 700; color: #111; }

  /* Tableau des notes */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th { background: #0B3D2E; color: #fff; padding: 8px 10px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  tbody td { padding: 9px 10px; border-bottom: 1px solid #e5e7eb; }
  .note-val { font-weight: 700; font-size: 14px; }

  /* Résumé */
  .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .sum-card { border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; text-align: center; }
  .sum-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: .06em; }
  .sum-val   { font-size: 22px; font-weight: 900; margin-top: 4px; }
  .sum-sub   { font-size: 11px; color: #9ca3af; margin-top: 2px; }

  /* Observations */
  .obs-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; min-height: 60px; }
  .obs-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; }
  .obs-text  { font-size: 12px; color: #374151; }

  /* Pied de page */
  .footer { margin-top: auto; border-top: 1px solid #e5e7eb; padding-top: 10px;
            display: flex; justify-content: space-between; align-items: flex-end; }
  .code-block { font-size: 10px; color: #9ca3af; }
  .code-val   { font-family: monospace; font-size: 12px; font-weight: 700; color: #0B3D2E; }
  .valid-block { text-align: right; font-size: 10px; color: #6b7280; }

  @media print {
    body { background: #fff; }
    .page { width: 100%; padding: 10mm 12mm; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="logo-circle">LI</div>
    <div class="header-text">
      <h1>LANGUES IVOIRE</h1>
      <p>Bulletin Scolaire Trimestriel — Apprentissage des Langues Ethniques Ivoiriennes</p>
    </div>
    <div class="header-right">
      <div class="trim">${TRIM_LABELS[b.trimestre] ?? b.trimestre}</div>
      <div class="annee">Année scolaire ${b.annee}–${b.annee + 1}</div>
    </div>
  </div>

  <div class="eleve-card">
    <div class="eleve-row"><span class="eleve-label">Élève</span><span class="eleve-val">${eleve}</span></div>
    <div class="eleve-row"><span class="eleve-label">Langue</span><span class="eleve-val">${langue}</span></div>
    <div class="eleve-row"><span class="eleve-label">Classe</span><span class="eleve-val">${b.gradeLevel.nom} · ${b.gradeLevel.cycle}</span></div>
    <div class="eleve-row"><span class="eleve-label">Rang</span><span class="eleve-val">${rang}</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Matière (Pilier)</th>
        <th style="width:100px;text-align:center">Moyenne /20</th>
        <th style="width:200px">Observation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>📢 Langue &amp; Communication</td>
        <td style="text-align:center"><span class="note-val">${moy(b.moyenneLangue)}</span></td>
        <td style="color:#6b7280;font-size:12px">Expression orale, vocabulaire, prononciation</td>
      </tr>
      <tr>
        <td>🎭 Culture &amp; Citoyenneté</td>
        <td style="text-align:center"><span class="note-val">${moy(b.moyenneCulture)}</span></td>
        <td style="color:#6b7280;font-size:12px">Traditions, proverbes, valeurs culturelles</td>
      </tr>
      <tr>
        <td>🔨 Pratique &amp; Métiers</td>
        <td style="text-align:center"><span class="note-val">${moy(b.moyennePratique)}</span></td>
        <td style="color:#6b7280;font-size:12px">Application pratique et vie quotidienne</td>
      </tr>
    </tbody>
  </table>

  <div class="summary">
    <div class="sum-card">
      <div class="sum-label">Moyenne Générale</div>
      <div class="sum-val" style="color:#0B3D2E">${moy(b.moyenneGenerale)}</div>
      <div class="sum-sub">sur 20 points</div>
    </div>
    <div class="sum-card">
      <div class="sum-label">Mention</div>
      <div class="sum-val" style="color:${mentionColor}">${mention}</div>
      <div class="sum-sub">&nbsp;</div>
    </div>
    <div class="sum-card">
      <div class="sum-label">Classement</div>
      <div class="sum-val" style="color:#0B3D2E">${b.rang ?? '—'}</div>
      <div class="sum-sub">${b.nombreEleves ? `sur ${b.nombreEleves} élèves` : ''}</div>
    </div>
  </div>

  <div class="obs-box">
    <div class="obs-title">Observations de l'équipe pédagogique</div>
    <div class="obs-text">${b.observations ?? 'Aucune observation renseignée.'}</div>
  </div>

  <div class="footer">
    <div class="code-block">
      Code de vérification<br>
      <span class="code-val">${b.codeVerification ?? '—'}</span>
    </div>
    <div class="valid-block">
      ${valide}<br>
      <strong>${validateur}</strong>
    </div>
  </div>

</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('getBulletinHtml:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

module.exports = {
  recordNote,
  getCahierNotes,
  getBulletins,
  generateBulletin,
  generateBulletinBatch,
  validateBulletin,
  listBulletinsAdmin,
  verifyBulletin,
  getBulletinHtml,
};
