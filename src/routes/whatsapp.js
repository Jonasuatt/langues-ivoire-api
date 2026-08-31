const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const {
  creerCodeActivation, statutActivation, verifierWebhook, recevoirWebhook,
} = require('../controllers/whatsappController');

// Webhook Meta — nécessairement public : protégé par le verify token à
// l'abonnement, puis par la validité du code d'activation à chaque message.
router.get('/webhook', verifierWebhook);
router.post('/webhook', recevoirWebhook);

// Côté application
router.post('/activation-code', authenticate, creerCodeActivation);
router.get('/activation-status', authenticate, statutActivation);

module.exports = router;
