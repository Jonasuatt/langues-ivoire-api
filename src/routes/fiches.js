const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  listFiches,
  getFiche,
  createFiche,
  updateFiche,
  togglePublish,
  deleteFiche,
} = require('../controllers/fichesController');

// ----- Élève / public (authentifié) -----
router.get('/',    authenticate, listFiches);
router.get('/:id', authenticate, getFiche);

// ----- Admin -----
router.post('/',              authenticate, requireAdmin, createFiche);
router.put('/:id',            authenticate, requireAdmin, updateFiche);
router.patch('/:id/publish',  authenticate, requireAdmin, togglePublish);
router.delete('/:id',         authenticate, requireAdmin, deleteFiche);

module.exports = router;
