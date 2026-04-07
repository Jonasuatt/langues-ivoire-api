const router = require('express').Router();
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');
const {
  getDictionary, searchDictionary, getDictionaryEntry,
  contributeWord, contributePhrase,
  adminCreateWord, adminUpdateWord, adminDeleteWord, generateAudio,
} = require('../controllers/dictionaryController');

router.get('/search', optionalAuth, searchDictionary);
router.get('/entry/:id', getDictionaryEntry);
router.get('/:langue', optionalAuth, getDictionary);
router.post('/contribute/word', authenticate, contributeWord);
router.post('/contribute/phrase', authenticate, contributePhrase);
router.post('/admin/word', authenticate, requireEditor, adminCreateWord);
router.patch('/admin/word/:id', authenticate, requireEditor, adminUpdateWord);
router.delete('/admin/word/:id', authenticate, requireEditor, adminDeleteWord);
router.post('/admin/generate-audio', authenticate, requireEditor, generateAudio);

module.exports = router;
