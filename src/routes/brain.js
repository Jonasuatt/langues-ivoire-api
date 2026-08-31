const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getOverview, listAnswers, toggleAnswer } = require('../controllers/brainController');

router.get('/overview', authenticate, requireEditor, getOverview);
router.get('/answers', authenticate, requireEditor, listAnswers);
router.patch('/answers/:id', authenticate, requireEditor, toggleAnswer);

module.exports = router;
