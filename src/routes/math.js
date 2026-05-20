const express = require('express');
const router = express.Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getMathContenus,
  getAllMathAdmin,
  createMathContenu,
  updateMathContenu,
  toggleMathContenu,
  deleteMathContenu,
} = require('../controllers/mathController');

// Public
router.get('/', getMathContenus);

// Admin
router.get('/admin/all', authenticate, requireEditor, getAllMathAdmin);
router.post('/', authenticate, requireEditor, createMathContenu);
router.patch('/:id', authenticate, requireEditor, updateMathContenu);
router.patch('/:id/toggle', authenticate, requireEditor, toggleMathContenu);
router.delete('/:id', authenticate, requireEditor, deleteMathContenu);

module.exports = router;
