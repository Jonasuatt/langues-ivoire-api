const router = require('express').Router();
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const {
  getGrades, getModules,
  getPlacementTest, submitPlacementTest,
  getMyEnrollments, getEnrollmentDetail, checkProgression,
  updateGrade, updateModule, assignLessonGrade, getStats,
  listPlacementQuestions, createPlacementQuestion, updatePlacementQuestion, deletePlacementQuestion,
  seedCurriculum,
} = require('../controllers/curriculumController');

// ----- Référentiel (élève) -----
router.get('/grades', optionalAuth, getGrades);
router.get('/modules', optionalAuth, getModules);

// ----- Test de positionnement -----
router.get('/placement/:languageId', authenticate, getPlacementTest);
router.post('/placement/:languageId', authenticate, submitPlacementTest);

// ----- Mes cursus -----
router.get('/enrollments', authenticate, getMyEnrollments);
router.get('/enrollments/:languageId', authenticate, getEnrollmentDetail);
router.post('/enrollments/:languageId/check-progression', authenticate, checkProgression);

// ----- Administration (CMS) -----
router.put('/admin/grades/:id', authenticate, requireAdmin, updateGrade);
router.put('/admin/modules/:id', authenticate, requireAdmin, updateModule);
router.put('/admin/lessons/:id/grade', authenticate, requireAdmin, assignLessonGrade);
router.get('/admin/stats', authenticate, requireAdmin, getStats);
router.get('/admin/placement-questions', authenticate, requireAdmin, listPlacementQuestions);
router.post('/admin/placement-questions', authenticate, requireAdmin, createPlacementQuestion);
router.put('/admin/placement-questions/:id', authenticate, requireAdmin, updatePlacementQuestion);
router.delete('/admin/placement-questions/:id', authenticate, requireAdmin, deletePlacementQuestion);
router.post('/admin/seed', authenticate, requireAdmin, seedCurriculum);

module.exports = router;
