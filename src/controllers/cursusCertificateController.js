const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ordres de classe qui déclenchent un certificat de fin de cycle
const CERT_TRIGGERS = {
  2:  'ETAPE_CP2',
  6:  'PRIMAIRE',
  10: 'PREMIER_CYCLE',
  13: 'MAITRISE_LINGUISTIQUE',
  16: 'CHERCHEUR',
};

const CERT_META = {
  ETAPE_CP2:             { titre: 'Certificat de Première Étape Linguistique',          emoji: '🌱' },
  PRIMAIRE:              { titre: 'Certificat de Fin du Cycle Primaire',                 emoji: '📚' },
  PREMIER_CYCLE:         { titre: 'Certificat de Fin du Premier Cycle Secondaire',       emoji: '🏫' },
  MAITRISE_LINGUISTIQUE: { titre: 'Certificat National de Maîtrise Linguistique (CNML)', emoji: '🎓' },
  CHERCHEUR:             { titre: 'Diplôme de Chercheur Linguiste ILA',                  emoji: '🔬' },
};

function genCode(type, languageCode, year) {
  const prefix = type.slice(0, 3).toUpperCase();
  const rand   = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CC-${prefix}-${languageCode.toUpperCase()}-${year}-${rand}`;
}

// --------------------------------------------------------------------------
// Appelé depuis curriculumController après chaque passage de classe.
// gradeLevelOrdre = ordre de la classe COMPLÉTÉE (ex: 2 pour CP2, 6 pour CM2)
// --------------------------------------------------------------------------
async function issueCursusCertIfEligible(userId, languageId, gradeLevelOrdre, issuedById = null) {
  const typeCert = CERT_TRIGGERS[gradeLevelOrdre];
  if (!typeCert) return null; // Pas de certificat pour cet ordre

  // Idempotence — ne pas réémettre
  const existing = await prisma.cursusCertificate.findFirst({
    where: { userId, languageId, type: typeCert },
  });
  if (existing) return existing;

  const [user, language, gradeLevel] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { prenom: true, nom: true } }),
    prisma.language.findUnique({ where: { id: languageId }, select: { nom: true, code: true } }),
    prisma.gradeLevel.findFirst({ where: { ordre: gradeLevelOrdre }, select: { id: true, nom: true } }),
  ]);
  if (!user || !language || !gradeLevel) return null;

  const code = genCode(typeCert, language.code, new Date().getFullYear());
  const cert = await prisma.cursusCertificate.create({
    data: {
      userId,
      languageId,
      gradeLevelId: gradeLevel.id,
      type: typeCert,
      codeVerification: code,
      issuedById: issuedById ?? null,
    },
  });

  // Notification
  const meta = CERT_META[typeCert];
  await prisma.notification.create({
    data: {
      userId,
      type: 'BADGE',
      titre: `${meta.emoji} ${meta.titre} obtenu !`,
      corps: `Félicitations ${user.prenom} ! Vous avez obtenu le ${meta.titre} en ${language.nom}. Retrouvez-le dans votre profil.`,
    },
  });

  return cert;
}

// --------------------------------------------------------------------------
// GET /api/curriculum/mes-certificats-cursus  (élève)
// --------------------------------------------------------------------------
async function getMesCertificats(req, res) {
  try {
    const certs = await prisma.cursusCertificate.findMany({
      where: { userId: req.user.id },
      include: {
        language:   { select: { nom: true, emoji: true, code: true } },
        gradeLevel: { select: { nom: true, cycle: true } },
        issuedBy:   { select: { prenom: true, nom: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
    res.json({ certificats: certs, meta: CERT_META });
  } catch (err) {
    console.error('getMesCertificats:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/curriculum/certificats-cursus  (admin)
// --------------------------------------------------------------------------
async function listCertificatsAdmin(req, res) {
  try {
    const { languageId, type, page = 1, limit = 30 } = req.query;
    const where = {};
    if (languageId) where.languageId = languageId;
    if (type)       where.type       = type;

    const [certs, total] = await Promise.all([
      prisma.cursusCertificate.findMany({
        where,
        include: {
          user:       { select: { prenom: true, nom: true, email: true } },
          language:   { select: { nom: true, emoji: true, code: true } },
          gradeLevel: { select: { nom: true, cycle: true } },
        },
        orderBy: { issuedAt: 'desc' },
        skip:  (parseInt(page) - 1) * parseInt(limit),
        take:  parseInt(limit),
      }),
      prisma.cursusCertificate.count({ where }),
    ]);

    res.json({ certificats: certs, total, meta: CERT_META });
  } catch (err) {
    console.error('listCertificatsAdmin:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/verify/cursus/:code  (public — vérification QR)
// --------------------------------------------------------------------------
async function verifyCursusCert(req, res) {
  try {
    const cert = await prisma.cursusCertificate.findUnique({
      where: { codeVerification: req.params.code },
      include: {
        user:       { select: { prenom: true, nom: true } },
        language:   { select: { nom: true, emoji: true } },
        gradeLevel: { select: { nom: true, cycle: true } },
      },
    });
    if (!cert) return res.status(404).json({ valid: false, error: 'Certificat non trouvé.' });

    const meta = CERT_META[cert.type];
    res.json({
      valid: true,
      eleve:     `${cert.user.prenom} ${cert.user.nom}`,
      langue:    `${cert.language.emoji ?? ''} ${cert.language.nom}`,
      classe:    cert.gradeLevel.nom,
      type:      meta.titre,
      delivreLE: cert.issuedAt,
      code:      cert.codeVerification,
    });
  } catch (err) {
    console.error('verifyCursusCert:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/curriculum/certificat-cursus/:id/html  (admin + élève)
// Page A4 imprimable
// --------------------------------------------------------------------------
async function getCertificatHtml(req, res) {
  try {
    const cert = await prisma.cursusCertificate.findUnique({
      where: { id: req.params.id },
      include: {
        user:       { select: { prenom: true, nom: true } },
        language:   { select: { nom: true, emoji: true, code: true } },
        gradeLevel: { select: { nom: true, cycle: true } },
        issuedBy:   { select: { prenom: true, nom: true } },
      },
    });
    if (!cert) return res.status(404).json({ error: 'Certificat non trouvé.' });

    const isOwner = req.user?.id === cert.userId;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user?.role);
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Accès refusé.' });

    const meta   = CERT_META[cert.type];
    const eleve  = `${cert.user.prenom} ${cert.user.nom}`;
    const langue = `${cert.language.emoji ?? ''} ${cert.language.nom}`;
    const date   = new Date(cert.issuedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const signe  = cert.issuedBy ? `${cert.issuedBy.prenom} ${cert.issuedBy.nom}` : 'Système Langues Ivoire';

    const CYCLE_DESC = {
      PRIMAIRE:   'Cycle Primaire (CP1 → CM2)',
      COLLEGE:    'Premier Cycle Secondaire (6ème → 3ème)',
      LYCEE:      'Second Cycle Secondaire (2nde → Terminale)',
      CHERCHEUR:  'Parcours Chercheur (Niveaux I → III)',
    };

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${meta.titre} — ${eleve}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', 'Times New Roman', serif; background: #fafafa; }

  .page {
    width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff;
    padding: 20mm 18mm;
    display: flex; flex-direction: column; align-items: center;
    position: relative; overflow: hidden;
  }

  /* Filigrane */
  .watermark {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 90px; font-weight: 900; color: rgba(11,61,46,0.04);
    white-space: nowrap; pointer-events: none; z-index: 0; letter-spacing: 8px;
  }

  /* Bordure ornementale */
  .border-outer {
    position: absolute; inset: 10mm;
    border: 3px solid #0B3D2E; pointer-events: none;
  }
  .border-inner {
    position: absolute; inset: 12mm;
    border: 1px solid #C8A951; pointer-events: none;
  }

  .content { position: relative; z-index: 1; width: 100%; text-align: center; }

  /* Logo + nom */
  .logo-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 6px; }
  .logo-circle {
    width: 60px; height: 60px; border-radius: 50%; background: #0B3D2E;
    display: flex; align-items: center; justify-content: center;
    color: #F47920; font-size: 24px; font-weight: 900; flex-shrink: 0;
  }
  .org-name { font-size: 20px; font-weight: 700; color: #0B3D2E; letter-spacing: 1px; text-transform: uppercase; }
  .org-sub  { font-size: 11px; color: #6b7280; margin-top: 2px; }

  .divider { width: 180px; height: 2px; background: linear-gradient(90deg, transparent, #C8A951 40%, #C8A951 60%, transparent); margin: 14px auto; }

  /* Titre du certificat */
  .cert-label { font-size: 11px; color: #6b7280; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 10px; }
  .cert-title {
    font-size: 26px; font-weight: 700; color: #0B3D2E;
    line-height: 1.2; margin-bottom: 8px;
  }
  .cert-emoji { font-size: 48px; margin: 10px 0; }

  /* Corps */
  .cert-intro { font-size: 13px; color: #6b7280; margin-bottom: 18px; }
  .eleve-name {
    font-size: 32px; font-style: italic; font-weight: 700; color: #0B3D2E;
    margin-bottom: 10px; border-bottom: 1px solid #C8A951; display: inline-block; padding-bottom: 4px;
  }
  .cert-body { font-size: 14px; color: #374151; margin: 14px 0; line-height: 1.8; }
  .langue-badge {
    display: inline-block; background: #F0FDF4; border: 1px solid #6EE7B7;
    border-radius: 8px; padding: 6px 18px; font-size: 16px; font-weight: 700;
    color: #0B3D2E; margin: 8px 0;
  }
  .cycle-info { font-size: 12px; color: #9CA3AF; margin-top: 4px; }

  .divider2 { width: 80px; height: 1px; background: #D1D5DB; margin: 18px auto; }

  /* Date + signatures */
  .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 24px; }
  .footer-col  { text-align: center; }
  .footer-label { font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .footer-val   { font-size: 13px; font-weight: 700; color: #0B3D2E; }
  .footer-sub   { font-size: 10px; color: #6b7280; font-style: italic; }

  /* QR / Code */
  .code-box {
    margin-top: 20px; background: #F9FAFB; border: 1px solid #E5E7EB;
    border-radius: 8px; padding: 10px 20px; display: inline-block;
  }
  .code-label { font-size: 9px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .code-val   { font-family: monospace; font-size: 14px; font-weight: 700; color: #0B3D2E; letter-spacing: 2px; }

  @media print {
    body { background: #fff; }
    .page { width: 100%; padding: 18mm 16mm; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="watermark">LANGUES IVOIRE</div>
  <div class="border-outer"></div>
  <div class="border-inner"></div>

  <div class="content">

    <div class="logo-row">
      <div class="logo-circle">LI</div>
      <div>
        <div class="org-name">Langues Ivoire</div>
        <div class="org-sub">Institut des Langues Africaines — Plateforme d'apprentissage des langues ivoiriennes</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="cert-label">Certificat officiel</div>
    <div class="cert-title">${meta.titre}</div>
    <div class="cert-emoji">${meta.emoji}</div>

    <div class="cert-intro">L'Institut Langues Ivoire certifie que</div>
    <div class="eleve-name">${eleve}</div>

    <div class="cert-body">
      a complété avec succès le programme d'apprentissage de la langue<br>
      <span class="langue-badge">${langue}</span><br>
      <span class="cycle-info">${CYCLE_DESC[cert.gradeLevel.cycle] ?? cert.gradeLevel.cycle} — ${cert.gradeLevel.nom}</span>
    </div>

    <div class="divider2"></div>

    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-label">Délivré le</div>
        <div class="footer-val">${date}</div>
      </div>
      <div class="footer-col">
        <div class="footer-label">Niveau atteint</div>
        <div class="footer-val">${cert.gradeLevel.nom}</div>
        <div class="footer-sub">${cert.gradeLevel.cycle}</div>
      </div>
      <div class="footer-col">
        <div class="footer-label">Validé par</div>
        <div class="footer-val">${signe}</div>
        <div class="footer-sub">Langues Ivoire</div>
      </div>
    </div>

    <div class="code-box">
      <div class="code-label">Code de vérification</div>
      <div class="code-val">${cert.codeVerification}</div>
    </div>

  </div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('getCertificatHtml:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

module.exports = {
  issueCursusCertIfEligible,
  getMesCertificats,
  listCertificatsAdmin,
  verifyCursusCert,
  getCertificatHtml,
  CERT_META,
  CERT_TRIGGERS,
};
