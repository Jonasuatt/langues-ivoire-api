const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ordre lycée : 2nde=11, 1ère=12, TLE=13
const LYCEE_MIN_ORDRE = 11;

// ─── Liste publique ───────────────────────────────────────────────
async function listFilieres(req, res) {
  try {
    const filieres = await prisma.filiere.findMany({
      where: { isActive: true },
      orderBy: { nom: 'asc' },
    });
    res.json(filieres);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ─── Choisir une filière (élève) ──────────────────────────────────
async function choisirFiliere(req, res) {
  const { languageId } = req.params;
  const { filiereId }  = req.body;
  const userId         = req.user.id;

  if (!filiereId) return res.status(400).json({ error: 'filiereId requis' });

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where:   { userId_languageId: { userId, languageId } },
      include: { gradeLevel: true },
    });
    if (!enrollment) return res.status(404).json({ error: 'Inscription introuvable' });

    if (enrollment.gradeLevel.ordre < LYCEE_MIN_ORDRE) {
      return res.status(403).json({
        error: 'La filière ne peut être choisie qu\'à partir de la Seconde',
      });
    }

    const filiere = await prisma.filiere.findUnique({ where: { id: filiereId } });
    if (!filiere || !filiere.isActive) {
      return res.status(404).json({ error: 'Filière introuvable ou inactive' });
    }

    const updated = await prisma.enrollment.update({
      where: { userId_languageId: { userId, languageId } },
      data:  { filiereId },
      include: { filiere: true },
    });

    res.json({ message: 'Filière enregistrée', filiere: updated.filiere });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ─── Admin : liste de toutes les filières (y compris inactives) ───
async function listFilieresAdmin(req, res) {
  try {
    const filieres = await prisma.filiere.findMany({
      orderBy: { nom: 'asc' },
      include: { _count: { select: { enrollments: true } } },
    });
    res.json(filieres);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ─── Admin : créer ────────────────────────────────────────────────
async function createFiliere(req, res) {
  const { code, nom, description, emoji } = req.body;
  if (!code || !nom) return res.status(400).json({ error: 'code et nom requis' });

  try {
    const filiere = await prisma.filiere.create({
      data: { code: code.toUpperCase(), nom, description, emoji },
    });
    res.status(201).json(filiere);
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Code déjà utilisé' });
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ─── Admin : modifier ─────────────────────────────────────────────
async function updateFiliere(req, res) {
  const { id } = req.params;
  const { nom, description, emoji, isActive } = req.body;
  try {
    const filiere = await prisma.filiere.update({
      where: { id },
      data:  { ...(nom !== undefined && { nom }), ...(description !== undefined && { description }), ...(emoji !== undefined && { emoji }), ...(isActive !== undefined && { isActive }) },
    });
    res.json(filiere);
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Filière introuvable' });
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { listFilieres, choisirFiliere, listFilieresAdmin, createFiliere, updateFiliere };
