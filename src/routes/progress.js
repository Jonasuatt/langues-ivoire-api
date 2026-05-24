const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getUserProgress, completeLesson, getUserBadges, addXp } = require('../controllers/progressController');

router.get('/me/progress', authenticate, getUserProgress);
router.post('/me/lessons/:id/complete', authenticate, completeLesson);
router.get('/me/badges', authenticate, getUserBadges);
router.post('/me/xp', authenticate, addXp);

module.exports = router;
