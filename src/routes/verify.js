const router = require('express').Router();
const { verifyBulletin } = require('../controllers/notesController');

// Route publique — aucune authentification requise
router.get('/:code', verifyBulletin);

module.exports = router;
