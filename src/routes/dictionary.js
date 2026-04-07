const router = require('express').Router();
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');
const {
  getDictionary, searchDictionary, getDictionaryEntry,
  contributeWord, contributePhrase,
} = require('../controllers/dictionaryController');

router.get('/:langue', optionalAuth, getDictionary);
router.get('/search', optionalAuth, searchDictionary);
router.get('/entry/:id', getDictionaryEntry);
router.post('/contribute/word', authenticate, contributeWord);
router.post('/contribute/phrase', authenticate, contributePhrase);

module.exports = router;
