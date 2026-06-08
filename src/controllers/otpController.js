/**
 * otpController.js — LANGUES IVOIRE
 * Authentification par numéro de téléphone + OTP SMS.
 *
 * Routes exposées :
 *   POST /auth/send-otp          { telephone }
 *   POST /auth/verify-otp        { telephone, code }         → {verified: true}
 *   POST /auth/login-phone       { telephone, code }         → {user, tokens}
 *   POST /auth/register-phone    { telephone, code, prenom, nom, genre? }
 */

const { PrismaClient } = require('@prisma/client');
const jwt              = require('jsonwebtoken');
const { sendOTP }      = require('../services/smsService');

const prisma = new PrismaClient();

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Génère un OTP numérique à 6 chiffres */
function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Génère les tokens JWT (même logique que authController) */
function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET + '_refresh', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
}

/** Formate un numéro en E.164 avec +225 par défaut si pas d'indicatif */
function formatPhone(raw) {
  let phone = String(raw).replace(/\s/g, '');
  if (!phone.startsWith('+')) phone = '+225' + phone;
  return phone;
}

// ─── Champs user renvoyés au client (pas de hash) ─────────────────────────
const USER_SELECT = {
  id: true, nom: true, prenom: true, email: true, telephone: true,
  phoneVerified: true, photo: true, role: true, isPremium: true,
  streak: true, createdAt: true,
};

// ─── 1. Envoyer l'OTP ─────────────────────────────────────────────────────
const sendOtp = async (req, res, next) => {
  try {
    const telephone = formatPhone(req.body.telephone);

    // Valider le format : +XXX...
    if (!/^\+\d{8,15}$/.test(telephone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide' });
    }

    // Anti-spam : max 1 OTP actif toutes les 60 secondes
    const recent = await prisma.phoneOTP.findFirst({
      where: {
        telephone,
        used: false,
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });
    if (recent) {
      return res.status(429).json({
        error: 'Un code vient d\'être envoyé. Attendez 60 secondes avant de réessayer.',
      });
    }

    // Invalider les anciens OTPs pour ce numéro
    await prisma.phoneOTP.updateMany({
      where: { telephone, used: false },
      data:  { used: true },
    });

    // Créer le nouvel OTP (expire dans 10 min)
    const code      = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60_000);

    await prisma.phoneOTP.create({ data: { telephone, code, expiresAt } });

    // Envoyer le SMS
    const result = await sendOTP(telephone, code);

    // En mode dev, renvoyer le code dans la réponse pour faciliter les tests
    const response = { message: `Code envoyé au ${telephone}` };
    if (result.devCode) response.devCode = result.devCode; // UNIQUEMENT en dev

    res.json(response);
  } catch (err) {
    next(err);
  }
};

// ─── 2. Vérifier l'OTP (sans login — pour vérification de numéro) ──────────
const verifyOtp = async (req, res, next) => {
  try {
    const telephone = formatPhone(req.body.telephone);
    const { code }  = req.body;

    const result = await _checkOTP(telephone, code);
    if (!result.ok) return res.status(400).json({ error: result.error });

    res.json({ verified: true, telephone });
  } catch (err) {
    next(err);
  }
};

// ─── 3. Connexion par téléphone + OTP ─────────────────────────────────────
const loginWithPhone = async (req, res, next) => {
  try {
    const telephone = formatPhone(req.body.telephone);
    const { code }  = req.body;

    // Vérifier l'OTP
    const check = await _checkOTP(telephone, code);
    if (!check.ok) return res.status(400).json({ error: check.error });

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({ where: { telephone }, select: USER_SELECT });
    if (!user) {
      return res.status(404).json({
        error: 'Aucun compte trouvé pour ce numéro. Veuillez vous inscrire d\'abord.',
        shouldRegister: true,
      });
    }

    // Marquer le numéro comme vérifié si ce n'est pas déjà fait
    if (!user.phoneVerified) {
      await prisma.user.update({ where: { telephone }, data: { phoneVerified: true, lastActiveAt: new Date() } });
    } else {
      await prisma.user.update({ where: { telephone }, data: { lastActiveAt: new Date() } });
    }

    const tokens = generateTokens(user.id);
    res.json({ user: { ...user, phoneVerified: true }, ...tokens });
  } catch (err) {
    next(err);
  }
};

// ─── 4. Inscription par téléphone + OTP ───────────────────────────────────
const registerWithPhone = async (req, res, next) => {
  try {
    const telephone = formatPhone(req.body.telephone);
    const { code, prenom, nom, genre } = req.body;

    if (!prenom?.trim() || !nom?.trim()) {
      return res.status(400).json({ error: 'Le prénom et le nom sont requis' });
    }

    // Vérifier l'OTP
    const check = await _checkOTP(telephone, code);
    if (!check.ok) return res.status(400).json({ error: check.error });

    // Vérifier que le numéro n'est pas déjà utilisé
    const existing = await prisma.user.findUnique({ where: { telephone } });
    if (existing) {
      return res.status(409).json({
        error: 'Un compte existe déjà avec ce numéro. Connectez-vous.',
        shouldLogin: true,
      });
    }

    // Créer le compte (sans email — champ optionnel depuis la migration)
    const user = await prisma.user.create({
      data: {
        nom:           nom.trim(),
        prenom:        prenom.trim(),
        telephone,
        phoneVerified: true,
        genre:         genre || null,
        lastActiveAt:  new Date(),
      },
      select: USER_SELECT,
    });

    const tokens = generateTokens(user.id);
    res.status(201).json({ user, ...tokens });
  } catch (err) {
    next(err);
  }
};

// ─── Helper interne : vérification OTP ────────────────────────────────────
async function _checkOTP(telephone, code) {
  const otp = await prisma.phoneOTP.findFirst({
    where: { telephone, used: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return { ok: false, error: 'Aucun code en attente. Demandez un nouveau code.' };
  if (new Date() > otp.expiresAt) {
    await prisma.phoneOTP.update({ where: { id: otp.id }, data: { used: true } });
    return { ok: false, error: 'Code expiré. Demandez un nouveau code.' };
  }
  if (otp.attempts >= 3) {
    await prisma.phoneOTP.update({ where: { id: otp.id }, data: { used: true } });
    return { ok: false, error: 'Trop de tentatives. Demandez un nouveau code.' };
  }
  if (otp.code !== String(code)) {
    await prisma.phoneOTP.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    const remaining = 3 - (otp.attempts + 1);
    return { ok: false, error: `Code incorrect. ${remaining} essai(s) restant(s).` };
  }

  // Code correct → marquer comme utilisé
  await prisma.phoneOTP.update({ where: { id: otp.id }, data: { used: true } });
  return { ok: true };
}

module.exports = { sendOtp, verifyOtp, loginWithPhone, registerWithPhone };
