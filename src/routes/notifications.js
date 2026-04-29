const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

router.get('/', authenticate, getUserNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);

module.exports = router;
