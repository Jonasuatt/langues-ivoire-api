const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getTutors, getTutor, chatWithTutor, requestPronunciation } = require('../controllers/tutorController');

router.get('/', getTutors);
router.get('/:id', getTutor);
router.post('/:id/chat', authenticate, chatWithTutor);
router.post('/pronunciation/request', authenticate, requestPronunciation);

module.exports = router;
