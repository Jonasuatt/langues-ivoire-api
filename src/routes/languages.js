const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getLanguages, getLanguage, createLanguage, updateLanguage,
  getAllLanguagesAdmin, activateLanguage,
} = require('../controllers/languageController');

// IMPORTANT: /admin/all must be declared BEFORE /:id to avoid being captured by the dynamic param
router.get('/admin/all', authenticate, requireEditor, getAllLanguagesAdmin);
router.patch('/:id/activate', authenticate, requireEditor, activateLanguage);

router.get('/', getLanguages);
router.get('/:id', getLanguage);
router.post('/', authenticate, requireEditor, createLanguage);
router.patch('/:id', authenticate, requireEditor, updateLanguage);

module.exports = router;
