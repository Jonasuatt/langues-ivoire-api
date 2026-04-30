const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
    const { nom, prenom, email, motDePasse, dateNaissance, telephone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 12);

    const user = await prisma.user.create({
      data: { nom, prenom, email, motDePasseHash, dateNaissance, telephone },
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
    const { nom, prenom, telephone, photo, niveauPref, languesFavorites, notifEnabled, tuteurPref } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { nom, prenom, telephone, photo, niveauPref, languesFavorites, notifEnabled, tuteurPref },
      select: { id: true, nom: true, prenom: true, email: true, photo: true, role: true, isPremium: true,
                niveauPref: true, languesFavorites: true, notifEnabled: true, tuteurPref: true },
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

module.exports = { register, login, refreshToken, getMe, updateMe, changePassword };
