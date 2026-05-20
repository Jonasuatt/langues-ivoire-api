const express = require('express');
const router = express.Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getPartenaires,
  getAllPartenairesAdmin,
  createPartenaire,
  updatePartenaire,
  togglePartenaire,
  deletePartenaire,
} = require('../controllers/partenaireController');

// Public
router.get('/', getPartenaires);

// Admin
router.get('/admin/all', authenticate, requireEditor, getAllPartenairesAdmin);
router.post('/', authenticate, requireEditor, createPartenaire);
router.patch('/:id', authenticate, requireEditor, updatePartenaire);
router.patch('/:id/toggle', authenticate, requireEditor, togglePartenaire);
router.delete('/:id', authenticate, requireEditor, deletePartenaire);

module.exports = router;
