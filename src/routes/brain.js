const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getOverview } = require('../controllers/brainController');

router.get('/overview', authenticate, requireEditor, getOverview);

module.exports = router;
