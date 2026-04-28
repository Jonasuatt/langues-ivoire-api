const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  upload,
  createAudioContribution,
  bulkImportAudio,
  getAudioContributions,
  getAudioStats,
  updateAudioContribution,
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
router.post('/bulk-import', authenticate, requireEditor, upload.array('audios', 50), bulkImportAudio);
router.patch('/:id', authenticate, requireEditor, updateAudioContribution);
router.patch('/:id/validate', authenticate, requireEditor, validateAudioContribution);
router.delete('/:id', authenticate, requireEditor, deleteAudioContribution);

module.exports = router;
