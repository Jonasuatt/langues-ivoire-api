/**
 * seed-sample-content.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Insère du contenu d'exemple :
 *   • 3 galeries thématiques (Animaux, Artisanat, Gastronomie) avec images
 *   • Items culturels type TRESOR pour le Musée des Trésors (4 ethnies)
 *
 * Images : Wikipedia Commons (domaine public / CC-BY-SA)
 *
 * Usage :
 *   node scripts/seed-sample-content.js
 *   node scripts/seed-sample-content.js --reset   (supprime d'abord le contenu exemple)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const RESET = process.argv.includes('--reset');

// ─── Images Wikipedia Commons (domaine public / CC) ───────────────────────────
const WK = 'https://upload.wikimedia.org/wikipedia/commons/thumb';
const WC = 'https://upload.wikimedia.org/wikipedia/commons';

// ─── GALERIES ─────────────────────────────────────────────────────────────────
const GALLERIES = [
  {
    rubrique: 'animaux',
    titre: 'Faune d\'Afrique de l\'Ouest',
    description: 'Animaux sauvages et domestiques présents en Côte d\'Ivoire et dans la sous-région.',
    coverUrl: `${WK}/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg`,
    status: 'PUBLISHED',
    images: [
      { legende: 'Éléphant de savane', traduction: 'African bush elephant',       imageUrl: `${WK}/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg` },
      { legende: 'Lion d\'Afrique',    traduction: 'African lion',                 imageUrl: `${WK}/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg` },
      { legende: 'Chimpanzé commun',   traduction: 'Common chimpanzee',            imageUrl: `${WK}/4/43/Chimpanzee_seated.jpg/640px-Chimpanzee_seated.jpg` },
      { legende: 'Hippopotame',        traduction: 'Hippopotamus',                 imageUrl: `${WK}/0/00/Hippopotamus_in_Mikumi_National_Park.jpg/640px-Hippopotamus_in_Mikumi_National_Park.jpg` },
      { legende: 'Crocodile du Nil',   traduction: 'Nile crocodile',               imageUrl: `${WK}/6/68/Crocodylus_niloticus.jpg/640px-Crocodylus_niloticus.jpg` },
      { legende: 'Perroquet gris',     traduction: 'African grey parrot',          imageUrl: `${WK}/e/e3/Psittacus_erithacus_-perched.jpg/640px-Psittacus_erithacus_-perched.jpg` },
      { legende: 'Zèbre de Burchell',  traduction: 'Burchell\'s zebra',            imageUrl: `${WK}/e/e3/Plains_Zebra_Equus_quagga.jpg/640px-Plains_Zebra_Equus_quagga.jpg` },
      { legende: 'Gorille des montagnes', traduction: 'Mountain gorilla',          imageUrl: `${WK}/0/0e/Gorille_des_plaines.jpg/640px-Gorille_des_plaines.jpg` },
      { legende: 'Girafe de Nubie',    traduction: 'Nubian giraffe',               imageUrl: `${WK}/b/b2/Giraffe_Mikumi.jpg/640px-Giraffe_Mikumi.jpg` },
    ],
  },
  {
    rubrique: 'artisanat',
    titre: 'Artisanat et Masques d\'Afrique',
    description: 'Objets d\'art, masques et textiles traditionnels des peuples d\'Afrique de l\'Ouest.',
    coverUrl: `${WK}/f/fd/Mask_Baoule_Louvre_71-1966-54.jpg/480px-Mask_Baoule_Louvre_71-1966-54.jpg`,
    status: 'PUBLISHED',
    images: [
      { legende: 'Masque Baoulé',       traduction: 'Baoulé mask',                imageUrl: `${WK}/f/fd/Mask_Baoule_Louvre_71-1966-54.jpg/480px-Mask_Baoule_Louvre_71-1966-54.jpg` },
      { legende: 'Tissu Kente',         traduction: 'Kente cloth',                imageUrl: `${WK}/6/6c/GhanaKente.jpg/640px-GhanaKente.jpg` },
      { legende: 'Sculpture Sénoufo',   traduction: 'Senufo sculpture',           imageUrl: `${WK}/4/4a/Senufo_figure_Louvre_71-1916-60.jpg/480px-Senufo_figure_Louvre_71-1916-60.jpg` },
      { legende: 'Poterie en argile',   traduction: 'Clay pottery',               imageUrl: `${WK}/9/94/African_Pottery.jpg/640px-African_Pottery.jpg` },
      { legende: 'Panier tressé',       traduction: 'Woven basket',               imageUrl: `${WK}/3/3c/Basket_weaving.jpg/640px-Basket_weaving.jpg` },
      { legende: 'Bijou en or Akan',    traduction: 'Akan gold jewellery',        imageUrl: `${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg` },
    ],
  },
  {
    rubrique: 'gastronomie',
    titre: 'Gastronomie ivoirienne',
    description: 'Plats, ingrédients et scènes culinaires de la cuisine traditionnelle ivoirienne.',
    coverUrl: `${WK}/8/8e/Attiéké_avec_poisson.jpg/640px-Attiéké_avec_poisson.jpg`,
    status: 'PUBLISHED',
    images: [
      { legende: 'Attiéké au poisson',  traduction: 'Cassava couscous with fish', imageUrl: `${WK}/8/8e/Attiéké_avec_poisson.jpg/640px-Attiéké_avec_poisson.jpg` },
      { legende: 'Igname pilée',        traduction: 'Pounded yam',                imageUrl: `${WK}/a/a6/Pounded_yam.jpg/640px-Pounded_yam.jpg` },
      { legende: 'Banane plantain',     traduction: 'Plantain banana',            imageUrl: `${WK}/a/ab/Banane_plantain.jpg/640px-Banane_plantain.jpg` },
      { legende: 'Noix de coco',        traduction: 'Coconut',                    imageUrl: `${WK}/f/f2/Coconut_on_white_background.jpg/640px-Coconut_on_white_background.jpg` },
      { legende: 'Noix de cajou',       traduction: 'Cashew nuts',                imageUrl: `${WK}/e/ef/Cashew_nuts_-_whole_and_halved.jpg/640px-Cashew_nuts_-_whole_and_halved.jpg` },
      { legende: 'Fève de cacao',       traduction: 'Cocoa bean',                 imageUrl: `${WK}/e/eb/Cacao-pod-k4600.jpg/640px-Cacao-pod-k4600.jpg` },
      { legende: 'Marché ivoirien',     traduction: 'Ivorian market',             imageUrl: `${WK}/7/74/African_market.jpg/640px-African_market.jpg` },
    ],
  },
];

// ─── TRÉSORS CULTURELS ────────────────────────────────────────────────────────
const TRESORS = [
  // ── BAOULÉ ──
  {
    sourceEthnique: 'baoule', type: 'TRESOR', isActive: true,
    emoji: '🎭', titre: 'Masque Goli',
    typeObjet: 'Masque cérémoniel', matiere: 'Bois de fromager peint',
    seuilXp: 0,
    contenu: 'Kplé kplé ni, wo di, wo tra. Goli flan, ɔ kɔ tra man kɔkɔ.',
    traduction: 'Le Goli est dansé lors des funérailles et des fêtes. Il symbolise la force vitale transmise aux vivants par les ancêtres.',
    imageUrl: `${WK}/f/fd/Mask_Baoule_Louvre_71-1966-54.jpg/480px-Mask_Baoule_Louvre_71-1966-54.jpg`,
  },
  {
    sourceEthnique: 'baoule', type: 'TRESOR', isActive: true,
    emoji: '🧣', titre: 'Pagne Kita',
    typeObjet: 'Textile traditionnel', matiere: 'Coton tissé à la main',
    seuilXp: 80,
    contenu: 'Kita klotɔ su, bla su a a bo n\'da siɛn. Sran kɔkɔ wla.',
    traduction: 'Le pagne Kita est tissé par les femmes Baoulé. Chaque motif géométrique porte un proverbe et raconte une histoire de famille.',
    imageUrl: `${WK}/6/6c/GhanaKente.jpg/640px-GhanaKente.jpg`,
  },
  {
    sourceEthnique: 'baoule', type: 'TRESOR', isActive: true,
    emoji: '🗿', titre: 'Statuette Blolo Bian',
    typeObjet: 'Sculpture rituelle', matiere: 'Bois et pigments naturels',
    seuilXp: 200,
    contenu: 'Blolo bian nin blolo bla, ɔ tra ɔ fi. Sran ɔ wla wuliɛ.',
    traduction: 'La Blolo Bian (époux de l\'au-delà) est gardée chez soi pour entretenir une relation spirituelle avec son conjoint céleste.',
    imageUrl: `${WC}/a/a4/Louvre-Lens_-_Egypte_au_Louvre_-_043.JPG`,
  },
  {
    sourceEthnique: 'baoule', type: 'TRESOR', isActive: true,
    emoji: '📿', titre: 'Pendentif Akan en or',
    typeObjet: 'Joaillerie royale', matiere: 'Or fondu à la cire perdue',
    seuilXp: 400,
    contenu: 'Akan wawɔ, srɛfuɛ, flɛ wɔ nin kɛkɛ. Ɔ yɛ famiɛn mun\'yɛ.',
    traduction: 'Fondu selon la technique de la cire perdue héritée des Ashanti, ce bijou royal ne pouvait être porté que par les chefs.',
    imageUrl: `${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg`,
  },

  // ── DIOULA ──
  {
    sourceEthnique: 'dioula', type: 'TRESOR', isActive: true,
    emoji: '⚖️', titre: 'Balance de Kong',
    typeObjet: 'Outil de commerce', matiere: 'Laiton et cuir tanné',
    seuilXp: 0,
    contenu: 'Kong tana, sɛbɛ sara, ji bɔgɔ. Warankɛla ka kɛlɛ kɛ.',
    traduction: 'Kong, capitale commerciale du XVIIIe siècle, rayonnait jusqu\'au Sahara. Cette balance mesurait l\'or et les noix de kola.',
    imageUrl: `${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg`,
  },
  {
    sourceEthnique: 'dioula', type: 'TRESOR', isActive: true,
    emoji: '🪬', titre: 'Calebasse gravée',
    typeObjet: 'Récipient cérémoniel', matiere: 'Cucurbitacée gravée',
    seuilXp: 80,
    contenu: 'Wotoro kɛlɛn, ka sira wele. Warankɛla ɲɛ ka kɛ.',
    traduction: 'Les motifs géométriques gravés racontent les routes commerciales du porteur — une véritable carte de ses voyages.',
    imageUrl: `${WK}/9/94/African_Pottery.jpg/640px-African_Pottery.jpg`,
  },
  {
    sourceEthnique: 'dioula', type: 'TRESOR', isActive: true,
    emoji: '👘', titre: 'Grand boubou brodé',
    typeObjet: 'Vêtement de prestige', matiere: 'Bazin riche et fil d\'or',
    seuilXp: 200,
    contenu: 'Boubou, ka nyi, ka ɲɛ. Warankɛla ka ɲɛ ka kɛ.',
    traduction: 'Le grand boubou à broderie "teinture" est le signe de la réussite du commerçant. Plus les broderies sont fines, plus le statut est élevé.',
    imageUrl: `${WK}/6/6c/GhanaKente.jpg/640px-GhanaKente.jpg`,
  },
  {
    sourceEthnique: 'dioula', type: 'TRESOR', isActive: true,
    emoji: '🎸', titre: 'Kora miniature',
    typeObjet: 'Instrument sacré', matiere: 'Calebasse, peau et 21 cordes',
    seuilXp: 400,
    contenu: 'Kora dɔ, jeli ka kumaben, ka ɲɛ ka kɛ. Manden sira.',
    traduction: 'La kora à 21 cordes est l\'instrument des griots Mandé, gardiens de la mémoire orale. Chaque mélodie est une page d\'histoire.',
    imageUrl: null,
  },

  // ── SÉNOUFO ──
  {
    sourceEthnique: 'senoufo', type: 'TRESOR', isActive: true,
    emoji: '🦅', titre: 'Sculpture Deble',
    typeObjet: 'Figure rituelle Poro', matiere: 'Bois de rônier',
    seuilXp: 0,
    contenu: 'Deble, Poro sanɔgɔ. Kpiɛmbele ka sɛ, tyeli ka sɛ.',
    traduction: 'La sculpture Deble est portée lors des cérémonies du Poro. Elle représente l\'ancêtre fondateur et transmet la sagesse aux initiés.',
    imageUrl: `${WK}/4/4a/Senufo_figure_Louvre_71-1916-60.jpg/480px-Senufo_figure_Louvre_71-1916-60.jpg`,
  },
  {
    sourceEthnique: 'senoufo', type: 'TRESOR', isActive: true,
    emoji: '🐦', titre: 'Masque Kpeliye\'e',
    typeObjet: 'Masque facial', matiere: 'Bois et métal',
    seuilXp: 80,
    contenu: 'Kpeliye\'e, tyolo sɔrɔ, pye sɔrɔ. Poro ka tyeli.',
    traduction: 'Le masque Kpeliye\'e est l\'un des plus beaux de l\'art africain. Porté lors des funérailles, il guide l\'âme vers les ancêtres.',
    imageUrl: `${WK}/4/4a/Senufo_figure_Louvre_71-1916-60.jpg/480px-Senufo_figure_Louvre_71-1916-60.jpg`,
  },
  {
    sourceEthnique: 'senoufo', type: 'TRESOR', isActive: true,
    emoji: '🏺', titre: 'Corne à libation',
    typeObjet: 'Objet rituel', matiere: 'Ivoire sculpté',
    seuilXp: 200,
    contenu: 'Tyolo ko, pye ko, Poro ka sɛ. Kamali dɛ.',
    traduction: 'La corne à libation en ivoire sculpté est utilisée pour offrir des boissons aux ancêtres lors des cérémonies initiatiques du Poro.',
    imageUrl: null,
  },

  // ── BÉTÉ ──
  {
    sourceEthnique: 'bete', type: 'TRESOR', isActive: true,
    emoji: '🎭', titre: 'Masque Gbéa',
    typeObjet: 'Masque de guerre', matiere: 'Bois et fibres végétales',
    seuilXp: 0,
    contenu: 'Gbéa, wlɔkɔ, wlɛɛ. Kpan nya, kpan nya di.',
    traduction: 'Le masque Gbéa était porté par les guerriers Bété avant la bataille. Sa puissance spirituelle protège son porteur et terrorise l\'ennemi.',
    imageUrl: `${WK}/f/fd/Mask_Baoule_Louvre_71-1966-54.jpg/480px-Mask_Baoule_Louvre_71-1966-54.jpg`,
  },
  {
    sourceEthnique: 'bete', type: 'TRESOR', isActive: true,
    emoji: '🥁', titre: 'Gong de palabre',
    typeObjet: 'Instrument de communication', matiere: 'Bronze fondu',
    seuilXp: 80,
    contenu: 'Gɔng gbla, man kɔ. Nyɔnɔ kɔ, sran kɔ tra man.',
    traduction: 'Le gong de palabre convoque l\'assemblée du village. Son son porte loin dans la forêt et signifie que les anciens ont une décision à prendre.',
    imageUrl: null,
  },

  // ── AGNI ──
  {
    sourceEthnique: 'agni', type: 'TRESOR', isActive: true,
    emoji: '👑', titre: 'Trône royal Agni',
    typeObjet: 'Siège de pouvoir', matiere: 'Bois sculpté et feuilles d\'or',
    seuilXp: 0,
    contenu: 'Nana bia, famiɛn bia, asɛndua. Agni man famiɛn.',
    traduction: 'Le trône royal est le symbole suprême de l\'autorité Agni. Il ne touche jamais le sol et est porté par des serviteurs lors des cérémonies.',
    imageUrl: null,
  },
  {
    sourceEthnique: 'agni', type: 'TRESOR', isActive: true,
    emoji: '🏅', titre: 'Médaillon pectoral',
    typeObjet: 'Insigne de noblesse', matiere: 'Or battu et incrusté',
    seuilXp: 200,
    contenu: 'Kɔnkɔ, famiɛn mun, asɛndua. Agni ɲɔnna, sran ɔ wla.',
    traduction: 'Ce médaillon en or était porté sur la poitrine par les nobles Agni lors des grandes cérémonies royales d\'Abengourou.',
    imageUrl: `${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg`,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ok   = (m) => console.log(`  ✅ ${m}`);
const info = (m) => console.log(`\n📌 ${m}`);
const skip = (m) => console.log(`  ⏭️  ${m}`);

// ─── Reset ────────────────────────────────────────────────────────────────────
async function reset() {
  info('RESET — Suppression du contenu exemple');
  const titles = GALLERIES.map(g => g.titre);
  const { count: gc } = await prisma.imageGallery.deleteMany({ where: { titre: { in: titles } } });
  ok(`${gc} galerie(s) supprimée(s)`);

  const tNoms = TRESORS.map(t => t.titre);
  const { count: tc } = await prisma.culturalItem.deleteMany({ where: { type: 'TRESOR', titre: { in: tNoms } } });
  ok(`${tc} trésor(s) supprimé(s)`);
}

// ─── Seed Galeries ────────────────────────────────────────────────────────────
async function seedGalleries() {
  info('GALERIES D\'IMAGES');
  for (const [i, gal] of GALLERIES.entries()) {
    const existing = await prisma.imageGallery.findFirst({ where: { titre: gal.titre } });
    if (existing) { skip(`"${gal.titre}" existe déjà`); continue; }

    const gallery = await prisma.imageGallery.create({
      data: {
        rubrique:    gal.rubrique,
        titre:       gal.titre,
        description: gal.description,
        coverUrl:    gal.coverUrl,
        ordre:       i,
        status:      'PUBLISHED',
      },
    });

    for (const [j, img] of gal.images.entries()) {
      await prisma.galleryImage.create({
        data: {
          galleryId:  gallery.id,
          imageUrl:   img.imageUrl,
          legende:    img.legende,
          traduction: img.traduction,
          ordre:      j + 1,
        },
      });
    }
    ok(`"${gal.titre}" — ${gal.images.length} image(s)`);
  }
}

// ─── Seed Trésors ─────────────────────────────────────────────────────────────
async function seedTresors() {
  info('TRÉSORS CULTURELS — Musée des Trésors');

  // Trouver le languageId de chaque ethnie depuis la base
  const languages = await prisma.language.findMany({ select: { id: true, code: true } });
  const langByCode = Object.fromEntries(languages.map(l => [l.code, l.id]));

  const ETHNIE_TO_LANG = {
    baoule:  'baoule',
    dioula:  'dioula',
    bete:    'bete',
    senoufo: 'senoufo',
    agni:    'agni',
    gouro:   'gouro',
    guere:   'guere',
    nouchi:  'nouchi',
  };

  let count = 0;
  for (const t of TRESORS) {
    const existing = await prisma.culturalItem.findFirst({
      where: { type: 'TRESOR', titre: t.titre },
    });
    if (existing) { skip(`"${t.titre}" existe déjà`); continue; }

    const langCode = ETHNIE_TO_LANG[t.sourceEthnique];
    const languageId = langCode ? (langByCode[langCode] || null) : null;

    await prisma.culturalItem.create({
      data: {
        languageId,
        type:           'TRESOR',
        titre:          t.titre,
        contenu:        t.contenu,
        traduction:     t.traduction,
        sourceEthnique: t.sourceEthnique,
        seuilXp:        t.seuilXp,
        typeObjet:      t.typeObjet,
        matiere:        t.matiere,
        emoji:          t.emoji,
        imageUrl:       t.imageUrl || null,
        isActive:       true,
      },
    });
    ok(`${t.emoji} "${t.titre}" (${t.sourceEthnique}, seuil: ${t.seuilXp} XP)`);
    count++;
  }
  console.log(`\n→ ${count} trésor(s) créé(s).`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🖼️  Seed contenu d\'exemple — Galeries + Trésors');
  console.log('━'.repeat(55));
  if (RESET) await reset();
  await seedGalleries();
  await seedTresors();
  console.log('\n' + '━'.repeat(55));
  console.log('✅ Terminé. Recharge l\'app mobile pour voir les résultats.\n');
}

main()
  .catch(err => { console.error('\n❌ Erreur :', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
