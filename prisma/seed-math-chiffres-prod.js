/**
 * seed-math-chiffres-prod.js
 * Ajoute les mots dioula (chiffres) dans le contenu des fiches
 * Multiplication et Division — pour afficher les opérations en langue.
 *
 * Exemples après mise à jour :
 *   2 × 3 = ?   →   Fila × Saba = Woro
 *   10 ÷ 2 = ?  →   Tan ÷ Fila = Duuru
 */
const https = require('https');

const API = 'api-production-7107f.up.railway.app';

// ── Génération algorithmique des nombres en Dioula (1–100) ──────────────────
const UNITS = ['', 'Kelen', 'Fila', 'Saba', 'Naani', 'Duuru', 'Woro', 'Wolonwula', 'Segin', 'Kɔnɔntɔn'];
const TENS  = { 10: 'Tan', 20: 'Mugan', 30: 'Bi-saba', 40: 'Bi-naani', 50: 'Bi-duuru',
                60: 'Bi-woro', 70: 'Bi-wolonwula', 80: 'Bi-segin', 90: 'Bi-kɔnɔntɔn', 100: 'Kɛmɛ' };

function dioulaWord(n) {
  if (n === 0)   return 'Zéro';
  if (n <= 9)    return UNITS[n];
  if (TENS[n])   return TENS[n];
  const t = Math.floor(n / 10) * 10;
  const u = n % 10;
  return u === 0 ? TENS[t] : `${TENS[t]}-ni-${UNITS[u]}`;
}

/** Construit le tableau chiffres pour tous les nombres distincts d'une liste */
function buildChiffres(numbers) {
  return [...new Set(numbers.filter(n => n > 0 && n <= 100))]
    .sort((a, b) => a - b)
    .map(n => ({ valeur: n, mot: dioulaWord(n) }));
}

// ── Helpers HTTP ─────────────────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API, port: 443, path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(token  ? { Authorization: `Bearer ${token}` }         : {}),
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

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Connexion
  console.log('🔑 Connexion…');
  const auth = await request('POST', '/api/auth/login',
    { email: 'admin@languesivoire.ci', motDePasse: 'Admin@2026!' });
  const token = auth.accessToken;
  if (!token) { console.error('❌ Login échoué', auth); process.exit(1); }
  console.log('✅ Connecté\n');

  // 2. Récupérer toutes les fiches math
  const res = await request('GET', '/api/mathematiques/admin/all?limit=100', null, token);
  const items = res.data || res;

  const targets = items.filter(i => i.type === 'MULTIPLICATION' || i.type === 'DIVISION');
  console.log(`📐 ${targets.length} fiche(s) Multiplication/Division à enrichir\n`);

  // 3. Enrichir chaque fiche
  for (const item of targets) {
    const c = item.contenu || {};
    let numbers = [];

    if (item.type === 'MULTIPLICATION' && c.lignes) {
      // Collecter tous les nombres (table, multiplicateurs, produits)
      c.lignes.forEach(l => {
        if (l.a     != null) numbers.push(l.a);
        if (l.b     != null) numbers.push(l.b);
        if (l.resultat != null) numbers.push(l.resultat);
      });
    }

    if (item.type === 'DIVISION' && c.exercices) {
      c.exercices.forEach(ex => {
        if (ex.a       != null) numbers.push(ex.a);
        if (ex.b       != null) numbers.push(ex.b);
        if (ex.resultat != null) numbers.push(ex.resultat);
      });
    }

    // Ne garder que les nombres ≤ 100 (les FCFA comme 500/1000 sont ignorés)
    const chiffres = buildChiffres(numbers);

    if (chiffres.length === 0) {
      console.log(`  ⏭  ${item.titre} — aucun nombre ≤ 100 détecté, ignoré`);
      continue;
    }

    console.log(`  📝 ${item.titre} — ${chiffres.length} chiffres à ajouter`);
    console.log(`     Exemples : ${chiffres.slice(0, 5).map(c => `${c.valeur}=${c.mot}`).join(', ')}…`);

    const newContenu = { ...c, chiffres };
    const result = await request('PATCH', `/api/mathematiques/${item.id}`, { contenu: newContenu }, token);

    if (result.id || result.contenu) {
      console.log(`  ✅ Mis à jour — id=${item.id}`);
    } else {
      console.log(`  ❌ Échec :`, JSON.stringify(result).slice(0, 120));
    }
  }

  console.log('\n🎉 Terminé !');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
