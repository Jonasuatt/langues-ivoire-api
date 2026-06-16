const prisma = require('../lib/prisma');
/**
 * depenseController.js
 * Gestion des dépenses financières de la plateforme Langues Ivoire
 */

// ─── Lister toutes les dépenses ──────────────────────────────────────────────
const getDepenses = async (req, res) => {
  try {
    const {
      page = 1, limit = 50,
      objet, statut,
      dateDebut, dateFin,
      search,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (objet)   where.objet  = objet;
    if (statut)  where.statut = statut;
    if (search)  where.OR = [
      { sujet:       { contains: search, mode: 'insensitive' } },
      { fournisseur: { contains: search, mode: 'insensitive' } },
      { reference:   { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
    if (dateDebut || dateFin) {
      where.date = {};
      if (dateDebut) where.date.gte = new Date(dateDebut);
      if (dateFin)   where.date.lte = new Date(dateFin);
    }

    const [depenses, total] = await Promise.all([
      prisma.depense.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          createdBy: { select: { id: true, prenom: true, nom: true } },
        },
      }),
      prisma.depense.count({ where }),
    ]);

    res.json({ data: depenses, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ─── Résumé financier des dépenses ───────────────────────────────────────────
const getResumeDepenses = async (req, res) => {
  try {
    const { periode = 'tout' } = req.query;

    let dateGte;
    const now = new Date();
    if (periode === 'mois')       { dateGte = new Date(now.getFullYear(), now.getMonth(), 1); }
    else if (periode === 'trimestre') {
      const q = Math.floor(now.getMonth() / 3);
      dateGte = new Date(now.getFullYear(), q * 3, 1);
    }
    else if (periode === 'annee') { dateGte = new Date(now.getFullYear(), 0, 1); }

    const where = dateGte ? { date: { gte: dateGte } } : {};

    const [all, parObjet] = await Promise.all([
      prisma.depense.aggregate({
        where,
        _sum: { montant: true },
        _count: true,
      }),
      prisma.depense.groupBy({
        by: ['objet'],
        where,
        _sum: { montant: true },
        _count: true,
      }),
    ]);

    const validees = await prisma.depense.aggregate({
      where: { ...where, statut: 'VALIDEE' },
      _sum: { montant: true },
    });

    const enAttente = await prisma.depense.aggregate({
      where: { ...where, statut: 'EN_ATTENTE' },
      _sum: { montant: true },
    });

    res.json({
      totalMontant:       all._sum.montant ?? 0,
      totalDepenses:      all._count,
      montantValide:      validees._sum.montant ?? 0,
      montantEnAttente:   enAttente._sum.montant ?? 0,
      parObjet:           parObjet.map(p => ({ objet: p.objet, montant: p._sum.montant ?? 0, count: p._count })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ─── Créer une dépense ────────────────────────────────────────────────────────
const createDepense = async (req, res) => {
  try {
    const {
      sujet, objet, description, montant, date,
      statut = 'EN_ATTENTE', reference, fournisseur,
      pieceJointeUrl, pieceJointeNom, pieceJointeType,
    } = req.body;

    if (!sujet || !objet || !montant || !date) {
      return res.status(400).json({ error: 'sujet, objet, montant et date sont requis' });
    }

    const depense = await prisma.depense.create({
      data: {
        sujet:           String(sujet),
        objet:           String(objet),
        description:     description  ? String(description)  : null,
        montant:         parseInt(montant),
        date:            new Date(date),
        statut:          String(statut),
        reference:       reference    ? String(reference)    : null,
        fournisseur:     fournisseur  ? String(fournisseur)  : null,
        pieceJointeUrl:  pieceJointeUrl  ? String(pieceJointeUrl)  : null,
        pieceJointeNom:  pieceJointeNom  ? String(pieceJointeNom)  : null,
        pieceJointeType: pieceJointeType ? String(pieceJointeType) : null,
        createdById:     req.user?.id ?? null,
      },
      include: {
        createdBy: { select: { id: true, prenom: true, nom: true } },
      },
    });

    res.status(201).json(depense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ─── Modifier une dépense ─────────────────────────────────────────────────────
const updateDepense = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sujet, objet, description, montant, date, statut,
      reference, fournisseur,
      pieceJointeUrl, pieceJointeNom, pieceJointeType,
    } = req.body;

    const existing = await prisma.depense.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Dépense introuvable' });

    const updated = await prisma.depense.update({
      where: { id },
      data: {
        ...(sujet           !== undefined && { sujet: String(sujet) }),
        ...(objet           !== undefined && { objet: String(objet) }),
        ...(description     !== undefined && { description: description ? String(description) : null }),
        ...(montant         !== undefined && { montant: parseInt(montant) }),
        ...(date            !== undefined && { date: new Date(date) }),
        ...(statut          !== undefined && { statut: String(statut) }),
        ...(reference       !== undefined && { reference: reference ? String(reference) : null }),
        ...(fournisseur     !== undefined && { fournisseur: fournisseur ? String(fournisseur) : null }),
        ...(pieceJointeUrl  !== undefined && { pieceJointeUrl: pieceJointeUrl ? String(pieceJointeUrl) : null }),
        ...(pieceJointeNom  !== undefined && { pieceJointeNom: pieceJointeNom ? String(pieceJointeNom) : null }),
        ...(pieceJointeType !== undefined && { pieceJointeType: pieceJointeType ? String(pieceJointeType) : null }),
      },
      include: {
        createdBy: { select: { id: true, prenom: true, nom: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ─── Supprimer une dépense ────────────────────────────────────────────────────
const deleteDepense = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.depense.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Dépense introuvable' });

    await prisma.depense.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { getDepenses, getResumeDepenses, createDepense, updateDepense, deleteDepense };
