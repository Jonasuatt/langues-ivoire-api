/**
 * Seed Division — production via API REST
 * Supprime les fiches corrompues et les recrée avec le bon encodage UTF-8.
 */
const https = require('https');

const API = 'api-production-7107f.up.railway.app';
const IDS_TO_DELETE = [
  '580e80ff-4324-451a-b72a-095213ac5876', // Division simple (corrompue)
  '8de3cc9a-9eab-4499-b130-a3d470c14cdc', // Partager au marché (corrompue)
];

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API,
      port: 443,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  // 1. Login
  console.log('🔑 Connexion...');
  const auth = await request('POST', '/api/auth/login', {
    email: 'admin@languesivoire.ci',
    motDePasse: 'Admin@2026!',
  });
  const token = auth.accessToken;
  if (!token) { console.error('❌ Login échoué', auth); process.exit(1); }
  console.log('✅ Connecté\n');

  // 2. Supprimer les fiches corrompues
  console.log('🗑️  Suppression des fiches corrompues...');
  for (const id of IDS_TO_DELETE) {
    const r = await request('DELETE', `/api/mathematiques/${id}`, null, token);
    console.log(`  - ${id} →`, r.message || r.error || 'OK');
  }

  // 3. Recréer avec le bon encodage
  console.log('\n📐 Création des fiches Division...');

  const fiche1 = await request('POST', '/api/mathematiques', {
    type: 'DIVISION',
    titre: 'Division simple',
    description: 'Apprenez à diviser des petits nombres',
    niveau: 'A1',
    ordre: 4,
    pointsXp: 30,
    contenu: {
      explication: "Diviser c'est partager en parts égales. Ex : 10 mangues partagées entre 2 personnes = 5 chacun",
      exercices: [
        { a: 10, b: 2, resultat: 5, question: '10 ÷ 2 = ?', expression: '10 ÷ 2 = 5' },
        { a:  6, b: 2, resultat: 3, question:  '6 ÷ 2 = ?', expression:  '6 ÷ 2 = 3' },
        { a:  9, b: 3, resultat: 3, question:  '9 ÷ 3 = ?', expression:  '9 ÷ 3 = 3' },
        { a:  8, b: 4, resultat: 2, question:  '8 ÷ 4 = ?', expression:  '8 ÷ 4 = 2' },
        { a: 10, b: 5, resultat: 2, question: '10 ÷ 5 = ?', expression: '10 ÷ 5 = 2' },
        { a:  6, b: 3, resultat: 2, question:  '6 ÷ 3 = ?', expression:  '6 ÷ 3 = 2' },
        { a:  8, b: 2, resultat: 4, question:  '8 ÷ 2 = ?', expression:  '8 ÷ 2 = 4' },
        { a: 10, b:10, resultat: 1, question: '10 ÷ 10 = ?', expression: '10 ÷ 10 = 1' },
      ],
    },
  }, token);
  console.log('  Fiche 1 :', fiche1.id ? `✅ id=${fiche1.id}` : `❌ ${JSON.stringify(fiche1)}`);

  const fiche2 = await request('POST', '/api/mathematiques', {
    type: 'DIVISION',
    titre: 'Partager au marché',
    description: 'Pratiquer la division dans le contexte du marché ivoirien',
    niveau: 'A2',
    ordre: 5,
    pointsXp: 35,
    contenu: {
      exercices: [
        { question: 'Tu as 10 oranges à partager entre 2 amis. Combien chacun reçoit ?',     a: 10, b: 2, resultat: 5,   contexte: '🍊 marché' },
        { question: "Tu as 9 ignames à partager en 3 parts égales. Combien par part ?",       a:  9, b: 3, resultat: 3,   contexte: '🥔 marché' },
        { question: 'Tu as 500 FCFA à partager entre 5 enfants. Combien chacun reçoit ?',    a: 500, b: 5, resultat: 100, contexte: '💰 monnaie', unite: 'FCFA' },
        { question: 'Tu as 1 000 FCFA à partager en 2 parts égales. Combien par part ?',    a: 1000, b: 2, resultat: 500, contexte: '💰 monnaie', unite: 'FCFA' },
        { question: 'Tu as 6 bananes à répartir en 2 rangées. Combien par rangée ?',          a:  6, b: 2, resultat: 3,   contexte: '🍌 marché' },
        { question: 'Tu as 8 poissons à partager entre 4 familles. Combien par famille ?',    a:  8, b: 4, resultat: 2,   contexte: '🐟 marché' },
      ],
    },
  }, token);
  console.log('  Fiche 2 :', fiche2.id ? `✅ id=${fiche2.id}` : `❌ ${JSON.stringify(fiche2)}`);

  console.log('\n🎉 Terminé !');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
