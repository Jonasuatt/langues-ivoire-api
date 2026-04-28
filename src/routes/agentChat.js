const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const { agentChat } = require('../controllers/agentChatController');

// Limite spécifique au chat IA : 30 questions par 5 minutes par utilisateur
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: { error: 'Trop de questions — attendez quelques minutes avant de réessayer.' },
  keyGenerator: (req) => req.user?.id || req.ip,
});

router.post('/', authenticate, chatLimiter, agentChat);

module.exports = router;
