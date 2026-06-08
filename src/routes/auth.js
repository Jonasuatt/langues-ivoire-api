const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, refreshToken, getMe, updateMe, changePassword, changeEmail } = require('../controllers/authController');
const { sendOtp, verifyOtp, loginWithPhone, registerWithPhone } = require('../controllers/otpController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// ── Connexion / Inscription par EMAIL ──────────────────────────────────────
router.post('/register',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis'),
    body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('motDePasse').isLength({ min: 8 }).withMessage('Mot de passe : 8 caractères minimum'),
  ],
  validate,
  register
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
  ],
  validate,
  login
);

// ── Connexion / Inscription par TÉLÉPHONE + OTP ────────────────────────────
router.post('/send-otp',
  [ body('telephone').notEmpty().withMessage('Numéro de téléphone requis') ],
  validate,
  sendOtp
);

router.post('/verify-otp',
  [
    body('telephone').notEmpty().withMessage('Numéro requis'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code OTP à 6 chiffres'),
  ],
  validate,
  verifyOtp
);

router.post('/login-phone',
  [
    body('telephone').notEmpty().withMessage('Numéro requis'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code OTP à 6 chiffres'),
  ],
  validate,
  loginWithPhone
);

router.post('/register-phone',
  [
    body('telephone').notEmpty().withMessage('Numéro requis'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code OTP à 6 chiffres'),
    body('prenom').trim().notEmpty().withMessage('Prénom requis'),
    body('nom').trim().notEmpty().withMessage('Nom requis'),
  ],
  validate,
  registerWithPhone
);

// ── Routes protégées ───────────────────────────────────────────────────────
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);
router.patch('/change-password', authenticate, changePassword);
router.patch('/change-email',
  authenticate,
  [
    body('nouvelEmail').isEmail().withMessage('Email invalide'),
    body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
  ],
  validate,
  changeEmail
);

module.exports = router;
