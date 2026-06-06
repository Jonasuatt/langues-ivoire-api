/**
 * depenses.js — Routes CRUD pour le rapport de dépenses
 * Toutes les routes nécessitent une authentification ADMIN
 */
const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const {
  getDepenses,
  getResumeDepenses,
  createDepense,
  updateDepense,
  deleteDepense,
} = require('../controllers/depenseController');

// Upload mémoire pour pièces jointes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
                     'image/gif', 'application/msword',
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Type de fichier non autorisé (PDF, images, Word uniquement)'));
  },
});

// ─── Upload pièce jointe vers Cloudinary ─────────────────────────────────────
router.post('/upload-pj', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });

    const isPdf = req.file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'langues-ivoire/depenses',
          resource_type: resourceType,
          public_id: `pj_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`,
        },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url:  result.secure_url,
      nom:  req.file.originalname,
      type: isPdf ? 'pdf' : 'image',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur upload pièce jointe' });
  }
});

// ─── CRUD dépenses ────────────────────────────────────────────────────────────
router.get('/resume', authenticate, requireAdmin, getResumeDepenses);
router.get('/',       authenticate, requireAdmin, getDepenses);
router.post('/',      authenticate, requireAdmin, createDepense);
router.patch('/:id',  authenticate, requireAdmin, updateDepense);
router.delete('/:id', authenticate, requireAdmin, deleteDepense);

module.exports = router;
