const router = require('express').Router();
const { authenticate, requireEditor } = require('../middleware/auth');
const { upload, uploadAudio, uploadImage, uploadContributeImage, uploadProfilePhoto, bulkUploadAudio, bulkUploadWithMapping } = require('../controllers/uploadController');

// Upload audio unique
router.post('/audio', authenticate, requireEditor, upload.single('audio'), uploadAudio);

// Upload image unique (éditeurs)
router.post('/image', authenticate, requireEditor, upload.single('image'), uploadImage);

// Upload image pour contribution utilisateur (utilisateurs authentifiés)
router.post('/contribute-image', authenticate, upload.single('image'), uploadContributeImage);

// Upload photo de profil (utilisateurs authentifiés)
router.post('/profile-photo', authenticate, upload.single('image'), uploadProfilePhoto);

// Import audio en lot (fichiers nommés comme les mots)
router.post('/audio/bulk', authenticate, requireEditor, upload.array('audios', 50), bulkUploadAudio);

// Import audio en lot avec mapping JSON explicite
router.post('/audio/bulk-mapping', authenticate, requireEditor, upload.array('audios', 50), bulkUploadWithMapping);

module.exports = router;
