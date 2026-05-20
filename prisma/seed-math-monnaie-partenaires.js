/**
 * Seed — Module Mathématique, Module Monnaie, Partenaires
 * Usage : node prisma/seed-math-monnaie-partenaires.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Langues MVP ─────────────────────────────────────────────────────────────
const MVP_CODES = ['dioula', 'baoule', 'bete', 'agni', 'gouro', 'senufo', 'guere', 'yacouba', 'abidji'];

// ─── Chiffres de 0 à 10 dans chaque langue MVP ───────────────────────────────
// Format contenu COMPTAGE : { chiffres: [{ valeur, mot, transcription, audioUrl }] }
const CHIFFRES = {
  dioula: [
    { valeur: 0, mot: 'wula', transcription: 'wou-la' },
    { valeur: 1, mot: 'kelen', transcription: 'ké-lèn' },
    { valeur: 2, mot: 'fila', transcription: 'fi-la' },
    { valeur: 3, mot: 'saba', transcription: 'sa-ba' },
    { valeur: 4, mot: 'naani', transcription: 'naa-ni' },
    { valeur: 5, mot: 'duuru', transcription: 'dou-rou' },
    { valeur: 6, mot: 'woro', transcription: 'wo-ro' },
    { valeur: 7, mot: 'wolonwula', transcription: 'wo-lon-wou-la' },
    { valeur: 8, mot: 'seegi', transcription: 'sé-gi' },
    { valeur: 9, mot: 'kononto', transcription: 'ko-non-to' },
    { valeur: 10, mot: 'tan', transcription: 'tan' },
  ],
  baoule: [
    { valeur: 0, mot: 'fitinin', transcription: 'fi-ti-nin' },
    { valeur: 1, mot: 'kun', transcription: 'koun' },
    { valeur: 2, mot: 'nnɔn', transcription: 'nnon' },
    { valeur: 3, mot: 'ngbɛ', transcription: 'ngbè' },
    { valeur: 4, mot: 'nnan', transcription: 'nnan' },
    { valeur: 5, mot: 'nnum', transcription: 'nnoum' },
    { valeur: 6, mot: 'nsia', transcription: 'nsia' },
    { valeur: 7, mot: 'nsɔn', transcription: 'nson' },
    { valeur: 8, mot: 'nnɛgyi', transcription: 'nnèdji' },
    { valeur: 9, mot: 'ngwlan', transcription: 'ngoulan' },
    { valeur: 10, mot: 'blu', transcription: 'blou' },
  ],
  bete: [
    { valeur: 1, mot: 'do', transcription: 'do' },
    { valeur: 2, mot: 'yɛ', transcription: 'yè' },
    { valeur: 3, mot: 'ta', transcription: 'ta' },
    { valeur: 4, mot: 'nya', transcription: 'nia' },
    { valeur: 5, mot: 'mu', transcription: 'mou' },
    { valeur: 6, mot: 'mudo', transcription: 'mou-do' },
    { valeur: 7, mot: 'muyɛ', transcription: 'mou-yè' },
    { valeur: 8, mot: 'muta', transcription: 'mou-ta' },
    { valeur: 9, mot: 'munyɛ', transcription: 'mou-nyè' },
    { valeur: 10, mot: 'pu', transcription: 'pou' },
  ],
  agni: [
    { valeur: 1, mot: 'kun', transcription: 'koun' },
    { valeur: 2, mot: 'nnɔn', transcription: 'nnon' },
    { valeur: 3, mot: 'ngbɛ', transcription: 'ngbè' },
    { valeur: 4, mot: 'nnan', transcription: 'nnan' },
    { valeur: 5, mot: 'nnum', transcription: 'nnoum' },
    { valeur: 6, mot: 'nsia', transcription: 'nsia' },
    { valeur: 7, mot: 'nsɔn', transcription: 'nson' },
    { valeur: 8, mot: 'nnɛgyi', transcription: 'nnèdji' },
    { valeur: 9, mot: 'ngwlan', transcription: 'ngoulan' },
    { valeur: 10, mot: 'blu', transcription: 'blou' },
  ],
  gouro: [
    { valeur: 1, mot: 'dɔɔ', transcription: 'doô' },
    { valeur: 2, mot: 'pi', transcription: 'pi' },
    { valeur: 3, mot: 'ya', transcription: 'ia' },
    { valeur: 4, mot: 'nɛnɛ', transcription: 'nènè' },
    { valeur: 5, mot: 'mu', transcription: 'mou' },
    { valeur: 6, mot: 'mɔdɔɔ', transcription: 'môdoô' },
    { valeur: 7, mot: 'mɔpi', transcription: 'môpi' },
    { valeur: 8, mot: 'mɔya', transcription: 'môia' },
    { valeur: 9, mot: 'mɔnɛnɛ', transcription: 'mônènè' },
    { valeur: 10, mot: 'yɛ', transcription: 'yè' },
  ],
  senufo: [
    { valeur: 1, mot: 'tèen', transcription: 'têèn' },
    { valeur: 2, mot: 'pi', transcription: 'pi' },
    { valeur: 3, mot: 'taar', transcription: 'taàr' },
    { valeur: 4, mot: 'naasɩ', transcription: 'naaci' },
    { valeur: 5, mot: 'kɔɔrɔ', transcription: 'kôoro' },
    { valeur: 6, mot: 'jɛɛnti', transcription: 'jèênti' },
    { valeur: 7, mot: 'tɔrɔwulo', transcription: 'torowouló' },
    { valeur: 8, mot: 'kpɛrɛ', transcription: 'kpèrè' },
    { valeur: 9, mot: 'kpɩn', transcription: 'kpin' },
    { valeur: 10, mot: 'kɔɔ', transcription: 'kôo' },
  ],
  guere: [
    { valeur: 1, mot: 'do', transcription: 'do' },
    { valeur: 2, mot: 'yɛɛ', transcription: 'yèê' },
    { valeur: 3, mot: 'taa', transcription: 'taà' },
    { valeur: 4, mot: 'nyɛɛ', transcription: 'nyèê' },
    { valeur: 5, mot: 'mu', transcription: 'mou' },
    { valeur: 6, mot: 'mudo', transcription: 'mou-do' },
    { valeur: 7, mot: 'muyɛɛ', transcription: 'mou-yèê' },
    { valeur: 8, mot: 'mutaa', transcription: 'mou-taà' },
    { valeur: 9, mot: 'munyɛɛ', transcription: 'mou-nyèê' },
    { valeur: 10, mot: 'po', transcription: 'po' },
  ],
  yacouba: [
    { valeur: 1, mot: 'do', transcription: 'do' },
    { valeur: 2, mot: 'yii', transcription: 'yii' },
    { valeur: 3, mot: 'ta', transcription: 'ta' },
    { valeur: 4, mot: 'nɛi', transcription: 'nèi' },
    { valeur: 5, mot: 'mu', transcription: 'mou' },
    { valeur: 6, mot: 'mudo', transcription: 'mou-do' },
    { valeur: 7, mot: 'muyii', transcription: 'mou-yii' },
    { valeur: 8, mot: 'muta', transcription: 'mou-ta' },
    { valeur: 9, mot: 'munɛi', transcription: 'mou-nèi' },
    { valeur: 10, mot: 'pu', transcription: 'pou' },
  ],
  abidji: [
    { valeur: 1, mot: 'kpɔ', transcription: 'kpo' },
    { valeur: 2, mot: 'drɛ', transcription: 'drè' },
    { valeur: 3, mot: 'tã', transcription: 'tan' },
    { valeur: 4, mot: 'nan', transcription: 'nan' },
    { valeur: 5, mot: 'nun', transcription: 'noun' },
    { valeur: 6, mot: 'nɔndrɛ', transcription: 'nondrè' },
    { valeur: 7, mot: 'nɔntã', transcription: 'nontan' },
    { valeur: 8, mot: 'nɔnnan', transcription: 'nonnan' },
    { valeur: 9, mot: 'nɔnnun', transcription: 'nonnoun' },
    { valeur: 10, mot: 'bla', transcription: 'bla' },
  ],
};

// ─── Pièces et billets FCFA ───────────────────────────────────────────────────
const FCFA_PIECES = [
  { valeur: 5, label: '5 FCFA', couleur: '#C0C0C0', type: 'pièce' },
  { valeur: 10, label: '10 FCFA', couleur: '#C0C0C0', type: 'pièce' },
  { valeur: 25, label: '25 FCFA', couleur: '#FFD700', type: 'pièce' },
  { valeur: 50, label: '50 FCFA', couleur: '#FFD700', type: 'pièce' },
  { valeur: 100, label: '100 FCFA', couleur: '#C0C0C0', type: 'pièce' },
  { valeur: 200, label: '200 FCFA', couleur: '#FFD700', type: 'pièce' },
  { valeur: 500, label: '500 FCFA', couleur: '#8B4513', type: 'billet' },
  { valeur: 1000, label: '1 000 FCFA', couleur: '#8B0000', type: 'billet' },
  { valeur: 2000, label: '2 000 FCFA', couleur: '#006400', type: 'billet' },
  { valeur: 5000, label: '5 000 FCFA', couleur: '#00008B', type: 'billet' },
  { valeur: 10000, label: '10 000 FCFA', couleur: '#800080', type: 'billet' },
];

async function main() {
  console.log('🔢 Démarrage seed — Mathématiques, Monnaie, Partenaires...\n');

  // Récupérer les langues MVP
  const languages = await prisma.language.findMany({
    where: { code: { in: MVP_CODES } },
    select: { id: true, code: true, nom: true },
  });
  const langMap = Object.fromEntries(languages.map(l => [l.code, l]));

  // ─── MODULE MATHÉMATIQUE ─────────────────────────────────────────────────
  console.log('📐 Création des contenus mathématiques...');
  let mathCreated = 0;
  let mathSkipped = 0;

  for (const code of MVP_CODES) {
    const lang = langMap[code];
    if (!lang) { console.log(`  ⚠️  Langue "${code}" introuvable`); continue; }
    const chiffres = CHIFFRES[code];
    if (!chiffres) continue;

    // 1. Comptage — les chiffres de la langue
    const comptageTitle = `Compter en ${lang.nom}`;
    const existingComptage = await prisma.mathContenu.findFirst({
      where: { languageId: lang.id, type: 'COMPTAGE', titre: comptageTitle },
    });
    if (!existingComptage) {
      await prisma.mathContenu.create({
        data: {
          languageId: lang.id,
          type: 'COMPTAGE',
          titre: comptageTitle,
          description: `Apprenez les nombres de 0 à 10 en ${lang.nom}`,
          niveau: 'A1',
          ordre: 0,
          pointsXp: 20,
          contenu: {
            chiffres,
            exercices: chiffres.slice(0, 5).map(c => ({
              type: 'QCM',
              question: `Comment dit-on "${c.valeur}" en ${lang.nom} ?`,
              reponseCorrecte: c.mot,
              choix: [c.mot, chiffres[(c.valeur + 2) % chiffres.length]?.mot || 'erreur',
                      chiffres[(c.valeur + 4) % chiffres.length]?.mot || 'erreur'],
            })),
          },
        },
      });
      mathCreated++;
    } else { mathSkipped++; }

    // 2. Addition simple
    const addTitle = `Addition en ${lang.nom}`;
    const existingAdd = await prisma.mathContenu.findFirst({
      where: { languageId: lang.id, type: 'ADDITION', titre: addTitle },
    });
    if (!existingAdd) {
      await prisma.mathContenu.create({
        data: {
          languageId: lang.id,
          type: 'ADDITION',
          titre: addTitle,
          description: `Additions simples avec les mots en ${lang.nom}`,
          niveau: 'A1',
          ordre: 1,
          pointsXp: 25,
          contenu: {
            chiffres,
            exercices: [
              { a: 1, b: 2, resultat: 3, question: `1 + 2 = ?` },
              { a: 2, b: 3, resultat: 5, question: `2 + 3 = ?` },
              { a: 3, b: 4, resultat: 7, question: `3 + 4 = ?` },
              { a: 4, b: 5, resultat: 9, question: `4 + 5 = ?` },
              { a: 5, b: 5, resultat: 10, question: `5 + 5 = ?` },
            ],
          },
        },
      });
      mathCreated++;
    } else { mathSkipped++; }

    // 3. Soustraction simple
    const subTitle = `Soustraction en ${lang.nom}`;
    const existingSub = await prisma.mathContenu.findFirst({
      where: { languageId: lang.id, type: 'SOUSTRACTION', titre: subTitle },
    });
    if (!existingSub) {
      await prisma.mathContenu.create({
        data: {
          languageId: lang.id,
          type: 'SOUSTRACTION',
          titre: subTitle,
          description: `Soustractions simples en ${lang.nom}`,
          niveau: 'A1',
          ordre: 2,
          pointsXp: 25,
          contenu: {
            chiffres,
            exercices: [
              { a: 5, b: 2, resultat: 3, question: `5 - 2 = ?` },
              { a: 8, b: 3, resultat: 5, question: `8 - 3 = ?` },
              { a: 10, b: 4, resultat: 6, question: `10 - 4 = ?` },
              { a: 7, b: 3, resultat: 4, question: `7 - 3 = ?` },
              { a: 9, b: 5, resultat: 4, question: `9 - 5 = ?` },
            ],
          },
        },
      });
      mathCreated++;
    } else { mathSkipped++; }

    // 4. Nombres pairs et impairs
    const pairTitle = `Pairs et impairs en ${lang.nom}`;
    const existingPair = await prisma.mathContenu.findFirst({
      where: { languageId: lang.id, type: 'PAIR_IMPAIR', titre: pairTitle },
    });
    if (!existingPair) {
      await prisma.mathContenu.create({
        data: {
          languageId: lang.id,
          type: 'PAIR_IMPAIR',
          titre: pairTitle,
          description: `Reconnaître les nombres pairs et impairs en ${lang.nom}`,
          niveau: 'A1',
          ordre: 3,
          pointsXp: 20,
          contenu: {
            chiffres,
            pairs: chiffres.filter(c => c.valeur % 2 === 0),
            impairs: chiffres.filter(c => c.valeur % 2 !== 0),
            exercices: [2, 3, 4, 5, 6, 7].map(n => ({
              valeur: n,
              mot: chiffres.find(c => c.valeur === n)?.mot || String(n),
              estPair: n % 2 === 0,
              question: `Est-ce que "${chiffres.find(c => c.valeur === n)?.mot || n}" est pair ou impair ?`,
            })),
          },
        },
      });
      mathCreated++;
    } else { mathSkipped++; }
  }

  // Tables de multiplication (sans langue — contenu universel)
  for (const table of [2, 3, 5, 10]) {
    const tableTitle = `Table de ${table}`;
    const existing = await prisma.mathContenu.findFirst({
      where: { languageId: null, type: 'MULTIPLICATION', titre: tableTitle },
    });
    if (!existing) {
      await prisma.mathContenu.create({
        data: {
          languageId: null,
          type: 'MULTIPLICATION',
          titre: tableTitle,
          description: `Apprenez la table de multiplication par ${table}`,
          niveau: 'A1',
          ordre: table,
          pointsXp: 30,
          contenu: {
            table,
            lignes: Array.from({ length: 10 }, (_, i) => ({
              a: table,
              b: i + 1,
              resultat: table * (i + 1),
              expression: `${table} × ${i + 1} = ${table * (i + 1)}`,
            })),
          },
        },
      });
      mathCreated++;
    } else { mathSkipped++; }
  }

  console.log(`  ✅ ${mathCreated} contenus créés, ${mathSkipped} déjà existants`);

  // ─── MODULE MONNAIE ──────────────────────────────────────────────────────
  console.log('\n💰 Création des contenus monnaie FCFA...');
  let monnaieCreated = 0;
  let monnaieSkipped = 0;

  // Reconnaissance des pièces et billets — contenu universel (sans langue)
  const reconTitle = 'Reconnaître les pièces et billets FCFA';
  const existingRecon = await prisma.monnaieContenu.findFirst({
    where: { languageId: null, type: 'RECONNAISSANCE', titre: reconTitle },
  });
  if (!existingRecon) {
    await prisma.monnaieContenu.create({
      data: {
        languageId: null,
        type: 'RECONNAISSANCE',
        titre: reconTitle,
        description: 'Apprenez à reconnaître visuellement les pièces et billets FCFA',
        ordre: 0,
        pointsXp: 20,
        contenu: {
          items: FCFA_PIECES,
          exercices: FCFA_PIECES.slice(0, 6).map(p => ({
            type: 'QCM',
            imageLabel: p.label,
            question: `Quelle est la valeur de cette ${p.type} ?`,
            reponseCorrecte: p.valeur,
            choix: [p.valeur, p.valeur * 2, Math.max(5, p.valeur - 5)],
          })),
        },
      },
    });
    monnaieCreated++;
  } else { monnaieSkipped++; }

  // Calcul avec la monnaie — universel
  const calcTitle = 'Calculer avec la monnaie FCFA';
  const existingCalc = await prisma.monnaieContenu.findFirst({
    where: { languageId: null, type: 'CALCUL', titre: calcTitle },
  });
  if (!existingCalc) {
    await prisma.monnaieContenu.create({
      data: {
        languageId: null,
        type: 'CALCUL',
        titre: calcTitle,
        description: 'Calculez des sommes avec des pièces et billets FCFA',
        ordre: 1,
        pointsXp: 25,
        contenu: {
          exercices: [
            {
              question: 'Tu as 2 pièces de 100 FCFA. Combien as-tu en tout ?',
              pieces: [100, 100],
              resultat: 200,
            },
            {
              question: 'Tu as 1 billet de 500 et 1 pièce de 200. Combien as-tu ?',
              pieces: [500, 200],
              resultat: 700,
            },
            {
              question: 'Tu as 3 pièces de 50 FCFA. Combien as-tu ?',
              pieces: [50, 50, 50],
              resultat: 150,
            },
            {
              question: 'Tu as 1 billet de 1000 et 2 pièces de 100. Combien as-tu ?',
              pieces: [1000, 100, 100],
              resultat: 1200,
            },
            {
              question: 'Tu as 2 billets de 500 FCFA. Combien as-tu ?',
              pieces: [500, 500],
              resultat: 1000,
            },
          ],
        },
      },
    });
    monnaieCreated++;
  } else { monnaieSkipped++; }

  // Rendre la monnaie
  const renduTitle = 'Rendre la monnaie';
  const existingRendu = await prisma.monnaieContenu.findFirst({
    where: { languageId: null, type: 'RENDU_MONNAIE', titre: renduTitle },
  });
  if (!existingRendu) {
    await prisma.monnaieContenu.create({
      data: {
        languageId: null,
        type: 'RENDU_MONNAIE',
        titre: renduTitle,
        description: 'Apprenez à calculer la monnaie à rendre au marché',
        ordre: 2,
        pointsXp: 30,
        contenu: {
          exercices: [
            {
              question: 'Tu achètes du pain à 150 FCFA. Tu donnes un billet de 200 FCFA. Combien reçois-tu en retour ?',
              prix: 150,
              donne: 200,
              rendu: 50,
            },
            {
              question: 'Tu achètes de l\'eau à 300 FCFA. Tu donnes 500 FCFA. Combien reçois-tu ?',
              prix: 300,
              donne: 500,
              rendu: 200,
            },
            {
              question: 'Tu achètes des oranges à 750 FCFA. Tu donnes 1000 FCFA. Combien reçois-tu ?',
              prix: 750,
              donne: 1000,
              rendu: 250,
            },
            {
              question: 'Tu achètes du riz à 600 FCFA. Tu donnes 1000 FCFA. Combien reçois-tu ?',
              prix: 600,
              donne: 1000,
              rendu: 400,
            },
            {
              question: 'Tu achètes du savon à 450 FCFA. Tu donnes 500 FCFA. Combien reçois-tu ?',
              prix: 450,
              donne: 500,
              rendu: 50,
            },
          ],
        },
      },
    });
    monnaieCreated++;
  } else { monnaieSkipped++; }

  // Monnaie avec mots en dioula (langue véhiculaire des marchés)
  const lang_dioula = langMap['dioula'];
  if (lang_dioula) {
    const dioTitle = 'Compter la monnaie en Dioula';
    const existingDio = await prisma.monnaieContenu.findFirst({
      where: { languageId: lang_dioula.id, type: 'CALCUL', titre: dioTitle },
    });
    if (!existingDio) {
      await prisma.monnaieContenu.create({
        data: {
          languageId: lang_dioula.id,
          type: 'CALCUL',
          titre: dioTitle,
          description: 'Pratiquez les transactions du marché en Dioula',
          ordre: 3,
          pointsXp: 35,
          contenu: {
            vocabulaire: [
              { francais: 'combien ça coûte ?', dioula: 'joli ye dimi nani ?', transcription: 'joli yé dimi nani ?' },
              { francais: 'c\'est trop cher', dioula: 'a dimi ka ca', transcription: 'a dimi ka ça' },
              { francais: 'je donne', dioula: 'n\'bé a di', transcription: 'n-bé a di' },
              { francais: 'votre monnaie', dioula: 'i ka wari sɔrɔ', transcription: 'i ka wari soro' },
              { francais: 'merci', dioula: 'i ni ce', transcription: 'i ni cé' },
            ],
            dialogue: [
              { role: 'vendeur', texte: 'Joli ye dimi nani ?', traduction: 'Combien ça coûte ?' },
              { role: 'acheteur', texte: 'Wari kelen', traduction: '1000 FCFA' },
              { role: 'vendeur', texte: 'I ni ce !', traduction: 'Merci !' },
            ],
          },
        },
      });
      monnaieCreated++;
    } else { monnaieSkipped++; }
  }

  console.log(`  ✅ ${monnaieCreated} contenus créés, ${monnaieSkipped} déjà existants`);

  // ─── PARTENAIRES ─────────────────────────────────────────────────────────
  console.log('\n🤝 Création des partenaires...');
  let partCreated = 0;
  let partSkipped = 0;

  const partenaires = [
    {
      nom: 'Anthropic (Claude AI)',
      logoUrl: null,
      description: "Anthropic est la société créatrice de Claude, l'intelligence artificielle qui propulse le moteur conversationnel et pédagogique de l'application Langues Ivoire. Partenaire technologique fondateur du projet.",
      siteWeb: 'https://www.anthropic.com',
      categorie: 'Technologie IA',
      pays: 'États-Unis',
      ordre: 0,
    },
  ];

  for (const p of partenaires) {
    const existing = await prisma.partenaire.findFirst({ where: { nom: p.nom } });
    if (!existing) {
      await prisma.partenaire.create({ data: p });
      partCreated++;
    } else { partSkipped++; }
  }

  console.log(`  ✅ ${partCreated} partenaires créés, ${partSkipped} déjà existants`);

  console.log('\n🎉 Seed terminé avec succès !');
}

main()
  .catch(e => { console.error('❌ Erreur :', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
