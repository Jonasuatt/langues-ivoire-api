/**
 * Routes du comité de validation ILA — /api/validation-committee
 */
const router = require('express').Router();
const { authenticate, requireExpert, requireAdmin } = require('../middleware/auth');
const {
  getSubmissions,
  getStats,
  castVote,
  removeVote,
  getSubmissionDetail,
  resetSubmission,
} = require('../controllers/validationCommitteeController');

// Statistiques globales (EXPERT+)
router.get('/stats', authenticate, requireExpert, getStats);

// Liste des soumissions à examiner (EXPERT+)
router.get('/', authenticate, requireExpert, getSubmissions);

// Détail d'une soumission (EXPERT+)
router.get('/:id', authenticate, requireExpert, getSubmissionDetail);

// Soumettre / modifier son vote (EXPERT+)
router.post('/:id/vote', authenticate, requireExpert, castVote);

// Retirer son vote (EXPERT+)
router.delete('/:id/vote', authenticate, requireExpert, removeVote);

// Remettre en SUBMITTED pour nouvelle révision (ADMIN uniquement)
router.patch('/:id/reset', authenticate, requireAdmin, resetSubmission);

module.exports = router;
