/**
 * seed-monnaie-chiffres-prod.js
 * Ajoute les mots dioula (chiffres FCFA) dans le contenu des fiches Monnaie
 * pour afficher les montants en langue locale.
 *
 * Exemples après mise à jour :
 *   rendu: 50   →  "Bi-duuru FCFA"
 *   rendu: 200  →  "Kɛmɛ-fila FCFA"
 *   resultat: 1000 → "Wari FCFA"
 */
const https = require('https');

const API = 'api-production-7107f.up.railway.app';

// ── Vocabulaire Dioula pour les montants FCFA courants ──────────────────────
// Nombres simples (couverts par le système Dioula standard)
const UNITS = ['', 'Kelen', 'Fila', 'Saba', 'Naani', 'Duuru', 'Woro', 'Wolonwula', 'Segin', 'Kɔnɔntɔn'];
const TENS  = {
  10: 'Tan', 20: 'Mugan', 30: 'Bi-saba', 40: 'Bi-naani', 50: 'Bi-duuru',
  60: 'Bi-woro', 70: 'Bi-wolonwula', 80: 'Bi-segin', 90: 'Bi-kɔnɔntɔn',
};

function dioulaSmall(n) {
  if (n <= 0) return null;
  if (n <= 9)  return UNITS[n];
  if (TENS[n]) return TENS[n];
  const t = Math.floor(n / 10) * 10, u = n % 10;
  if (u === 0) return TENS[t] || null;
  return TENS[t] ? `${TENS[t]}-ni-${UNITS[u]}` : null;
}

// Montants FCFA connus en Dioula commercial
const FCFA_DIOULA = {
  5:     'Duuru',
  10:    'Tan',
  25:    'Mugan-ni-duuru',
  50:    'Bi-duuru',
  100:   'Kɛmɛ',
  200:   'Kɛmɛ-fila',
  300:   'Kɛmɛ-saba',
  400:   'Kɛmɛ-naani',
  500:   'Kɛmɛ-duuru',
  1000:  'Wari',
  2000:  'Wari-fila',
  5000:  'Wari-duuru',
  10000: 'Wari-tan',
};

function dioulaFCFA(n) {
  if (FCFA_DIOULA[n]) return FCFA_DIOULA[n];
  if (n <= 90) return dioulaSmall(n);
  return null; // montant complexe — fallback numérique dans l'app
}

/** Construit le tableau chiffres pour une liste de montants */
function buildChiffres(amounts) {
  return [...new Set(amounts.filter(n => n != null && n > 0))]
    .sort((a, b) => a - b)
    .map(n => ({ valeur: n, mot: dioulaFCFA(n) }))
    .filter(c => c.mot !== null);
}

// ── Helpers HTTP ─────────────────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API, port: 443, path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(token   ? { Authorization: `Bearer ${token}` }            : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Collecte tous les montants d'un contenu Monnaie ─────────────────────────
function collectAmounts(c) {
  const nums = [];
  // RECONNAISSANCE
  if (c.items) c.items.forEach(it => { if (it.valeur != null) nums.push(it.valeur); });
  // CALCUL exercices
  if (c.exercices) c.exercices.forEach(ex => {
    if (ex.resultat != null) nums.push(ex.resultat);
    if (ex.prix     != null) nums.push(ex.prix);
    if (ex.donne    != null) nums.push(ex.donne);
    if (ex.rendu    != null) nums.push(ex.rendu);
    if (Array.isArray(ex.pieces)) ex.pieces.forEach(p => nums.push(p));
    if (Array.isArray(ex.choix))  ex.choix.forEach(p  => nums.push(p));
    if (ex.reponseCorrecte != null) nums.push(ex.reponseCorrecte);
  });
  return nums;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔑 Connexion…');
  const auth = await request('POST', '/api/auth/login',
    { email: 'admin@languesivoire.ci', motDePasse: 'Admin@2026!' });
  const token = auth.accessToken;
  if (!token) { console.error('❌ Login échoué', auth); process.exit(1); }
  console.log('✅ Connecté\n');

  const res = await request('GET', '/api/monnaie/admin/all?limit=100', null, token);
  const items = res.data || res;
  console.log(`💰 ${items.length} fiche(s) Monnaie à enrichir\n`);

  for (const item of items) {
    const c = item.contenu || {};
    const amounts = collectAmounts(c);
    const chiffres = buildChiffres(amounts);

    if (chiffres.length === 0) {
      console.log(`  ⏭  ${item.titre} — aucun montant convertible, ignoré`);
      continue;
    }

    console.log(`  📝 ${item.type} — ${item.titre}`);
    console.log(`     ${chiffres.length} chiffres : ${chiffres.map(c => `${c.valeur}=${c.mot}`).join(', ')}`);

    const newContenu = { ...c, chiffres };
    const result = await request('PATCH', `/api/monnaie/${item.id}`, { contenu: newContenu }, token);

    if (result.id || result.contenu) {
      console.log(`  ✅ Mis à jour — id=${item.id}`);
    } else {
      console.log(`  ❌ Échec :`, JSON.stringify(result).slice(0, 150));
    }
  }

  console.log('\n🎉 Terminé !');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
