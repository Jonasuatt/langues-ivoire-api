/**
 * Routes — Prononciation & Traducteur IA (Phase 6)
 */
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const { authenticate } = require('../middleware/auth');
const { evaluate, translate, transcribe } = require('../controllers/pronunciationController');

const router = express.Router();

// Multer : stockage temporaire en mémoire/tmp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const os = require('os');
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.m4a';
    cb(null, `pronunciation_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    // Accepte audio/* et video/* (iOS enregistre parfois en mp4)
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Format audio requis'));
    }
  },
});

/**
 * POST /api/pronunciation/evaluate
 * Body (multipart/form-data) :
 *   - audio        : fichier audio (m4a, wav, mp3, webm)
 *   - targetWord   : mot cible (ex: "Akwaba")
 *   - phonetique   : transcription phonétique (ex: "[akwaba]")
 *   - languageName : nom de la langue (ex: "Baoulé")
 */
router.post('/evaluate', authenticate, upload.single('audio'), evaluate);

/**
 * POST /api/pronunciation/translate
 * Body (JSON) :
 *   - text         : texte à traduire
 *   - fromLang     : langue source (ex: "français" ou "Baoulé")
 *   - toLang       : langue cible (ex: "Baoulé" ou "français")
 */
router.post('/translate', authenticate, translate);

/**
 * POST /api/pronunciation/transcribe
 * Mode Perroquet — transcription rapide sans scoring
 * Body: audio (multipart/form-data)
 * Returns: { transcript: string | null }
 */
router.post('/transcribe', authenticate, upload.single('audio'), transcribe);

module.exports = router;
