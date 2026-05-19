/**
 * seed-audio-fr.js
 * Génère un audio FRANÇAIS pour chaque entrée de :
 *   - Textes & Récits   → traduction
 *   - Premiers Secours  → traduction (ou consigne si pas de traduction)
 *   - Civisme           → traduction (ou contenu si langue = fr)
 *   - Phrases Utiles    → traduction
 *
 * Processus : TTS français → Cloudinary → PATCH audioUrlFr
 */

const https = require('https');
const crypto = require('crypto');

const API_HOST   = 'api-production-7107f.up.railway.app';
const AI_HOST    = 'langues-ivoire-ai-production.up.railway.app';
const CLOUD_NAME = 'dbgcyk57a';
const CLOUD_KEY  = '998577366383524';
const CLOUD_SEC  = 'NAToVFaJZRuG6hR87ApJOlRzUMg';

// ─── Helpers HTTP ─────────────────────────────────────────────────────────────

function httpReq(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        buffer: Buffer.concat(chunks),
      }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function apiJson(options, body) {
  return httpReq(options, body).then(r => ({
    status: r.status,
    body: (() => { try { return JSON.parse(r.buffer.toString()); } catch { return r.buffer.toString(); } })(),
  }));
}

// ─── Cloudinary multipart upload ──────────────────────────────────────────────

function cloudinaryUpload(audioBuffer, filename) {
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder    = 'langues-ivoire/audio-fr';
    const paramStr  = `folder=${folder}&public_id=${filename}&timestamp=${timestamp}`;
    const signature = crypto.createHash('sha1').update(paramStr + CLOUD_SEC).digest('hex');

    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    const parts = [
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n`,
      audioBuffer,
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${CLOUD_KEY}`,
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}`,
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}`,
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\n${folder}`,
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\n${filename}`,
      `\r\n--${boundary}--\r\n`,
    ];
    const body = Buffer.concat(parts.map(p => Buffer.isBuffer(p) ? p : Buffer.from(p)));

    const req = https.request({
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/raw/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Cloudinary parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── TTS Français ─────────────────────────────────────────────────────────────

async function generateFrAudio(text) {
  const body = JSON.stringify({ text, languageCode: 'french', speed: 0.95 });
  const res = await httpReq({
    hostname: AI_HOST,
    path: '/tts/synthesize',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  }, body);
  if (res.status !== 200 || res.buffer.length < 500) {
    throw new Error(`TTS fr status ${res.status}, size ${res.buffer.length}`);
  }
  return res.buffer;
}

// ─── Authentification ─────────────────────────────────────────────────────────

async function authenticate() {
  const body = JSON.stringify({ email: 'admin@languesivoire.ci', motDePasse: 'Admin@2026!' });
  const res = await apiJson({
    hostname: API_HOST, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  }, body);
  if (!res.body.accessToken) throw new Error('Auth failed');
  return res.body.accessToken;
}

// ─── Traiter un item générique ─────────────────────────────────────────────────

async function processItem({ label, id, text, slug, patchPath, token }) {
  if (!text || text.trim().length < 5) {
    console.log(`  ⏩ ${label} — pas de texte français`);
    return false;
  }

  const frText = text.slice(0, 400);
  const filename = `fr_${slug}_${id.slice(0, 8)}`;

  try {
    const audioBuffer = await generateFrAudio(frText);
    const cloudRes = await cloudinaryUpload(audioBuffer, filename);
    if (!cloudRes.secure_url) throw new Error('Cloudinary: ' + JSON.stringify(cloudRes).slice(0, 100));

    const patchBody = JSON.stringify({ audioUrlFr: cloudRes.secure_url });
    const patchRes = await apiJson({
      hostname: API_HOST,
      path: patchPath,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(patchBody),
        Authorization: `Bearer ${token}`,
      },
    }, patchBody);

    if (patchRes.status !== 200 && patchRes.status !== 201) {
      throw new Error(`PATCH ${patchRes.status}: ${JSON.stringify(patchRes.body).slice(0, 100)}`);
    }

    console.log(`  ✅ ${label} — ${Math.round(audioBuffer.length / 1024)}ko`);
    return true;
  } catch (err) {
    console.log(`  ❌ ${label} — ${err.message}`);
    return false;
  }
}

// ─── Slugify ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 40);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔐 Authentification...');
  const token = await authenticate();
  console.log('✅ Connecté\n');

  let ok = 0, skip = 0, fail = 0;

  // ── 1. Textes & Récits ─────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════');
  console.log('📖 TEXTES & RÉCITS');
  const textRes = await apiJson({
    hostname: API_HOST,
    path: '/api/text-contents/admin/list?page=1&limit=100',
    headers: { Authorization: `Bearer ${token}` },
  });
  const textes = textRes.body.data || [];
  const textesSansAudioFr = textes.filter(t => !t.audioUrlFr);
  console.log(`   ${textes.length} texte(s), ${textesSansAudioFr.length} sans audioUrlFr\n`);

  for (const t of textesSansAudioFr) {
    const text = (t.traduction || '').trim() || (t.resume || '').trim();
    const res = await processItem({
      label: t.titre.slice(0, 50),
      id: t.id,
      text,
      slug: slugify(t.titre),
      patchPath: `/api/text-contents/admin/${t.id}`,
      token,
    });
    if (res) ok++; else if (!text || text.length < 5) skip++; else fail++;
    await new Promise(r => setTimeout(r, 700));
  }

  // ── 2. Premiers Secours ────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  console.log('🚑 PREMIERS SECOURS');
  const psRes = await apiJson({
    hostname: API_HOST,
    path: '/api/premiers-secours?limit=200',
    headers: { Authorization: `Bearer ${token}` },
  });
  const phrases = psRes.body.data || [];
  const phrasesSans = phrases.filter(p => !p.audioUrlFr);
  console.log(`   ${phrases.length} phrase(s), ${phrasesSans.length} sans audioUrlFr\n`);

  for (const p of phrasesSans) {
    const text = (p.traduction || p.consigne || '').trim();
    const res = await processItem({
      label: p.consigne.slice(0, 50),
      id: p.id,
      text,
      slug: slugify(p.situation + '_' + p.consigne),
      patchPath: `/api/premiers-secours/${p.id}`,
      token,
    });
    if (res) ok++; else if (!text || text.length < 5) skip++; else fail++;
    await new Promise(r => setTimeout(r, 700));
  }

  // ── 3. Civisme ─────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  console.log('🏛️  CIVISME');
  const civRes = await apiJson({
    hostname: API_HOST,
    path: '/api/civisme?limit=200',
    headers: { Authorization: `Bearer ${token}` },
  });
  const civItems = civRes.body.data || [];
  const civSans = civItems.filter(c => !c.audioUrlFr);
  console.log(`   ${civItems.length} élément(s), ${civSans.length} sans audioUrlFr\n`);

  for (const c of civSans) {
    // Si pas de traduction, le contenu est déjà en français (type symbole_etat, etc.)
    const text = (c.traduction || c.contenu || '').trim();
    const res = await processItem({
      label: c.titre.slice(0, 50),
      id: c.id,
      text,
      slug: slugify(c.titre),
      patchPath: `/api/civisme/${c.id}`,
      token,
    });
    if (res) ok++; else if (!text || text.length < 5) skip++; else fail++;
    await new Promise(r => setTimeout(r, 700));
  }

  // ── 4. Phrases Utiles ──────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  console.log('💬 PHRASES UTILES');
  // Utiliser la route admin pour récupérer toutes les phrases (pas filtrées par status)
  const phRes = await apiJson({
    hostname: API_HOST,
    path: '/api/admin/phrases?limit=200',
    headers: { Authorization: `Bearer ${token}` },
  });
  const phItems = phRes.body.data || [];
  const phSans = phItems.filter(ph => !ph.audioUrlFr);
  console.log(`   ${phItems.length} phrase(s), ${phSans.length} sans audioUrlFr\n`);

  for (const ph of phSans) {
    const text = (ph.traduction || '').trim();
    const res = await processItem({
      label: ph.phrase.slice(0, 50),
      id: ph.id,
      text,
      slug: slugify(ph.traduction || ph.phrase),
      patchPath: `/api/admin/phrases/${ph.id}`,
      token,
    });
    if (res) ok++; else if (!text || text.length < 5) skip++; else fail++;
    await new Promise(r => setTimeout(r, 700));
  }

  // ─── Résumé ──────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ ${ok} audio(s) français générés`);
  if (skip > 0) console.log(`⏩ ${skip} ignoré(s) (pas de texte français)`);
  if (fail > 0) console.log(`❌ ${fail} échec(s)`);
  console.log('═══════════════════════════════════════');
}

main().catch(console.error);
