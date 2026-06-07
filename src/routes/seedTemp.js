/**
 * seedTemp.js — Route temporaire pour lancer le seed RÉPÉTO en production
 * ⚠️ À SUPPRIMER après usage !
 */

const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AUDIO_PLACEHOLDER = 'https://res.cloudinary.com/langues-ivoire/video/upload/v1/repetitor/demo_mot.mp3';

const DEMO_MOTS = [
  { langue: 'dioula', mot: 'tuma',   traduction: 'bonjour (le matin)',  emoji: '🌅', categorie: 'salutations', niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'ɛhɛ',   traduction: 'oui',                 emoji: '✅', categorie: 'general',     niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'ayi',   traduction: 'non',                 emoji: '❌', categorie: 'general',     niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'bɛnba', traduction: 'grand-père',          emoji: '👴', categorie: 'famille',     niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'ba',    traduction: 'mère',                emoji: '👩', categorie: 'famille',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'dioula', mot: 'fa',    traduction: 'père',                emoji: '👨', categorie: 'famille',     niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'wulu',  traduction: 'chien',               emoji: '🐕', categorie: 'animaux',     niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'sumu',  traduction: 'chat',                emoji: '🐱', categorie: 'animaux',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'dioula', mot: 'kelen', traduction: 'un (1)',              emoji: '1️⃣', categorie: 'chiffres',    niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'fila',  traduction: 'deux (2)',            emoji: '2️⃣', categorie: 'chiffres',    niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'saba',  traduction: 'trois (3)',           emoji: '3️⃣', categorie: 'chiffres',    niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'dioula', mot: 'jɔli',  traduction: 'sang / rouge',       emoji: '🔴', categorie: 'couleurs',    niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'baoule', mot: 'akwaba',traduction: 'bienvenue',           emoji: '🤝', categorie: 'salutations', niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'baoule', mot: 'yafu',  traduction: 'merci',               emoji: '🙏', categorie: 'salutations', niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'baoule', mot: 'anwe',  traduction: 'eau',                 emoji: '💧', categorie: 'nature',      niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'baoule', mot: 'ase',   traduction: 'arbre',               emoji: '🌳', categorie: 'nature',      niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'baoule', mot: "n'dja", traduction: 'manger',              emoji: '🍽️', categorie: 'general',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'baoule', mot: 'ba',    traduction: 'grand / beaucoup',    emoji: '🌟', categorie: 'general',     niveau: 'intermediaire', genreVoix: 'M' },
  { langue: 'baoule', mot: 'kɔkɔ',  traduction: 'poulet',              emoji: '🐔', categorie: 'animaux',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'baoule', mot: 'nan',   traduction: 'mère / femme',        emoji: '👩', categorie: 'famille',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'baoule', mot: "ow'e",  traduction: 'un (1)',              emoji: '1️⃣', categorie: 'chiffres',    niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'bete',   mot: 'lɔ',    traduction: 'bonjour',             emoji: '☀️', categorie: 'salutations', niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'bete',   mot: 'nɔn',   traduction: 'oui',                 emoji: '✅', categorie: 'general',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'bete',   mot: 'kuɔ',   traduction: 'eau',                 emoji: '💧', categorie: 'nature',      niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'bete',   mot: 'gblo',  traduction: 'parole / mot',        emoji: '💬', categorie: 'general',     niveau: 'intermediaire', genreVoix: 'M' },
  { langue: 'bete',   mot: 'su',    traduction: 'nuit',                emoji: '🌙', categorie: 'nature',      niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'bete',   mot: 'dɛ',    traduction: 'enfant',              emoji: '👶', categorie: 'famille',     niveau: 'debutant',     genreVoix: 'F' },
  { langue: 'bete',   mot: 'pɛ',    traduction: 'un (1)',              emoji: '1️⃣', categorie: 'chiffres',    niveau: 'debutant',     genreVoix: 'M' },
  { langue: 'bete',   mot: 'yiri',  traduction: 'arbre / bois',        emoji: '🪵', categorie: 'nature',      niveau: 'debutant',     genreVoix: 'M' },
];

router.post('/run', async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.JWT_SECRET?.slice(0, 16)) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }

  try {
    const languages = await prisma.language.findMany({ where: { isActive: true } });
    const langMap = {};
    languages.forEach(l => { langMap[l.code] = l; });

    let created = 0, skipped = 0;
    const log = [];

    for (const item of DEMO_MOTS) {
      const lang = langMap[item.langue];
      if (!lang) { skipped++; log.push(`⚠️ Langue "${item.langue}" introuvable`); continue; }

      const existing = await prisma.repetitorMot.findFirst({
        where: { languageId: lang.id, mot: item.mot },
      });
      if (existing) { skipped++; log.push(`⏭️ "${item.mot}" (${lang.nom}) existe déjà`); continue; }

      await prisma.repetitorMot.create({
        data: {
          languageId: lang.id, languageNom: lang.nom,
          mot: item.mot, traduction: item.traduction,
          audioUrl: AUDIO_PLACEHOLDER,
          genreVoix: item.genreVoix, emoji: item.emoji,
          categorie: item.categorie, niveau: item.niveau,
          ordre: created, actif: true,
        },
      });
      log.push(`✅ "${item.mot}" (${lang.nom})`);
      created++;
    }

    // Sessions démo
    const motsActifs = await prisma.repetitorMot.findMany({ where: { actif: true }, take: 8 });
    const AGE_GROUPES = ['MOINS5', '5_8', '9_12', 'ADULTE'];
    const STATUTS     = ['BRUT', 'BRUT', 'BRUT', 'SOUMIS_ILA'];
    let sessionCount  = 0;

    for (const mot of motsActifs) {
      for (let i = 0; i < 3; i++) {
        await prisma.repetitorSession.create({
          data: {
            repetitorMotId: mot.id, languageId: mot.languageId, languageNom: mot.languageNom,
            motCible: mot.mot, traduction: mot.traduction,
            audioNatifUrl: mot.audioUrl, audioEnfantUrl: AUDIO_PLACEHOLDER,
            dureeMs: Math.floor(Math.random() * 3000) + 800,
            ageGroupe: AGE_GROUPES[Math.floor(Math.random() * AGE_GROUPES.length)],
            statut:   STATUTS[Math.floor(Math.random() * STATUTS.length)],
            deviceId: `demo-device-${Math.floor(Math.random() * 50) + 1}`,
          },
        });
        sessionCount++;
      }
    }

    res.json({ success: true, created, skipped, sessions: sessionCount, log });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
