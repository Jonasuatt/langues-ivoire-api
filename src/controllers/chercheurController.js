const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TYPE_LABELS = {
  AUDIO_ENREGISTREMENT: { label: 'Enregistrements audio validés', icon: '🎙️' },
  CONTRIBUTION_LANGUE:  { label: 'Contributions dictionnaire publiées', icon: '📖' },
  LECON_MAITRISEE:      { label: 'Leçons maîtrisées (score ≥ 75 %)', icon: '✅' },
};

// ── Calcul de la progression pour un (userId, languageId, gradeLevelId) ─────
async function computeChercheurProgress(userId, languageId, gradeLevelId) {
  const [objectifs, enrollment] = await Promise.all([
    prisma.objectifChercheur.findMany({
      where: { gradeLevelId, isActive: true },
    }),
    prisma.enrollment.findUnique({
      where: { userId_languageId: { userId, languageId } },
      select: { id: true },
    }),
  ]);

  if (!enrollment) return { objectifs: [], allMet: false };

  const results = await Promise.all(objectifs.map(async (obj) => {
    let atteint = 0;
    if (obj.type === 'AUDIO_ENREGISTREMENT') {
      atteint = await prisma.audioContribution.count({
        where: { userId, languageId, isValidated: true },
      });
    } else if (obj.type === 'CONTRIBUTION_LANGUE') {
      atteint = await prisma.contribution.count({
        where: { userId, languageId, status: 'PUBLISHED' },
      });
    } else if (obj.type === 'LECON_MAITRISEE') {
      atteint = await prisma.noteLecon.count({
        where: { enrollmentId: enrollment.id, score: { gte: 75 } },
      });
    }
    return {
      id:          obj.id,
      type:        obj.type,
      icon:        TYPE_LABELS[obj.type]?.icon ?? '🎯',
      label:       TYPE_LABELS[obj.type]?.label ?? obj.type,
      description: obj.description,
      quantite:    obj.quantite,
      atteint,
      pct:         Math.min(100, Math.round((atteint / obj.quantite) * 100)),
      done:        atteint >= obj.quantite,
    };
  }));

  return {
    objectifs: results,
    allMet: results.length > 0 && results.every(r => r.done),
  };
}

// ── GET /curriculum/chercheur/:languageId/dashboard ──────────────────────────
async function getDashboardChercheur(req, res) {
  const { languageId } = req.params;
  const userId = req.user.id;

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId, languageId } },
      include: { gradeLevel: true, language: { select: { nom: true, emoji: true } } },
    });
    if (!enrollment) return res.status(404).json({ error: 'Inscription introuvable' });
    if (enrollment.gradeLevel.cycle !== 'CHERCHEUR') {
      return res.status(403).json({ error: 'Ce tableau de bord est réservé aux étudiants Chercheur' });
    }

    const progress = await computeChercheurProgress(userId, languageId, enrollment.gradeLevelId);

    // Stats globales de contribution (toutes langues)
    const [totalAudio, totalContrib] = await Promise.all([
      prisma.audioContribution.count({ where: { userId, isValidated: true } }),
      prisma.contribution.count({ where: { userId, status: 'PUBLISHED' } }),
    ]);

    res.json({
      gradeLevel:  enrollment.gradeLevel,
      language:    enrollment.language,
      progress,
      stats: { totalAudio, totalContrib },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ── Admin : liste des objectifs ───────────────────────────────────────────────
async function listObjectifs(req, res) {
  try {
    const objectifs = await prisma.objectifChercheur.findMany({
      include: { gradeLevel: { select: { id: true, nom: true, ordre: true } } },
      orderBy: [{ gradeLevel: { ordre: 'asc' } }, { type: 'asc' }],
    });
    res.json(objectifs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ── Admin : créer ─────────────────────────────────────────────────────────────
async function createObjectif(req, res) {
  const { gradeLevelId, type, quantite, description } = req.body;
  if (!gradeLevelId || !type || !quantite) {
    return res.status(400).json({ error: 'gradeLevelId, type et quantite requis' });
  }
  try {
    const obj = await prisma.objectifChercheur.create({
      data: { gradeLevelId, type, quantite: parseInt(quantite), description },
      include: { gradeLevel: { select: { nom: true, ordre: true } } },
    });
    res.status(201).json(obj);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ── Admin : modifier ──────────────────────────────────────────────────────────
async function updateObjectif(req, res) {
  const { id } = req.params;
  const { quantite, description, isActive } = req.body;
  try {
    const obj = await prisma.objectifChercheur.update({
      where: { id },
      data: {
        ...(quantite    !== undefined && { quantite: parseInt(quantite) }),
        ...(description !== undefined && { description }),
        ...(isActive    !== undefined && { isActive }),
      },
      include: { gradeLevel: { select: { nom: true, ordre: true } } },
    });
    res.json(obj);
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Objectif introuvable' });
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ── Admin : supprimer ─────────────────────────────────────────────────────────
async function deleteObjectif(req, res) {
  try {
    await prisma.objectifChercheur.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Objectif introuvable' });
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  computeChercheurProgress,
  getDashboardChercheur,
  listObjectifs,
  createObjectif,
  updateObjectif,
  deleteObjectif,
};
