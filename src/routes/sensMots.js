const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getAllSensMots,
  getSensMot,
  createSensMot,
  updateSensMot,
  deleteSensMot,
} = require('../controllers/sensMotsController');

// GET /api/sens-mots?languageId=X&status=X&page=1&limit=20&search=X
router.get('/', getAllSensMots);

// GET /api/sens-mots/:id
router.get('/:id', getSensMot);

// POST /api/sens-mots
router.post('/', authenticate, requireEditor, createSensMot);

// PATCH /api/sens-mots/:id
router.patch('/:id', authenticate, requireEditor, updateSensMot);

// DELETE /api/sens-mots/:id
router.delete('/:id', authenticate, requireEditor, deleteSensMot);

module.exports = router;
