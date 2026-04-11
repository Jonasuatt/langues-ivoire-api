const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getLanguages, getLanguage, createLanguage, updateLanguage,
} = require('../controllers/languageController');

router.get('/', getLanguages);
router.get('/:id', getLanguage);
router.post('/', authenticate, requireEditor, createLanguage);
router.patch('/:id', authenticate, requireEditor, updateLanguage);

module.exports = router;
