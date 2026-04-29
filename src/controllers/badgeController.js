const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBadges = async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { nom: 'asc' },
      include: {
        _count: { select: { users: true } },
      },
    });
    res.json(badges);
  } catch (err) {
    next(err);
  }
};

const getBadge = async (req, res, next) => {
  try {
    const badge = await prisma.badge.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { users: true } },
        users: {
          take: 10,
          orderBy: { obtainedAt: 'desc' },
          include: { user: { select: { id: true, nom: true, prenom: true, email: true } } },
        },
      },
    });
    if (!badge) return res.status(404).json({ error: 'Badge introuvable' });
    res.json(badge);
  } catch (err) {
    next(err);
  }
};

const createBadge = async (req, res, next) => {
  try {
    const { nom, description, imageUrl, categorie, condition, pointsXp } = req.body;
    if (!nom || !description || !categorie || !condition) {
      return res.status(400).json({ error: 'Champs obligatoires : nom, description, categorie, condition' });
    }
    const badge = await prisma.badge.create({
      data: { nom, description, imageUrl, categorie, condition, pointsXp: pointsXp || 0 },
    });
    res.status(201).json(badge);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Un badge avec ce nom existe déjà' });
    next(err);
  }
};

const updateBadge = async (req, res, next) => {
  try {
    const { nom, description, imageUrl, categorie, condition, pointsXp } = req.body;
    const data = {};
    if (nom        !== undefined) data.nom        = nom;
    if (description !== undefined) data.description = description;
    if (imageUrl   !== undefined) data.imageUrl   = imageUrl;
    if (categorie  !== undefined) data.categorie  = categorie;
    if (condition  !== undefined) data.condition  = condition;
    if (pointsXp   !== undefined) data.pointsXp   = pointsXp;

    const badge = await prisma.badge.update({
      where: { id: req.params.id },
      data,
    });
    res.json(badge);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Un badge avec ce nom existe déjà' });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Badge introuvable' });
    next(err);
  }
};

const deleteBadge = async (req, res, next) => {
  try {
    // Supprimer d'abord les user_badges liés
    await prisma.userBadge.deleteMany({ where: { badgeId: req.params.id } });
    await prisma.badge.delete({ where: { id: req.params.id } });
    res.json({ message: 'Badge supprimé' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Badge introuvable' });
    next(err);
  }
};

module.exports = { getBadges, getBadge, createBadge, updateBadge, deleteBadge };
