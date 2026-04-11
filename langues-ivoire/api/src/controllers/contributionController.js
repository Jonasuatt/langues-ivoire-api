const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getContributions = async (req, res, next) => {
  try {
    const { status = 'PENDING', type, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [contributions, total] = await Promise.all([
      prisma.contribution.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { nom: true, prenom: true, email: true } },
          language: { select: { nom: true, code: true } },
        },
      }),
      prisma.contribution.count({ where }),
    ]);

    res.json({ data: contributions, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const moderateContribution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, commentaire } = req.body; // action: 'PUBLISHED' | 'REJECTED'

    const contribution = await prisma.contribution.findUnique({ where: { id } });
    if (!contribution) return res.status(404).json({ error: 'Contribution non trouvée' });

    const updated = await prisma.contribution.update({
      where: { id },
      data: {
        status: action,
        moderatorId: req.user.id,
        moderatedAt: new Date(),
        commentaire,
      },
    });

    // Si approuvée, créer l'entrée dans le dictionnaire ou les phrases
    if (action === 'PUBLISHED') {
      const contenu = contribution.contenu;
      if (contribution.type === 'WORD') {
        await prisma.dictionaryEntry.create({
          data: {
            languageId: contribution.languageId,
            mot: contenu.mot,
            traduction: contenu.traduction,
            transcription: contenu.transcription,
            categorie: contenu.categorie,
            exemplePhrase: contenu.contexte,
            contributorId: contribution.userId,
            moderatorId: req.user.id,
            moderatedAt: new Date(),
            status: 'PUBLISHED',
          },
        });
      } else if (contribution.type === 'PHRASE') {
        await prisma.usefulPhrase.create({
          data: {
            languageId: contribution.languageId,
            phrase: contenu.phrase,
            traduction: contenu.traduction,
            transcription: contenu.transcription,
            categorie: contenu.categorie,
            contexte: contenu.contexte,
            contributorId: contribution.userId,
            moderatorId: req.user.id,
            moderatedAt: new Date(),
            status: 'PUBLISHED',
          },
        });
      }

      // Récompenser le contributeur
      await prisma.user.update({
        where: { id: contribution.userId },
        data: { pointsContribution: { increment: 10 } },
      });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getContributions, moderateContribution };
