const router = require('express').Router();
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const {
  getGrades, getModules,
  getPlacementTest, submitPlacementTest,
  getMyEnrollments, getEnrollmentDetail, checkProgression,
  updateGrade, updateModule, assignLessonGrade, getStats,
  listPlacementQuestions, createPlacementQuestion, updatePlacementQuestion, deletePlacementQuestion,
  seedCurriculum,
  listEnrollmentsAdmin,
  seedContent,
  resetContent,
  // Phase B
  submitExam, getExamStatus, listExams, reviewExam, takeExam,
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

// ----- Phase B : Examens charnières (élève) -----
router.post('/enrollments/:languageId/submit-exam', authenticate, submitExam);
router.get('/enrollments/:languageId/exam-status', authenticate, getExamStatus);

// ----- Administration (CMS) -----
router.put('/admin/grades/:id', authenticate, requireAdmin, updateGrade);
router.put('/admin/modules/:id', authenticate, requireAdmin, updateModule);
router.put('/admin/lessons/:id/grade', authenticate, requireAdmin, assignLessonGrade);
router.get('/admin/stats', authenticate, requireAdmin, getStats);
router.get('/admin/enrollments',      authenticate, requireAdmin, listEnrollmentsAdmin);
router.post('/admin/seed-content',    authenticate, requireAdmin, seedContent);
router.post('/admin/reset-content',   authenticate, requireAdmin, resetContent);
router.get('/admin/placement-questions', authenticate, requireAdmin, listPlacementQuestions);
router.post('/admin/placement-questions', authenticate, requireAdmin, createPlacementQuestion);
router.put('/admin/placement-questions/:id', authenticate, requireAdmin, updatePlacementQuestion);
router.delete('/admin/placement-questions/:id', authenticate, requireAdmin, deletePlacementQuestion);
router.post('/admin/seed', authenticate, requireAdmin, seedCurriculum);

// ----- Phase B : Examens (comité d'experts) -----
router.get('/admin/exams', authenticate, requireAdmin, listExams);
router.patch('/admin/exams/:id/take', authenticate, requireAdmin, takeExam);
router.post('/admin/exams/:id/review', authenticate, requireAdmin, reviewExam);

// ----- Phase D3 : Certificats de fin de cycle -----
const {
  getMesCertificats, listCertificatsAdmin, getCertificatHtml,
} = require('../controllers/cursusCertificateController');
router.get('/mes-certificats-cursus',           authenticate,              getMesCertificats);
router.get('/admin/certificats-cursus',         authenticate, requireAdmin, listCertificatsAdmin);
router.get('/certificat-cursus/:id/html',       authenticate,              getCertificatHtml);

// ----- Phase D2 : Parcours Chercheur -----
const {
  getDashboardChercheur, listObjectifs, createObjectif, updateObjectif, deleteObjectif,
} = require('../controllers/chercheurController');
router.get('/chercheur/:languageId/dashboard',    authenticate,              getDashboardChercheur);
router.get('/admin/objectifs-chercheur',          authenticate, requireAdmin, listObjectifs);
router.post('/admin/objectifs-chercheur',         authenticate, requireAdmin, createObjectif);
router.put('/admin/objectifs-chercheur/:id',      authenticate, requireAdmin, updateObjectif);
router.delete('/admin/objectifs-chercheur/:id',   authenticate, requireAdmin, deleteObjectif);

// ----- Phase D1 : Filières Métiers -----
const {
  listFilieres, choisirFiliere, listFilieresAdmin, createFiliere, updateFiliere,
} = require('../controllers/filieresController');
router.get('/filieres',                   listFilieres);                                      // public
router.post('/enrollments/:languageId/choisir-filiere', authenticate, choisirFiliere);        // élève
router.get('/admin/filieres',             authenticate, requireAdmin, listFilieresAdmin);
router.post('/admin/filieres',            authenticate, requireAdmin, createFiliere);
router.put('/admin/filieres/:id',         authenticate, requireAdmin, updateFiliere);

module.exports = router;
