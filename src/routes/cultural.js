const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getTodayCultural, getCulturalItems, createCulturalItem } = require('../controllers/culturalController');

router.get('/today', getTodayCultural);
router.get('/', getCulturalItems);
router.post('/', authenticate, requireEditor, createCulturalItem);

module.exports = router;
