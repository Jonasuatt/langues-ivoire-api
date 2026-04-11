const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getDashboard } = require('../controllers/analyticsController');

router.get('/', authenticate, requireEditor, getDashboard);

module.exports = router;
