const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getMyCertificates, issueCertificate, getAllCertificates } = require('../controllers/certificateController');

router.get('/mine', authenticate, getMyCertificates);
router.get('/', authenticate, requireAdmin, getAllCertificates);
router.post('/', authenticate, requireAdmin, issueCertificate);

module.exports = router;
