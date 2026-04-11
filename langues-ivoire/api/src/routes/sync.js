const router = require('express').Router();
const { fullSync } = require('../controllers/syncController');

router.get('/', fullSync);

module.exports = router;
