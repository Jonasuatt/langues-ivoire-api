const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FICHE_INCLUDE = {
  language:   { select: { id: true, nom: true, emoji: true, code: true } },
  gradeLevel: { select: { id: true, nom: true, cycle: true, ordre: true } },
  createdBy:  { select: { id: true, prenom: true, nom: true } },
};

// --------------------------------------------------------------------------
// GET /api/fiches?languageId=&gradeLevelId=&pilier=&trimestre=&type=&published=
// Liste publique (auth requis) — filtres optionnels. Les élèves voient uniquement les
// fiches publiées ; les admins voient tout.
// --------------------------------------------------------------------------
async function listFiches(req, res) {
  try {
    const { languageId, gradeLevelId, pilier, trimestre, type } = req.query;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user?.role);

    const where = {};
    if (!isAdmin) where.isPublished = true;
    if (languageId)   where.languageId   = languageId;
    if (gradeLevelId) where.gradeLevelId = gradeLevelId;
    if (pilier)       where.pilier       = pilier;
    if (trimestre)    where.trimestre    = trimestre;
    if (type)         where.type         = type;

    const fiches = await prisma.fichePedagogique.findMany({
      where,
      include: FICHE_INCLUDE,
      orderBy: [{ trimestre: 'asc' }, { semaine: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({ fiches });
  } catch (err) {
    console.error('listFiches:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/fiches/:id
// --------------------------------------------------------------------------
async function getFiche(req, res) {
  try {
    const fiche = await prisma.fichePedagogique.findUnique({
      where: { id: req.params.id },
      include: FICHE_INCLUDE,
    });
    if (!fiche) return res.status(404).json({ error: 'Fiche non trouvée.' });

    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(req.user?.role);
    if (!fiche.isPublished && !isAdmin) {
      return res.status(403).json({ error: 'Fiche non disponible.' });
    }

    res.json({ fiche });
  } catch (err) {
    console.error('getFiche:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// POST /api/admin/fiches  (admin)
// --------------------------------------------------------------------------
async function createFiche(req, res) {
  try {
    const {
      titre, description, contenu, type, pilier, trimestre, semaine,
      isPublished, fileUrl, languageId, gradeLevelId,
    } = req.body;

    if (!titre || !contenu || !languageId || !gradeLevelId) {
      return res.status(400).json({ error: 'titre, contenu, languageId et gradeLevelId sont requis.' });
    }

    const fiche = await prisma.fichePedagogique.create({
      data: {
        titre,
        description: description ?? null,
        contenu,
        type:        type        ?? 'COURS',
        pilier:      pilier      ?? null,
        trimestre:   trimestre   ?? null,
        semaine:     semaine     ? parseInt(semaine) : null,
        isPublished: Boolean(isPublished),
        fileUrl:     fileUrl     ?? null,
        languageId,
        gradeLevelId,
        createdById: req.user.id,
      },
      include: FICHE_INCLUDE,
    });

    res.status(201).json({ fiche });
  } catch (err) {
    console.error('createFiche:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// PUT /api/admin/fiches/:id  (admin)
// --------------------------------------------------------------------------
async function updateFiche(req, res) {
  try {
    const {
      titre, description, contenu, type, pilier, trimestre, semaine,
      isPublished, fileUrl, languageId, gradeLevelId,
    } = req.body;

    const existing = await prisma.fichePedagogique.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Fiche non trouvée.' });

    const fiche = await prisma.fichePedagogique.update({
      where: { id: req.params.id },
      data: {
        ...(titre       !== undefined && { titre }),
        ...(description !== undefined && { description }),
        ...(contenu     !== undefined && { contenu }),
        ...(type        !== undefined && { type }),
        ...(pilier      !== undefined && { pilier: pilier || null }),
        ...(trimestre   !== undefined && { trimestre: trimestre || null }),
        ...(semaine     !== undefined && { semaine: semaine ? parseInt(semaine) : null }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(fileUrl     !== undefined && { fileUrl: fileUrl || null }),
        ...(languageId  !== undefined && { languageId }),
        ...(gradeLevelId !== undefined && { gradeLevelId }),
      },
      include: FICHE_INCLUDE,
    });

    res.json({ fiche });
  } catch (err) {
    console.error('updateFiche:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// PATCH /api/admin/fiches/:id/publish  (admin)
// --------------------------------------------------------------------------
async function togglePublish(req, res) {
  try {
    const existing = await prisma.fichePedagogique.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Fiche non trouvée.' });

    const fiche = await prisma.fichePedagogique.update({
      where: { id: req.params.id },
      data:  { isPublished: !existing.isPublished },
      include: FICHE_INCLUDE,
    });

    res.json({ fiche });
  } catch (err) {
    console.error('togglePublish:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// DELETE /api/admin/fiches/:id  (admin)
// --------------------------------------------------------------------------
async function deleteFiche(req, res) {
  try {
    const existing = await prisma.fichePedagogique.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Fiche non trouvée.' });

    await prisma.fichePedagogique.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteFiche:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

module.exports = { listFiches, getFiche, createFiche, updateFiche, togglePublish, deleteFiche };
