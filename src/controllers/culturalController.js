const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTodayCultural = async (req, res, next) => {
  try {
    // Sélection basée sur le jour de l'année pour une rotation cohérente
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const total = await prisma.culturalItem.count({ where: { isActive: true } });

    if (total === 0) return res.json(null);

    const index = dayOfYear % total;
    const items = await prisma.culturalItem.findMany({
      where: { isActive: true },
      skip: index,
      take: 1,
      include: { language: { select: { nom: true, code: true } } },
    });

    res.json(items[0] || null);
  } catch (err) {
    next(err);
  }
};

const getCulturalItems = async (req, res, next) => {
  try {
    const { type, langue, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { isActive: true };

    if (type) where.type = type;
    if (langue) {
      const language = await prisma.language.findFirst({ where: { OR: [{ id: langue }, { code: langue }] } });
      if (language) where.languageId = language.id;
    }

    const [items, total] = await Promise.all([
      prisma.culturalItem.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { datePublication: 'desc' },
        include: { language: { select: { nom: true, code: true } } },
      }),
      prisma.culturalItem.count({ where }),
    ]);

    res.json({ data: items, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const createCulturalItem = async (req, res, next) => {
  try {
    const item = await prisma.culturalItem.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateCulturalItem = async (req, res, next) => {
  try {
    const item = await prisma.culturalItem.update({ where: { id: req.params.id }, data: req.body });
    res.json(item);
  } catch (err) { next(err); }
};

const deleteCulturalItem = async (req, res, next) => {
  try {
    await prisma.culturalItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getTodayCultural, getCulturalItems, createCulturalItem, updateCulturalItem, deleteCulturalItem };
