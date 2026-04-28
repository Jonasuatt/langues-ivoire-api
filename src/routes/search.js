const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');
const { globalSearch } = require('../controllers/searchController');

// GET /api/search?q=bonjour&langue=baoule
router.get('/', optionalAuth, globalSearch);

module.exports = router;
