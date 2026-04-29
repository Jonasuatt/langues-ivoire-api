const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Envoyer une notification à tous les utilisateurs ou à un utilisateur ciblé
 * POST /api/admin/notifications/send
 * Body: { titre, corps, type, targetUserId? (null = tous), data? }
 */
const sendNotification = async (req, res, next) => {
  try {
    const { titre, corps, type = 'SYSTEM', targetUserId, data } = req.body;

    if (!titre || !corps) {
      return res.status(400).json({ error: 'Champs obligatoires : titre, corps' });
    }

    if (targetUserId) {
      // Notification ciblée (un seul utilisateur)
      const user = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } });
      if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

      const notification = await prisma.notification.create({
        data: { userId: targetUserId, type, titre, corps, data: data || null },
      });
      return res.status(201).json({ sent: 1, notifications: [notification] });
    }

    // Notification globale — tous les utilisateurs actifs
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    if (users.length === 0) return res.json({ sent: 0 });

    await prisma.notification.createMany({
      data: users.map(u => ({
        userId: u.id,
        type,
        titre,
        corps,
        data: data || null,
      })),
    });

    res.status(201).json({ sent: users.length });
  } catch (err) {
    next(err);
  }
};

/**
 * Historique des notifications envoyées depuis le CMS (globales / admin)
 * GET /api/admin/notifications/history
 */
const getNotificationHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les notifications système (type SYSTEM) groupées par (titre, corps, createdAt)
    // On prend juste les plus récentes distinctes (un représentant par envoi)
    const notifications = await prisma.notification.findMany({
      where: { type: 'SYSTEM' },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      distinct: ['titre', 'corps'],
      select: {
        id: true, titre: true, corps: true, type: true, createdAt: true,
      },
    });

    // Pour chaque notification, compter combien d'utilisateurs l'ont reçue
    const withCounts = await Promise.all(
      notifications.map(async (n) => {
        const total = await prisma.notification.count({
          where: { titre: n.titre, corps: n.corps, createdAt: n.createdAt },
        });
        const read = await prisma.notification.count({
          where: { titre: n.titre, corps: n.corps, createdAt: n.createdAt, isRead: true },
        });
        return { ...n, totalRecipients: total, readCount: read };
      })
    );

    const total = await prisma.notification.count({ where: { type: 'SYSTEM' } });
    res.json({ data: withCounts, total, page: parseInt(page) });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendNotification, getNotificationHistory };
