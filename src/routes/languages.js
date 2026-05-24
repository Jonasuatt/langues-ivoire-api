const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getLanguages, getLanguage, createLanguage, updateLanguage,
  getAllLanguagesAdmin, activateLanguage, initFromLanguage,
} = require('../controllers/languageController');

// IMPORTANT: routes statiques AVANT les routes dynamiques /:id
router.get('/admin/all', authenticate, requireEditor, getAllLanguagesAdmin);
router.patch('/:id/activate', authenticate, requireEditor, activateLanguage);
router.post('/:id/init-from/:sourceId', authenticate, requireEditor, initFromLanguage);

router.get('/', getLanguages);
router.get('/:id', getLanguage);
router.post('/', authenticate, requireEditor, createLanguage);
router.patch('/:id', authenticate, requireEditor, updateLanguage);

module.exports = router;
