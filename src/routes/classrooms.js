const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const {
  createClassroom, myClassrooms, getClassroom,
  joinClassroom, joinedClassrooms, removeMember, updateClassroom,
} = require('../controllers/classroomController');

router.post('/',        authenticate, createClassroom);
router.get('/mine',     authenticate, myClassrooms);
router.get('/joined',   authenticate, joinedClassrooms);
router.post('/join',    authenticate, joinClassroom);
router.get('/:id',      authenticate, getClassroom);
router.patch('/:id',    authenticate, updateClassroom);
router.delete('/:id/members/:userId', authenticate, removeMember);

module.exports = router;
