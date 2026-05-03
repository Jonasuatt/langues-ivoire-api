const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer en mémoire (pas de fichier temporaire)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
  fileFilter: (req, file, cb) => {
    const allowedAudio = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav', 'audio/webm'];
    const allowedImage = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if ([...allowedAudio, ...allowedImage].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non supporté: ${file.mimetype}`), false);
    }
  },
});

// Helper : upload buffer vers Cloudinary
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    const readable = Readable.from(buffer);
    readable.pipe(stream);
  });
}

// ============================================================
// 1. Upload d'un fichier audio unique
// ============================================================
const uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier audio fourni' });

    const { entryId, langueCode, mot } = req.body;

    // Upload vers Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'video', // Cloudinary traite l'audio comme 'video'
      folder: `langues-ivoire/audio/${langueCode || 'general'}`,
      public_id: mot ? `${langueCode}_${mot.replace(/\s+/g, '_').toLowerCase()}` : undefined,
      format: 'mp3',
    });

    const audioUrl = result.secure_url;

    // Si entryId fourni, mettre à jour l'entrée du dictionnaire
    if (entryId) {
      await prisma.dictionaryEntry.update({
        where: { id: entryId },
        data: { audioUrl },
      });
    }

    res.json({
      success: true,
      audioUrl,
      publicId: result.public_id,
      duration: result.duration,
      size: result.bytes,
      entryId: entryId || null,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// 2. Upload d'une image
// ============================================================
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });

    const { entryId, langueCode, mot } = req.body;

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: `langues-ivoire/images/${langueCode || 'general'}`,
      public_id: mot ? `${langueCode}_${mot.replace(/\s+/g, '_').toLowerCase()}` : undefined,
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    });

    const imageUrl = result.secure_url;

    if (entryId) {
      await prisma.dictionaryEntry.update({
        where: { id: entryId },
        data: { imageUrl },
      });
    }

    res.json({
      success: true,
      imageUrl,
      publicId: result.public_id,
      size: result.bytes,
      entryId: entryId || null,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// 3. Import audio en lot (plusieurs fichiers d'un coup)
// ============================================================
const bulkUploadAudio = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { langueCode } = req.body;
    if (!langueCode) return res.status(400).json({ error: 'langueCode requis' });

    // Trouver la langue
    const language = await prisma.language.findFirst({
      where: { OR: [{ code: langueCode }, { id: langueCode }] },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Le nom du fichier = le mot (ex: akwaba.mp3 → mot "akwaba")
        const originalName = file.originalname;
        const motFromFile = originalName
          .replace(/\.[^/.]+$/, '') // retirer l'extension
          .replace(/[_-]/g, ' ')    // underscores/tirets → espaces
          .trim();

        // Upload vers Cloudinary
        const cloudResult = await uploadToCloudinary(file.buffer, {
          resource_type: 'video',
          folder: `langues-ivoire/audio/${langueCode}`,
          public_id: `${langueCode}_${motFromFile.replace(/\s+/g, '_').toLowerCase()}`,
          format: 'mp3',
        });

        // Chercher l'entrée correspondante dans le dictionnaire
        const entry = await prisma.dictionaryEntry.findFirst({
          where: {
            languageId: language.id,
            mot: { equals: motFromFile, mode: 'insensitive' },
          },
        });

        if (entry) {
          // Mettre à jour l'entrée avec l'URL audio
          await prisma.dictionaryEntry.update({
            where: { id: entry.id },
            data: { audioUrl: cloudResult.secure_url },
          });
          results.push({
            file: originalName,
            mot: motFromFile,
            status: 'linked',
            audioUrl: cloudResult.secure_url,
            entryId: entry.id,
          });
        } else {
          // Audio uploadé mais pas de mot correspondant trouvé
          results.push({
            file: originalName,
            mot: motFromFile,
            status: 'uploaded_no_match',
            audioUrl: cloudResult.secure_url,
            entryId: null,
          });
        }
      } catch (fileErr) {
        errors.push({
          file: file.originalname,
          error: fileErr.message,
        });
      }
    }

    const linked = results.filter(r => r.status === 'linked').length;
    const noMatch = results.filter(r => r.status === 'uploaded_no_match').length;

    res.json({
      success: true,
      summary: {
        total: req.files.length,
        linked,
        uploadedNoMatch: noMatch,
        errors: errors.length,
      },
      results,
      errors,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// 4. Import audio par mapping JSON
//    Body: { langueCode, mappings: [{ mot, audioFile }, ...] }
//    Permet d'associer explicitement un fichier à un mot
// ============================================================
const bulkUploadWithMapping = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { langueCode, mappings } = req.body;
    if (!langueCode) return res.status(400).json({ error: 'langueCode requis' });

    let parsedMappings = [];
    if (mappings) {
      try {
        parsedMappings = typeof mappings === 'string' ? JSON.parse(mappings) : mappings;
      } catch { /* ignore */ }
    }

    const language = await prisma.language.findFirst({
      where: { OR: [{ code: langueCode }, { id: langueCode }] },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    // Créer un index fichier → mot depuis le mapping
    const fileToMot = {};
    parsedMappings.forEach(m => {
      if (m.fichier && m.mot) fileToMot[m.fichier] = m.mot;
    });

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Mot = depuis le mapping, sinon depuis le nom du fichier
        const motFromMapping = fileToMot[file.originalname];
        const motFromFile = file.originalname.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim();
        const mot = motFromMapping || motFromFile;

        const cloudResult = await uploadToCloudinary(file.buffer, {
          resource_type: 'video',
          folder: `langues-ivoire/audio/${langueCode}`,
          public_id: `${langueCode}_${mot.replace(/\s+/g, '_').toLowerCase()}`,
          format: 'mp3',
        });

        const entry = await prisma.dictionaryEntry.findFirst({
          where: {
            languageId: language.id,
            mot: { equals: mot, mode: 'insensitive' },
          },
        });

        if (entry) {
          await prisma.dictionaryEntry.update({
            where: { id: entry.id },
            data: { audioUrl: cloudResult.secure_url },
          });
          results.push({ file: file.originalname, mot, status: 'linked', audioUrl: cloudResult.secure_url });
        } else {
          results.push({ file: file.originalname, mot, status: 'uploaded_no_match', audioUrl: cloudResult.secure_url });
        }
      } catch (fileErr) {
        errors.push({ file: file.originalname, error: fileErr.message });
      }
    }

    res.json({
      success: true,
      summary: {
        total: req.files.length,
        linked: results.filter(r => r.status === 'linked').length,
        uploadedNoMatch: results.filter(r => r.status === 'uploaded_no_match').length,
        errors: errors.length,
      },
      results,
      errors,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// 5. Upload image par un utilisateur (pour une contribution photo)
// ============================================================
const uploadContributeImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });

    const { langueCode, mot } = req.body;

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: `langues-ivoire/contributions/images/${langueCode || 'general'}`,
      public_id: mot
        ? `contrib_${langueCode}_${mot.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`
        : `contrib_${Date.now()}`,
      transformation: [{ width: 1024, height: 1024, crop: 'limit', quality: 'auto:good' }],
    });

    res.json({ success: true, imageUrl: result.secure_url });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// 6. Upload photo de profil utilisateur
// ============================================================
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });

    const userId = req.user.id;

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: 'langues-ivoire/profiles',
      public_id: `profile_${userId}`,
      overwrite: true,
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' }],
    });

    // Mettre à jour la photo dans la BDD directement
    await prisma.user.update({
      where: { id: userId },
      data: { photo: result.secure_url },
    });

    res.json({ success: true, imageUrl: result.secure_url });
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, uploadAudio, uploadImage, uploadContributeImage, uploadProfilePhoto, bulkUploadAudio, bulkUploadWithMapping };
