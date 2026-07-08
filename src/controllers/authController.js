const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET + '_refresh', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, motDePasse, dateNaissance, telephone, genre } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 12);

    const user = await prisma.user.create({
      data: { nom, prenom, email, motDePasseHash, dateNaissance, telephone, genre },
      select: { id: true, nom: true, prenom: true, email: true, role: true, createdAt: true },
    });

    const tokens = generateTokens(user.id);
    res.status(201).json({ user, ...tokens });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.motDePasseHash) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(motDePasse, user.motDePasseHash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const { motDePasseHash: _, ...safeUser } = user;
    const tokens = generateTokens(user.id);
    res.json({ user: safeUser, ...tokens });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token manquant' });

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET + '_refresh');
    const tokens = generateTokens(payload.userId);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const { motDePasseHash: _, ...safeUser } = req.user;
  res.json(safeUser);
};

const updateMe = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, photo, niveauPref, languesFavorites, notifEnabled, tuteurPref, genre, dateNaissance } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { nom, prenom, telephone, photo, niveauPref, languesFavorites, notifEnabled, tuteurPref, genre, dateNaissance },
      select: { id: true, nom: true, prenom: true, email: true, photo: true, role: true, isPremium: true,
                niveauPref: true, languesFavorites: true, notifEnabled: true, tuteurPref: true,
                genre: true, dateNaissance: true, telephone: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' });
    }
    if (nouveauMotDePasse.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(ancienMotDePasse, user.motDePasseHash);
    if (!valid) {
      return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    }
    const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { motDePasseHash } });
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    next(err);
  }
};

const changeEmail = async (req, res, next) => {
  try {
    const { nouvelEmail, motDePasse } = req.body;
    if (!nouvelEmail || !motDePasse) {
      return res.status(400).json({ error: 'Nouvel email et mot de passe requis' });
    }
    // Vérifier que l'email n'est pas déjà pris
    const existing = await prisma.user.findUnique({ where: { email: nouvelEmail } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé par un autre compte' });
    }
    // Confirmer le mot de passe actuel
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.motDePasseHash) {
      return res.status(400).json({ error: 'Compte sans mot de passe (connexion téléphone uniquement). Définissez un mot de passe d\'abord.' });
    }
    const valid = await bcrypt.compare(motDePasse, user.motDePasseHash);
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { email: nouvelEmail },
      select: { id: true, nom: true, prenom: true, email: true, role: true, isPremium: true,
                telephone: true, phoneVerified: true, photo: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ─── Suppression de compte (exigence Google Play / ARTCI) ───────────────────
// DELETE /auth/me { motDePasse? }
// Anonymisation plutôt que suppression physique : les données personnelles
// sont effacées (nom, email, téléphone, photo, OAuth, préférences), le compte
// est désactivé et déconnecté partout. Les contributions linguistiques sont
// CONSERVÉES de façon anonyme — elles font partie du corpus patrimonial
// (intérêt légitime, aucune donnée personnelle attachée).
const deleteMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'Compte introuvable.' });

    // Confirmation par mot de passe si le compte en possède un
    if (user.motDePasseHash) {
      const { motDePasse } = req.body;
      if (!motDePasse) return res.status(400).json({ error: 'Mot de passe requis pour confirmer la suppression.' });
      const valid = await bcrypt.compare(motDePasse, user.motDePasseHash);
      if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }
    if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return res.status(403).json({ error: 'Un compte administrateur ne peut pas s\'auto-supprimer. Contactez un Super-Administrateur.' });
    }

    await prisma.$transaction([
      // Données personnelles rattachées → supprimées
      prisma.srsCard.deleteMany({ where: { userId: user.id } }),
      prisma.notification.deleteMany({ where: { userId: user.id } }),
      prisma.classroomMember.deleteMany({ where: { userId: user.id } }),
      // Compte → anonymisé et désactivé
      prisma.user.update({
        where: { id: user.id },
        data: {
          nom: 'Supprimé',
          prenom: 'Compte',
          email: `deleted-${user.id}@supprime.languesivoire.ci`,
          identifiant: null,
          telephone: null,
          phoneVerified: false,
          motDePasseHash: null,
          dateNaissance: null,
          genre: null,
          photo: null,
          googleId: null,
          facebookId: null,
          languesFavorites: [],
          niveauPref: null,
          tuteurPref: null,
          notifEnabled: false,
          isPremium: false,
          isActive: false,
        },
      }),
    ]);

    res.json({
      ok: true,
      message: 'Compte supprimé. Vos données personnelles ont été effacées. Vos contributions linguistiques sont conservées anonymement dans le corpus patrimonial.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, getMe, updateMe, changePassword, changeEmail, deleteMe };
