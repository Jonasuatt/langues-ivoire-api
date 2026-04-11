const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getContributions, moderateContribution } = require('../controllers/contributionController');

router.get('/', authenticate, requireEditor, getContributions);
router.patch('/:id/moderate', authenticate, requireEditor, moderateContribution);

module.exports = router;
