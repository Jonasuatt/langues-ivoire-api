const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { tutorChatLimiter } = require('../middleware/aiLimiter');
const { getTutors, getTutor, chatWithTutor, requestPronunciation, createTutor, updateTutor, deleteTutor, getAllTutorsAdmin, activateTutor } = require('../controllers/tutorController');

router.get('/admin/all', authenticate, requireEditor, getAllTutorsAdmin);
router.patch('/:id/activate', authenticate, requireEditor, activateTutor);
router.get('/', getTutors);
router.get('/:id', getTutor);
router.post('/:id/chat', authenticate, tutorChatLimiter, chatWithTutor);
router.post('/pronunciation/request', authenticate, requestPronunciation);
router.post('/', authenticate, requireEditor, createTutor);
router.patch('/:id', authenticate, requireEditor, updateTutor);
router.delete('/:id', authenticate, requireEditor, deleteTutor);

module.exports = router;
