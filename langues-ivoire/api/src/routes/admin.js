const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getUsers, updateUser, deleteUser } = require('../controllers/adminController');

router.use(authenticate, requireAdmin);

router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
