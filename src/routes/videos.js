const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { getVideos, getVideo, getCategories, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');

// Routes publiques (mobile)
router.get('/', getVideos);
router.get('/categories', getCategories);
router.get('/:id', getVideo);

// Routes admin/éditeur
router.post('/', authenticate, requireEditor, createVideo);
router.patch('/:id', authenticate, requireEditor, updateVideo);
router.delete('/:id', authenticate, requireEditor, deleteVideo);

module.exports = router;
