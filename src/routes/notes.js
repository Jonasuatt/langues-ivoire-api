const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  recordNote,
  getCahierNotes,
  getBulletins,
  generateBulletin,
  validateBulletin,
  listBulletinsAdmin,
} = require('../controllers/notesController');

// ----- Élève -----
router.post('/record',                        authenticate,              recordNote);
router.get('/:languageId/cahier',             authenticate,              getCahierNotes);
router.get('/:languageId/bulletins',          authenticate,              getBulletins);

// ----- Admin -----
router.get('/admin/bulletins',                authenticate, requireAdmin, listBulletinsAdmin);
router.post('/admin/bulletin',                authenticate, requireAdmin, generateBulletin);
router.patch('/admin/bulletin/:id/validate',  authenticate, requireAdmin, validateBulletin);

module.exports = router;
