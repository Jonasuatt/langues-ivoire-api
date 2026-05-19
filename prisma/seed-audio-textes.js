/**
 * Génération audio pour les Textes & Récits
 * Pour chaque texte : TTS → Cloudinary → PATCH audioUrl
 */
const https = require('https');
const http  = require('http');

const API_HOST    = 'api-production-7107f.up.railway.app';
const AI_HOST     = 'langues-ivoire-ai-production.up.railway.app';
const CLOUD_NAME  = 'dbgcyk57a';
const CLOUD_KEY   = '998577366383524';
const CLOUD_SEC   = 'NAToVFaJZRuG6hR87ApJOlRzUMg';

// ─── Langue → code pour le TTS ───────────────────────────────────────────────
const LANG_CODE = {
  'e11b660e-ac5c-4afe-a51c-8d1adaaf91b5': 'baoule',
  'ce40adc3-ca8b-4dee-806c-01ce41940b86': 'dioula',
  '7770b15a-9b0e-49f5-87b1-8bbeccde5183': 'bete',
  '8af49841-5b44-4bbd-ae04-520f4554affb': 'senoufo',
  'b852f2af-5e75-4d89-b13f-9cd9f40d5e44': 'agni',
  'd01b784f-4f66-4f9d-81d5-9c51a2c20903': 'gouro',
  '781565c4-d55b-4dff-bf9a-8c136dba4597': 'guere',
  '668bde2e-c471-4b51-a5d6-844665663f4f': 'nouchi',
};

// ─── Helpers HTTP ─────────────────────────────────────────────────────────────

function httpReq(mod, options, body) {
  return new Promise((resolve, reject) => {
    const req = mod.request(options, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, buffer: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function apiJson(options, body) {
  return httpReq(https, options, body).then(r => ({
    status: r.status,
    body: (() => { try { return JSON.parse(r.buffer.toString()); } catch { return r.buffer.toString(); } })(),
  }));
}

// ─── Cloudinary upload (multipart/form-data) ──────────────────────────────────

function cloudinaryUpload(audioBuffer, filename) {
  return new Promise((resolve, reject) => {
    // Générer la signature Cloudinary
    const crypto = require('crypto');
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'langues-ivoire/textes-audio';
    const paramStr = `folder=${folder}&public_id=${filename}&timestamp=${timestamp}`;
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

    const bodyParts = parts.map(p => Buffer.isBuffer(p) ? p : Buffer.from(p));
    const bodyBuffer = Buffer.concat(bodyParts);

    const req = https.request({
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/raw/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length,
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
    req.write(bodyBuffer);
    req.end();
  });
}

// ─── Extraire un extrait audio (3 premières lignes du contenu) ────────────────

function extractAudioText(texte) {
  const lines = texte.contenu.split('\n').filter(l => l.trim().length > 0);
  // Prendre les 3 premières lignes non vides, max 400 chars
  return lines.slice(0, 3).join(' ').slice(0, 400);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Authentification
  console.log('🔐 Authentification...');
  const authBody = JSON.stringify({ email: 'admin@languesivoire.ci', motDePasse: 'Admin@2026!' });
  const authRes = await apiJson({
    hostname: API_HOST, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(authBody) },
  }, authBody);
  const token = authRes.body.accessToken;
  if (!token) { console.error('❌ Auth failed'); process.exit(1); }
  console.log('✅ Connecté\n');

  // 2. Récupérer les textes créés (page 1 + 2 si besoin)
  console.log('📋 Récupération des textes...');
  const listRes = await apiJson({
    hostname: API_HOST, path: '/api/text-contents/admin/list?page=1&limit=50',
    headers: { Authorization: `Bearer ${token}` },
  });
  const textes = listRes.body.data || [];
  // Filtrer uniquement ceux sans audio
  const sansAudio = textes.filter(t => !t.audioUrl);
  console.log(`📝 ${textes.length} texte(s) trouvés, ${sansAudio.length} sans audio\n`);

  let ok = 0, fail = 0;

  for (const texte of sansAudio) {
    const langCode = LANG_CODE[texte.languageId] || 'dioula';
    const audioText = extractAudioText(texte);

    process.stdout.write(`🎙️  [${texte.type}] ${texte.titre.slice(0, 50)}... `);

    try {
      // 3. Générer l'audio via TTS
      const ttsBody = JSON.stringify({ text: audioText, languageCode: langCode, speed: 0.9 });
      const ttsRes = await httpReq(https, {
        hostname: AI_HOST,
        path: '/tts/synthesize',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(ttsBody) },
      }, ttsBody);

      if (ttsRes.status !== 200 || ttsRes.buffer.length < 1000) {
        throw new Error(`TTS status ${ttsRes.status}, size ${ttsRes.buffer.length}`);
      }

      // 4. Upload sur Cloudinary
      const slug = texte.titre
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 50);
      const filename = `${langCode}_${slug}_${texte.id.slice(0, 8)}`;
      const cloudRes = await cloudinaryUpload(ttsRes.buffer, filename);

      if (!cloudRes.secure_url) throw new Error('Cloudinary: ' + JSON.stringify(cloudRes).slice(0, 100));
      const audioUrl = cloudRes.secure_url;

      // 5. PATCH le texte avec l'audioUrl
      const patchBody = JSON.stringify({ audioUrl });
      const patchRes = await apiJson({
        hostname: API_HOST,
        path: `/api/text-contents/admin/${texte.id}`,
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

      console.log(`✅ ${Math.round(ttsRes.buffer.length / 1024)}ko → Cloudinary`);
      ok++;

    } catch (err) {
      console.log(`❌ ${err.message}`);
      fail++;
    }

    // Pause entre chaque requête
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${ok} audio(s) générés et attachés`);
  if (fail > 0) console.log(`❌ ${fail} échec(s)`);
  console.log(`═══════════════════════════════════════`);
}

main().catch(console.error);
