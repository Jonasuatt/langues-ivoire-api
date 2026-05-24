const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  createContribution,
  getAllContributions,
  updateStatut,
} = require('../controllers/financeContributionController');

// Mobile : l'utilisateur soumet une contribution (authentifié optionnel)
// On utilise authenticate en optionnel — si pas de token on continue quand même
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createContribution);

// Admin : lister et modérer
router.get('/', authenticate, requireAdmin, getAllContributions);
router.patch('/:id/statut', authenticate, requireAdmin, updateStatut);

module.exports = router;
