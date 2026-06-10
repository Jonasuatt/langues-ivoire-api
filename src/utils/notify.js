/**
 * notifyUser — crée une notification en base pour un utilisateur donné.
 * Silencieux en cas d'erreur pour ne jamais bloquer l'action principale.
 *
 * @param {PrismaClient} prisma
 * @param {string} userId
 * @param {string} type  — valeur de l'enum NotificationType
 * @param {string} titre
 * @param {string} corps
 * @param {object} [data]
 */
async function notifyUser(prisma, userId, type, titre, corps, data = null) {
  try {
    await prisma.notification.create({
      data: { userId, type, titre, corps, data },
    });
  } catch (err) {
    console.error('[notify] Erreur création notification:', err.message);
  }
}

module.exports = { notifyUser };
