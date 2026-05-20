const express = require('express');
const router = express.Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const {
  getMonnaieContenus,
  getAllMonnaieAdmin,
  createMonnaieContenu,
  updateMonnaieContenu,
  toggleMonnaieContenu,
  deleteMonnaieContenu,
} = require('../controllers/monnaieController');

// Public
router.get('/', getMonnaieContenus);

// Admin
router.get('/admin/all', authenticate, requireEditor, getAllMonnaieAdmin);
router.post('/', authenticate, requireEditor, createMonnaieContenu);
router.patch('/:id', authenticate, requireEditor, updateMonnaieContenu);
router.patch('/:id/toggle', authenticate, requireEditor, toggleMonnaieContenu);
router.delete('/:id', authenticate, requireEditor, deleteMonnaieContenu);

module.exports = router;
