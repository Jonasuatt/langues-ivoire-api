const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getDashboard, getDailyActivity, getLanguageStats, getTopUsers } = require('../controllers/analyticsController');

router.get('/', authenticate, requireEditor, getDashboard);
router.get('/daily-activity', authenticate, requireEditor, getDailyActivity);
router.get('/languages', authenticate, requireEditor, getLanguageStats);
router.get('/top-users', authenticate, requireEditor, getTopUsers);

module.exports = router;
