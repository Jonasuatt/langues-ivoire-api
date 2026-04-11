const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getUserProgress, completeLesson, getUserBadges } = require('../controllers/progressController');

router.get('/me/progress', authenticate, getUserProgress);
router.post('/me/lessons/:id/complete', authenticate, completeLesson);
router.get('/me/badges', authenticate, getUserBadges);

module.exports = router;
