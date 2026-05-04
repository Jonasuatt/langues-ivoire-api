const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Utilisateur : créer un message
const createMessage = async (req, res, next) => {
  try {
    const { sujet, corps } = req.body;
    if (!sujet || !corps) return res.status(400).json({ error: 'Sujet et corps obligatoires' });
    const message = await prisma.supportMessage.create({
      data: { userId: req.user.id, sujet, corps },
    });
    res.status(201).json(message);
  } catch (err) { next(err); }
};

// Utilisateur : ses messages
const getMyMessages = async (req, res, next) => {
  try {
    const messages = await prisma.supportMessage.findMany({
      where: { userId: req.user.id },
      include: { reponses: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (err) { next(err); }
};

// Admin : tous les messages
const getAllMessages = async (req, res, next) => {
  try {
    const { statut, page = 1, limit = 20 } = req.query;
    const where = statut ? { statut } : {};
    const [messages, total] = await Promise.all([
      prisma.supportMessage.findMany({
        where,
        include: {
          user: { select: { nom: true, prenom: true, email: true } },
          reponses: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.supportMessage.count({ where }),
    ]);
    res.json({ data: messages, total });
  } catch (err) { next(err); }
};

// Admin : répondre + changer statut
const replyMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { corps, statut } = req.body;
    if (!corps) return res.status(400).json({ error: 'Réponse obligatoire' });

    const message = await prisma.supportMessage.findUnique({ where: { id } });
    if (!message) return res.status(404).json({ error: 'Message non trouvé' });

    const [reply] = await prisma.$transaction([
      prisma.supportReply.create({
        data: { messageId: id, adminId: req.user.id, corps },
      }),
      prisma.supportMessage.update({
        where: { id },
        data: { statut: statut || 'EN_COURS', updatedAt: new Date() },
      }),
    ]);

    // Notifier l'utilisateur
    await prisma.notification.create({
      data: {
        userId: message.userId,
        type: 'SYSTEM',
        titre: '💬 Réponse à votre message',
        corps: `L'équipe Langues Ivoire a répondu à votre message "${message.sujet}". Consultez vos messages dans votre profil.`,
      },
    });

    res.json(reply);
  } catch (err) { next(err); }
};

// Admin : changer le statut
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const updated = await prisma.supportMessage.update({
      where: { id }, data: { statut },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

module.exports = { createMessage, getMyMessages, getAllMessages, replyMessage, updateStatus };
