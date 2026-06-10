const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  recordNote,
  getCahierNotes,
  getBulletins,
  generateBulletin,
  generateBulletinBatch,
  validateBulletin,
  listBulletinsAdmin,
} = require('../controllers/notesController');

// ----- Admin (défini AVANT les routes paramétrées pour éviter le conflit /:languageId) -----
router.get('/admin/bulletins',                authenticate, requireAdmin, listBulletinsAdmin);
router.post('/admin/bulletin',                authenticate, requireAdmin, generateBulletin);
router.post('/admin/bulletins/batch',         authenticate, requireAdmin, generateBulletinBatch);
router.patch('/admin/bulletin/:id/validate',  authenticate, requireAdmin, validateBulletin);

// ----- Élève -----
router.post('/record',                        authenticate,              recordNote);
router.get('/:languageId/cahier',             authenticate,              getCahierNotes);
router.get('/:languageId/bulletins',          authenticate,              getBulletins);

module.exports = router;
