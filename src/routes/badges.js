/**
 * Route publique — Badges disponibles
 * Accessible sans authentification (lecture seule)
 */
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/badges — liste tous les badges actifs
router.get('/', async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: [{ categorie: 'asc' }, { nom: 'asc' }],
      select: {
        id: true,
        nom: true,
        description: true,
        imageUrl: true,
        categorie: true,
        condition: true,
        pointsXp: true,
        _count: { select: { users: true } },
      },
    });
    res.json(badges);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
