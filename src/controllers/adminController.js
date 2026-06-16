const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true, nom: true, prenom: true, email: true, role: true,
          isPremium: true, streak: true, bonusXp: true, createdAt: true, lastActiveAt: true,
          telephone: true, phoneVerified: true, dateNaissance: true, genre: true,
          niveauPref: true, languesFavorites: true, isActive: true,
          _count: { select: { contributions: true, progress: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ data: users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { role, isPremium, premiumUntil, isActive, newMotDePasse, phoneVerified, telephone } = req.body;
    const requestingRole = req.user.role;

    // Charger le compte cible pour vérifier son rôle actuel
    const target = await prisma.user.findUnique({ where: { id: req.params.id }, select: { role: true } });
    if (!target) return res.status(404).json({ error: 'Utilisateur introuvable' });

    // Un ADMIN ne peut pas modifier un SUPER_ADMIN
    if (requestingRole === 'ADMIN' && target.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Accès refusé : vous ne pouvez pas modifier un Super-Administrateur' });
    }
    // Un ADMIN ne peut pas attribuer le rôle SUPER_ADMIN
    if (requestingRole === 'ADMIN' && role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Accès refusé : seul un Super-Administrateur peut attribuer ce rôle' });
    }

    // Construction des données à mettre à jour
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (isPremium !== undefined) updateData.isPremium = isPremium;
    if (premiumUntil !== undefined) updateData.premiumUntil = premiumUntil;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (phoneVerified !== undefined) updateData.phoneVerified = phoneVerified;
    if (telephone !== undefined) updateData.telephone = telephone || null;

    // Réinitialisation du mot de passe (SUPER_ADMIN uniquement)
    if (newMotDePasse) {
      if (requestingRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Seul un Super-Administrateur peut réinitialiser un mot de passe' });
      }
      if (newMotDePasse.length < 8) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
      }
      updateData.motDePasseHash = await bcrypt.hash(newMotDePasse, 12);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: { id: true, nom: true, prenom: true, email: true, role: true, isPremium: true, isActive: true, telephone: true, phoneVerified: true },
    });

    // ── Notification in-app lors de la validation du numéro de téléphone ──────
    if (phoneVerified === true) {
      const tel = telephone ?? user.telephone;
      await prisma.notification.create({
        data: {
          userId: req.params.id,
          type:   'PHONE_VALIDATED',
          titre:  '📱 Numéro de téléphone activé',
          corps:  `Votre numéro ${tel ? tel + ' a' : 'a'} été validé par l'administrateur. Vous pouvez désormais vous connecter à l'application avec votre numéro de téléphone.`,
          data:   { telephone: tel },
        },
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Compte désactivé' });
  } catch (err) {
    next(err);
  }
};

/**
 * Créer un compte membre directement depuis le CMS (sans passer par l'app mobile)
 * POST /api/admin/users/create
 */
const createMember = async (req, res, next) => {
  try {
    const { nom, prenom, email, motDePasse, role = 'CONTRIBUTOR' } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ error: 'Champs obligatoires : nom, prenom, email, motDePasse' });
    }

    // Un ADMIN ne peut pas créer un SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Seul un Super-Administrateur peut créer un compte Super-Admin' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 12);
    const user = await prisma.user.create({
      data: { nom, prenom, email, motDePasseHash, role, isActive: true },
      select: { id: true, nom: true, prenom: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUser, deleteUser, createMember };
