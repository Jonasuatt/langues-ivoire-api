const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLanguages = async (req, res, next) => {
  try {
    const { mvpOnly } = req.query;
    const where = { isActive: true };
    if (mvpOnly === 'true') where.isInMvp = true;

    const languages = await prisma.language.findMany({
      where,
      orderBy: { ordreAffichage: 'asc' },
      include: {
        tutor: { select: { nomAvatar: true, imageUrl: true } },
        _count: { select: { lessons: true, dictEntries: { where: { status: 'PUBLISHED' } } } },
      },
    });
    res.json(languages);
  } catch (err) {
    next(err);
  }
};

const getLanguage = async (req, res, next) => {
  try {
    const language = await prisma.language.findFirst({
      where: { OR: [{ id: req.params.id }, { code: req.params.id }], isActive: true },
      include: {
        tutor: true,
        _count: {
          select: {
            lessons: true,
            dictEntries: { where: { status: 'PUBLISHED' } },
            usefulPhrases: { where: { status: 'PUBLISHED' } },
          },
        },
      },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });
    res.json(language);
  } catch (err) {
    next(err);
  }
};

const createLanguage = async (req, res, next) => {
  try {
    const language = await prisma.language.create({ data: req.body });
    res.status(201).json(language);
  } catch (err) {
    next(err);
  }
};

const updateLanguage = async (req, res, next) => {
  try {
    const language = await prisma.language.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(language);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLanguages, getLanguage, createLanguage, updateLanguage };
