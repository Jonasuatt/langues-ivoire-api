const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  listTextContents,
  getPublicTextContents,
  getTextContent,
  createTextContent,
  updateTextContent,
  deleteTextContent,
} = require('../controllers/textContentController');

// ── Routes publiques (mobile) ──────────────────────────────────────────────
// GET /api/text-contents?langue=X&type=X&niveau=X&page=1&limit=15
router.get('/', getPublicTextContents);

// GET /api/text-contents/:id
router.get('/:id([0-9a-f-]{36})', getTextContent);

// ── Routes admin (CMS) ────────────────────────────────────────────────────
// GET /api/text-contents/admin/list?langue=X&type=X&status=X&page=1&limit=15
router.get('/admin/list', authenticate, requireEditor, listTextContents);

// POST /api/text-contents/admin
router.post('/admin', authenticate, requireEditor, createTextContent);

// PATCH /api/text-contents/admin/:id
router.patch('/admin/:id', authenticate, requireEditor, updateTextContent);

// DELETE /api/text-contents/admin/:id
router.delete('/admin/:id', authenticate, requireEditor, deleteTextContent);

module.exports = router;
