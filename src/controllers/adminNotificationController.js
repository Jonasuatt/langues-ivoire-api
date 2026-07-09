const prisma = require('../lib/prisma');
const { notifyUser, notifyMany } = require('../services/pushService');

// ── Normalisation du type vers l'enum NotificationType ──────────────────────
// Le CMS (et d'autres appelants) peuvent envoyer des libellés métier ; on les
// mappe vers l'enum Prisma pour ne jamais faire échouer un envoi.
const VALID_TYPES = new Set([
  'SYSTEM', 'BADGE', 'STREAK', 'LESSON', 'PROMO', 'DAILY_REMINDER',
  'BADGE_EARNED', 'CHALLENGE', 'CULTURAL_POINT', 'STREAK_WARNING',
  'PHONE_VALIDATED', 'BULLETIN_VALIDE', 'PASSAGE_CLASSE', 'EXAMEN_REFUSE',
]);
const TYPE_ALIASES = {
  ANNONCE:   'PROMO',
  PUBLICITE: 'PROMO',
  REMINDER:  'DAILY_REMINDER',
  RAPPEL:    'DAILY_REMINDER',
  CULTURAL:  'CULTURAL_POINT',
  CULTUREL:  'CULTURAL_POINT',
  RECOMPENSE:'BADGE_EARNED',
};
function normalizeType(type) {
  const t = String(type || 'SYSTEM').toUpperCase();
  if (VALID_TYPES.has(t)) return t;
  return TYPE_ALIASES[t] ?? 'SYSTEM';
}

// ── Résolution souple du destinataire ───────────────────────────────────────
// Accepte un identifiant technique, un email ou un « Prénom Nom ».
async function resolveTargetUser(query) {
  const q = String(query).trim();
  let user = await prisma.user.findUnique({ where: { id: q }, select: { id: true } }).catch(() => null);
  if (user) return user;
  if (q.includes('@')) {
    return prisma.user.findFirst({
      where: { email: { equals: q, mode: 'insensitive' } },
      select: { id: true },
    });
  }
  const mots = q.split(/\s+/).filter(Boolean);
  if (!mots.length) return null;
  return prisma.user.findFirst({
    where: { AND: mots.map(m => ({ OR: [
      { prenom: { contains: m, mode: 'insensitive' } },
      { nom:    { contains: m, mode: 'insensitive' } },
    ] })) },
    select: { id: true },
  });
}

/**
 * Envoyer une notification à tous les utilisateurs ou à un utilisateur ciblé
 * POST /api/admin/notifications/send
 * Body: { titre, corps, type, targetUserId? (id, email ou nom — null = tous), data? }
 */
const sendNotification = async (req, res, next) => {
  try {
    const { titre, corps, targetUserId, data } = req.body;
    const type = normalizeType(req.body.type);

    if (!titre || !corps) {
      return res.status(400).json({ error: 'Champs obligatoires : titre, corps' });
    }

    if (targetUserId) {
      // Notification ciblée — accepte id, email ou « Prénom Nom »
      const user = await resolveTargetUser(targetUserId);
      if (!user) {
        return res.status(404).json({ error: `Aucun utilisateur trouvé pour « ${String(targetUserId).trim()} ». Essayez l'email exact ou le prénom et le nom.` });
      }

      const notification = await notifyUser(user.id, { type, titre, corps, data: data || {} });
      return res.status(201).json({ sent: 1, notifications: [notification] });
    }

    // Notification globale — tous les utilisateurs actifs
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    if (users.length === 0) return res.json({ sent: 0 });

    // In-app + push appareils (par lots — voir pushService)
    const sent = await notifyMany(users.map(u => u.id), { type, titre, corps, data: data || {} });

    res.status(201).json({ sent });
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
