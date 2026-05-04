const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NIVEAU_LABELS = {
  A1: 'Débutant', A2: 'Élémentaire',
  B1: 'Intermédiaire', B2: 'Intermédiaire avancé',
  C1: 'Avancé',
};

// Utilisateur : ses certificats
const getMyCertificates = async (req, res, next) => {
  try {
    const certs = await prisma.certificate.findMany({
      where: { userId: req.user.id },
      include: {
        language: { select: { nom: true, code: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
    res.json(certs);
  } catch (err) { next(err); }
};

// Admin : émettre un certificat manuellement
const issueCertificate = async (req, res, next) => {
  try {
    const { userId, languageId, niveau } = req.body;
    if (!userId || !languageId || !niveau) {
      return res.status(400).json({ error: 'userId, languageId et niveau sont obligatoires' });
    }

    const [user, language] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { nom: true, prenom: true } }),
      prisma.language.findUnique({ where: { id: languageId }, select: { nom: true } }),
    ]);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    const cert = await prisma.certificate.upsert({
      where: { userId_languageId_niveau: { userId, languageId, niveau } },
      update: { issuedAt: new Date(), issuedBy: req.user.id },
      create: { userId, languageId, niveau, issuedBy: req.user.id },
      include: { language: { select: { nom: true, code: true } } },
    });

    // Notifier l'utilisateur
    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE',
        titre: '🎓 Nouveau certificat obtenu !',
        corps: `Félicitations ${user.prenom} ! Vous avez obtenu votre certificat de niveau ${niveau} (${NIVEAU_LABELS[niveau]}) en ${language.nom}. Retrouvez-le dans votre profil.`,
      },
    });

    res.status(201).json(cert);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ce certificat a déjà été émis pour cet utilisateur' });
    }
    next(err);
  }
};

// Admin : tous les certificats
const getAllCertificates = async (req, res, next) => {
  try {
    const { languageId, niveau, page = 1, limit = 30 } = req.query;
    const where = {};
    if (languageId) where.languageId = languageId;
    if (niveau) where.niveau = niveau;

    const [certs, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: {
          user: { select: { nom: true, prenom: true, email: true } },
          language: { select: { nom: true, code: true } },
        },
        orderBy: { issuedAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.certificate.count({ where }),
    ]);

    res.json({ data: certs, total });
  } catch (err) { next(err); }
};

// Auto-émission : appelé après complétion d'une leçon (depuis progressController)
const autoIssueCertificate = async (userId, languageId, niveau) => {
  try {
    // Vérifier si tous les leçons du niveau sont complétées
    const [allLessons, completedLessons] = await Promise.all([
      prisma.lesson.count({ where: { languageId, niveau, isActive: true } }),
      prisma.userProgress.count({
        where: {
          userId,
          lesson: { languageId, niveau, isActive: true },
          statut: 'completed',
        },
      }),
    ]);

    if (allLessons === 0 || completedLessons < allLessons) return null;

    // Vérifier que le certificat n'existe pas déjà
    const existing = await prisma.certificate.findUnique({
      where: { userId_languageId_niveau: { userId, languageId, niveau } },
    });
    if (existing) return null;

    const [user, language] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { nom: true, prenom: true } }),
      prisma.language.findUnique({ where: { id: languageId }, select: { nom: true } }),
    ]);

    const cert = await prisma.certificate.create({
      data: { userId, languageId, niveau },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE',
        titre: '🎓 Certificat obtenu automatiquement !',
        corps: `Bravo ${user.prenom} ! Vous avez complété toutes les leçons de niveau ${niveau} en ${language.nom} et obtenu votre certificat. Félicitations !`,
      },
    });

    return cert;
  } catch (err) {
    console.error('autoIssueCertificate error:', err);
    return null;
  }
};

module.exports = { getMyCertificates, issueCertificate, getAllCertificates, autoIssueCertificate };
