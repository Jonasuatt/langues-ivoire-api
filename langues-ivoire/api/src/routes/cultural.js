const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getTodayCultural, getCulturalItems, createCulturalItem, updateCulturalItem, deleteCulturalItem } = require('../controllers/culturalController');

router.get('/today', getTodayCultural);
router.get('/', getCulturalItems);
router.post('/', authenticate, requireEditor, createCulturalItem);
router.patch('/:id', authenticate, requireEditor, updateCulturalItem);
router.delete('/:id', authenticate, requireEditor, deleteCulturalItem);

module.exports = router;
