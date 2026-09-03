const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  creerCodeActivation, statutActivation, verifierWebhook, recevoirWebhook, validerParCode,
  desactiverNumero,
} = require('../controllers/whatsappController');

// Webhook Meta — nécessairement public : protégé par le verify token à
// l'abonnement, puis par la validité du code d'activation à chaque message.
router.get('/webhook', verifierWebhook);
router.post('/webhook', recevoirWebhook);

// Côté application
router.post('/activation-code', authenticate, creerCodeActivation);
router.get('/activation-status', authenticate, statutActivation);
router.delete('/activation', authenticate, desactiverNumero);

// Validation manuelle depuis le CMS, tant que la Cloud API n'est pas en place
router.post('/valider-code', authenticate, requireEditor, validerParCode);

module.exports = router;
