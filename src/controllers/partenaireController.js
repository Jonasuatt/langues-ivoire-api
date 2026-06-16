const prisma = require('../lib/prisma');

// Public — partenaires actifs
const getPartenaires = async (req, res, next) => {
  try {
    const partenaires = await prisma.partenaire.findMany({
      where: { isActive: true },
      orderBy: { ordre: 'asc' },
    });
    res.json(partenaires);
  } catch (err) { next(err); }
};

// Admin — tous les partenaires
const getAllPartenairesAdmin = async (req, res, next) => {
  try {
    const partenaires = await prisma.partenaire.findMany({
      orderBy: [{ isActive: 'desc' }, { ordre: 'asc' }],
    });
    res.json(partenaires);
  } catch (err) { next(err); }
};

// Créer
const createPartenaire = async (req, res, next) => {
  try {
    const { nom, logoUrl, description, siteWeb, categorie, pays, ordre } = req.body;
    if (!nom) return res.status(400).json({ error: 'Le nom est requis' });

    const partenaire = await prisma.partenaire.create({
      data: {
        nom,
        logoUrl,
        description,
        siteWeb,
        categorie,
        pays,
        ordre: ordre ?? 0,
      },
    });
    res.status(201).json(partenaire);
  } catch (err) { next(err); }
};

// Modifier
const updatePartenaire = async (req, res, next) => {
  try {
    const partenaire = await prisma.partenaire.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(partenaire);
  } catch (err) { next(err); }
};

// Activer / désactiver
const togglePartenaire = async (req, res, next) => {
  try {
    const current = await prisma.partenaire.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ error: 'Partenaire introuvable' });
    const partenaire = await prisma.partenaire.update({
      where: { id: req.params.id },
      data: { isActive: !current.isActive },
    });
    res.json(partenaire);
  } catch (err) { next(err); }
};

// Supprimer définitivement
const deletePartenaire = async (req, res, next) => {
  try {
    await prisma.partenaire.delete({ where: { id: req.params.id } });
    res.json({ message: 'Partenaire supprimé' });
  } catch (err) { next(err); }
};

module.exports = {
  getPartenaires,
  getAllPartenairesAdmin,
  createPartenaire,
  updatePartenaire,
  togglePartenaire,
  deletePartenaire,
};
