/**
 * generate-audio-bulk.js
 *
 * Pré-génère l'audio TTS pour toutes les entrées du dictionnaire
 * sans audioUrl, upload sur Cloudinary, et met à jour la DB.
 *
 * Pré-requis :
 *   1. AI service démarré : cd ai && python -m uvicorn main:app --port 8000
 *   2. .env avec CLOUDINARY_* et DATABASE_URL
 *
 * Usage :
 *   node scripts/generate-audio-bulk.js
 *   node scripts/generate-audio-bulk.js --lang baoule    (une seule langue)
 *   node scripts/generate-audio-bulk.js --limit 20       (seulement 20 entrées)
 *   node scripts/generate-audio-bulk.js --dry-run        (simulation, rien écrit)
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

const prisma = new PrismaClient();

// ─── Config Cloudinary ───────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Config TTS ──────────────────────────────────────────────────────────────
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const CONCURRENCY = 3;    // appels TTS parallèles max
const DELAY_MS    = 300;  // délai entre batches (ms)

// ─── Utilitaires ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { lang: null, limit: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang')    opts.lang    = args[++i];
    if (args[i] === '--limit')   opts.limit   = parseInt(args[++i]);
    if (args[i] === '--dry-run') opts.dryRun  = true;
  }
  return opts;
}

// ─── Synthèse TTS via le service IA local ────────────────────────────────────
async function synthesizeTTS(text, langCode) {
  const res = await fetch(`${AI_URL}/tts/synthesize`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text, languageCode: langCode, speed: 1.0 }),
    signal:  AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  if (buf.byteLength < 500) throw new Error('Audio trop court (probablement vide)');
  return Buffer.from(buf);
}

// ─── Upload MP3 sur Cloudinary ────────────────────────────────────────────────
async function uploadToCloudinary(audioBuffer, entryId, langCode, mot) {
  // Sanitize le mot pour le public_id
  const safeMot = mot.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '-').substring(0, 40);
  const publicId = `langues-ivoire/audio/${langCode}/${entryId}_${safeMot}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',   // Cloudinary gère l'audio dans "video"
        public_id:     publicId,
        format:        'mp3',
        overwrite:     true,
        folder:        `langues-ivoire/audio/${langCode}`,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    stream.end(audioBuffer);
  });
}

// ─── Traitement d'une entrée ──────────────────────────────────────────────────
async function processEntry(entry, langCode, opts) {
  const text = entry.mot;
  const label = `[${langCode}] "${text}"`;

  try {
    if (opts.dryRun) {
      console.log(`  ✓ DRY-RUN ${label}`);
      return { ok: true };
    }

    const audioBuffer = await synthesizeTTS(text, langCode);
    const audioUrl    = await uploadToCloudinary(audioBuffer, entry.id, langCode, text);

    await prisma.dictionaryEntry.update({
      where: { id: entry.id },
      data:  { audioUrl },
    });

    console.log(`  ✅ ${label} → ${audioUrl.split('/').slice(-2).join('/')}`);
    return { ok: true };
  } catch (err) {
    console.error(`  ❌ ${label} : ${err.message}`);
    return { ok: false, error: err.message };
  }
}

// ─── Traitement en batches ────────────────────────────────────────────────────
async function processBatch(entries, langCode, opts) {
  const results = [];
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(e => processEntry(e, langCode, opts))
    );
    results.push(...batchResults);
    if (i + CONCURRENCY < entries.length) await sleep(DELAY_MS);
  }
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs();

  console.log('🎙️  Langues Ivoire — Génération audio en masse');
  console.log('━'.repeat(50));
  if (opts.dryRun) console.log('⚠️  MODE DRY-RUN — aucune modification en base\n');

  // Vérifier que le service IA est disponible
  try {
    const health = await fetch(`${AI_URL}/health`, { signal: AbortSignal.timeout(5000) });
    if (!health.ok) throw new Error();
    console.log(`✅ Service IA disponible sur ${AI_URL}\n`);
  } catch {
    console.error(`❌ Service IA inaccessible sur ${AI_URL}`);
    console.error('   Lance : cd ai && python -m uvicorn main:app --port 8000\n');
    process.exit(1);
  }

  // Récupérer les langues
  const langFilter = opts.lang ? { code: opts.lang } : {};
  const languages = await prisma.language.findMany({ where: langFilter, orderBy: { ordreAffichage: 'asc' } });

  if (languages.length === 0) {
    console.error(`❌ Langue "${opts.lang}" introuvable`);
    process.exit(1);
  }

  let grandTotal = 0, grandOk = 0, grandErr = 0;

  for (const lang of languages) {
    // Entrées sans audioUrl
    const whereClause = { languageId: lang.id, audioUrl: null };
    const total = await prisma.dictionaryEntry.count({ where: whereClause });

    if (total === 0) {
      console.log(`⏭️  ${lang.code.toUpperCase()} — déjà couvert (0 entrée manquante)`);
      continue;
    }

    const entries = await prisma.dictionaryEntry.findMany({
      where:   whereClause,
      orderBy: { mot: 'asc' },
      take:    opts.limit || undefined,
    });

    console.log(`\n🌍 ${lang.nom} (${lang.code}) — ${entries.length} entrées à traiter`);

    const results = await processBatch(entries, lang.code, opts);
    const ok  = results.filter(r => r.ok).length;
    const err = results.filter(r => !r.ok).length;

    console.log(`   → ${ok} réussis, ${err} erreurs`);
    grandTotal += entries.length;
    grandOk   += ok;
    grandErr  += err;
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`🏁 Terminé — ${grandOk}/${grandTotal} audios générés (${grandErr} erreurs)`);
  if (grandErr > 0) console.log('   Relancez le script pour réessayer les erreurs.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
