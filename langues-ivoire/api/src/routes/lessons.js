const router = require('express').Router();
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');
const {
  getLessonsByLanguage, getLesson, submitExercise,
  createLesson, updateLesson, deleteLesson,
} = require('../controllers/lessonController');

router.get('/language/:langue', optionalAuth, getLessonsByLanguage);
router.get('/:id/steps', optionalAuth, getLesson);
router.post('/exercises/:id/submit', authenticate, submitExercise);
router.post('/', authenticate, requireEditor, createLesson);
router.patch('/:id', authenticate, requireEditor, updateLesson);
router.delete('/:id', authenticate, requireEditor, deleteLesson);

module.exports = router;
