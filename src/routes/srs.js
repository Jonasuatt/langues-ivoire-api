const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getDue, review, getStats, addCard } = require('../controllers/srsController');

router.get('/due',    authenticate, getDue);
router.post('/review', authenticate, review);
router.get('/stats',  authenticate, getStats);
router.post('/cards', authenticate, addCard);

module.exports = router;
