const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { createMessage, getMyMessages, getAllMessages, replyMessage, updateStatus } = require('../controllers/supportController');

router.post('/', authenticate, createMessage);
router.get('/mine', authenticate, getMyMessages);
router.get('/', authenticate, requireAdmin, getAllMessages);
router.post('/:id/reply', authenticate, requireAdmin, replyMessage);
router.patch('/:id/status', authenticate, requireAdmin, updateStatus);

module.exports = router;
