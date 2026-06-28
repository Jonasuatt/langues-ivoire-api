const router = require('express').Router();
const { verifyBulletin }      = require('../controllers/notesController');
const { verifyCursusCert }    = require('../controllers/cursusCertificateController');

// Routes publiques — aucune authentification requise
router.get('/cursus/:code', verifyCursusCert);
router.get('/:code',        verifyBulletin);

module.exports = router;
