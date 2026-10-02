const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { creer, publiees, lister, mettreAJour, supprimer } = require('../controllers/suggestionController');

// Derrière le proxy Railway, req.ip est celle du proxy : on prend la dernière adresse de X-Forwarded-For (ajoutée par le proxy).
const clientIp = (req) => {
  const xff = String(req.headers['x-forwarded-for'] || '').split(',').map((s) => s.trim()).filter(Boolean);
  return xff.length ? xff[xff.length - 1] : (req.socket && req.socket.remoteAddress) || 'inconnu';
};
const limiteEnvoi = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.SUGGESTIONS_MAX_PAR_HEURE || 5),
  keyGenerator: clientIp,
  validate: false,
  message: { error: 'Trop de messages envoyés. Réessayez dans une heure.' },
});

router.post('/', limiteEnvoi, creer);          // public
router.get('/publiees', publiees);             // public
router.get('/', authenticate, requireAdmin, lister);
router.patch('/:id', authenticate, requireAdmin, mettreAJour);
router.delete('/:id', authenticate, requireAdmin, supprimer);

module.exports = router;
