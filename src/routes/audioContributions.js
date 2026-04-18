const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  upload,
  createAudioContribution,
  getAudioContributions,
  getAudioStats,
  validateAudioContribution,
  deleteAudioContribution,
  getPracticeWords,
  savePracticeSession,
} = require('../controllers/audioContributionController');

// Routes publiques
router.get('/practice/:langCode', getPracticeWords);

// Routes authentifiées
router.get('/', authenticate, getAudioContributions);
router.post('/', authenticate, upload.single('audio'), createAudioContribution);
router.post('/practice/session', authenticate, savePracticeSession);

// Routes éditeur/admin
router.get('/stats', authenticate, requireEditor, getAudioStats);
router.patch('/:id/validate', authenticate, requireEditor, validateAudioContribution);
router.delete('/:id', authenticate, requireEditor, deleteAudioContribution);

module.exports = router;
