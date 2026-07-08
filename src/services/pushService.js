const prisma = require('../lib/prisma');

/**
 * Notifications push serveur — via l'API Expo Push.
 *
 * notifyUser() est le point d'entrée unique : il crée la notification
 * in-app (table notifications) ET l'envoie sur l'appareil si l'utilisateur
 * a un pushToken et n'a pas désactivé les notifications.
 * L'échec du push n'est jamais bloquant (fire and forget avec log).
 */

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

async function sendExpoPush(messages) {
  if (!messages.length) return;
  try {
    const resp = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(messages),
    });
    const data = await resp.json().catch(() => null);
    // Nettoyage : token invalide (app désinstallée) → on l'efface
    const tickets = data?.data ?? [];
    await Promise.all(tickets.map(async (t, i) => {
      if (t?.details?.error === 'DeviceNotRegistered' && messages[i]?.to) {
        await prisma.user.updateMany({
          where: { pushToken: messages[i].to },
          data: { pushToken: null },
        }).catch(() => {});
      }
    }));
  } catch (e) {
    console.error('[Push] envoi Expo échoué:', e.message);
  }
}

/**
 * Crée la notification in-app + push sur l'appareil.
 * @param {string} userId
 * @param {{ type?: string, titre: string, corps: string, data?: object }} notif
 */
async function notifyUser(userId, { type = 'SYSTEM', titre, corps, data = {} }) {
  const notification = await prisma.notification.create({
    data: { userId, type, titre, corps, data },
  });

  // Push (non bloquant)
  prisma.user.findUnique({
    where: { id: userId },
    select: { pushToken: true, notifEnabled: true },
  }).then(u => {
    if (u?.pushToken && u.notifEnabled !== false) {
      return sendExpoPush([{
        to: u.pushToken, sound: 'default', title: titre, body: corps,
        data: { ...data, type },
      }]);
    }
  }).catch(e => console.error('[Push] notifyUser:', e.message));

  return notification;
}

/**
 * Diffusion à plusieurs utilisateurs (ex: annonce CMS).
 * Crée les notifications in-app en masse + push par lots de 100 (limite Expo).
 */
async function notifyMany(userIds, { type = 'SYSTEM', titre, corps, data = {} }) {
  if (!userIds.length) return 0;

  await prisma.notification.createMany({
    data: userIds.map(userId => ({ userId, type, titre, corps, data })),
  });

  const users = await prisma.user.findMany({
    where: { id: { in: userIds }, pushToken: { not: null }, notifEnabled: true },
    select: { pushToken: true },
  });
  const messages = users.map(u => ({
    to: u.pushToken, sound: 'default', title: titre, body: corps, data: { ...data, type },
  }));
  for (let i = 0; i < messages.length; i += 100) {
    await sendExpoPush(messages.slice(i, i + 100));
  }
  return userIds.length;
}

module.exports = { notifyUser, notifyMany, sendExpoPush };
