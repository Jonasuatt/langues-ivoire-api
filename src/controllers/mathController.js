const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public — contenus actifs par langue
const getMathContenus = async (req, res, next) => {
  try {
    const { languageId, type } = req.query;
    const where = { isActive: true };
    if (languageId) where.languageId = languageId;
    if (type) where.type = type;

    const contenus = await prisma.mathContenu.findMany({
      where,
      orderBy: [{ ordre: 'asc' }, { type: 'asc' }],
      include: {
        language: { select: { nom: true, code: true, couleur: true, emoji: true } },
      },
    });
    res.json(contenus);
  } catch (err) { next(err); }
};

// Admin — tous les contenus
const getAllMathAdmin = async (req, res, next) => {
  try {
    const { languageId, type } = req.query;
    const where = {};
    if (languageId) where.languageId = languageId;
    if (type) where.type = type;

    const contenus = await prisma.mathContenu.findMany({
      where,
      orderBy: [{ isActive: 'desc' }, { ordre: 'asc' }],
      include: {
        language: { select: { nom: true, code: true, couleur: true, emoji: true } },
      },
    });
    res.json(contenus);
  } catch (err) { next(err); }
};

// Créer
const createMathContenu = async (req, res, next) => {
  try {
    const { languageId, type, titre, description, niveau, contenu, pointsXp, ordre } = req.body;
    const item = await prisma.mathContenu.create({
      data: {
        languageId: languageId || null,
        type,
        titre,
        description,
        niveau: niveau || 'A1',
        contenu,
        pointsXp: pointsXp || 20,
        ordre: ordre || 0,
      },
      include: { language: { select: { nom: true, code: true } } },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

// Modifier
const updateMathContenu = async (req, res, next) => {
  try {
    const item = await prisma.mathContenu.update({
      where: { id: req.params.id },
      data: req.body,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(item);
  } catch (err) { next(err); }
};

// Activer / désactiver
const toggleMathContenu = async (req, res, next) => {
  try {
    const current = await prisma.mathContenu.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ error: 'Contenu introuvable' });
    const item = await prisma.mathContenu.update({
      where: { id: req.params.id },
      data: { isActive: !current.isActive },
    });
    res.json(item);
  } catch (err) { next(err); }
};

// Supprimer
const deleteMathContenu = async (req, res, next) => {
  try {
    await prisma.mathContenu.delete({ where: { id: req.params.id } });
    res.json({ message: 'Contenu supprimé' });
  } catch (err) { next(err); }
};

module.exports = {
  getMathContenus,
  getAllMathAdmin,
  createMathContenu,
  updateMathContenu,
  toggleMathContenu,
  deleteMathContenu,
};
