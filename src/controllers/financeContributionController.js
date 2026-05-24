const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/finance/contributions — Enregistrer une contribution financière
const createContribution = async (req, res, next) => {
  try {
    const {
      contributeurNom,
      contributeurEmail,
      montant,
      objet,
      methode,
      message,
      statut,
    } = req.body;

    if (!montant || typeof montant !== 'number' || montant < 500) {
      return res.status(400).json({ error: 'Le montant minimum est de 500 FCFA.' });
    }

    const OBJETS_VALIDES = [
      'SOUTIEN_GENERAL', 'PARRAINAGE_LANGUE', 'ENREGISTREMENT', 'TRADUCTION', 'DON_LIBRE',
    ];
    if (objet && !OBJETS_VALIDES.includes(objet)) {
      return res.status(400).json({ error: 'Objet de contribution invalide.' });
    }

    const METHODES_VALIDES = ['ORANGE_MONEY', 'MTN_MONEY', 'WAVE', 'MOOV_MONEY'];
    if (methode && !METHODES_VALIDES.includes(methode)) {
      return res.status(400).json({ error: 'Méthode de paiement invalide.' });
    }

    const contribution = await prisma.financeContribution.create({
      data: {
        contributeurNom:   contributeurNom  || null,
        contributeurEmail: contributeurEmail || null,
        montant:   Math.round(montant),
        objet:     objet   || 'SOUTIEN_GENERAL',
        methode:   methode || 'ORANGE_MONEY',
        message:   message || null,
        statut:    'EN_ATTENTE', // toujours EN_ATTENTE à la création, ignoré du body
        userId:    req.user?.id || null,
      },
    });

    res.status(201).json({ contribution, message: 'Contribution enregistrée. Merci pour votre soutien !' });
  } catch (err) {
    next(err);
  }
};

// GET /api/finance/contributions — Liste (admin uniquement)
const getAllContributions = async (req, res, next) => {
  try {
    const { statut, page = 1, limit = 50 } = req.query;
    const where = {};
    if (statut) where.statut = statut;

    const [data, total] = await Promise.all([
      prisma.financeContribution.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { user: { select: { id: true, prenom: true, nom: true, email: true } } },
      }),
      prisma.financeContribution.count({ where }),
    ]);

    res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/finance/contributions/:id/statut — Confirmer/rejeter (admin)
const updateStatut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const STATUTS_VALIDES = ['EN_ATTENTE', 'CONFIRME', 'REJETE'];
    if (!STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }

    const contribution = await prisma.financeContribution.update({
      where: { id },
      data: { statut },
    });

    res.json(contribution);
  } catch (err) {
    next(err);
  }
};

module.exports = { createContribution, getAllContributions, updateStatut };
