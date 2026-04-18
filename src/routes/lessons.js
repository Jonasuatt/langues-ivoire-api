const router = require('express').Router();
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');
const {
  getLessonsByLanguage, getLesson, submitExercise,
  createLesson, updateLesson, deleteLesson,
  createStep, updateStep, deleteStep,
  createExercise, updateExercise, deleteExercise,
} = require('../controllers/lessonController');

router.get('/language/:langue', optionalAuth, getLessonsByLanguage);
router.get('/:id/steps', optionalAuth, getLesson);
router.post('/exercises/:id/submit', authenticate, submitExercise);
router.post('/', authenticate, requireEditor, createLesson);
router.patch('/:id', authenticate, requireEditor, updateLesson);
router.delete('/:id', authenticate, requireEditor, deleteLesson);

// Steps CRUD
router.post('/:lessonId/steps', authenticate, requireEditor, createStep);
router.patch('/steps/:stepId', authenticate, requireEditor, updateStep);
router.delete('/steps/:stepId', authenticate, requireEditor, deleteStep);

// Exercises CRUD
router.post('/steps/:stepId/exercises', authenticate, requireEditor, createExercise);
router.patch('/exercises/:exerciseId', authenticate, requireEditor, updateExercise);
router.delete('/exercises/:exerciseId', authenticate, requireEditor, deleteExercise);

module.exports = router;
