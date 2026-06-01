/**
 * Route d'administration : seed des galeries et trésors en production.
 * Accessible uniquement aux SUPER_ADMIN.
 * À appeler UNE SEULE FOIS depuis le navigateur ou curl.
 *
 * GET /api/admin/seed-galleries
 */
const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Picsum Photos — images stables par seed, pas de restriction CORS/hotlink
const P = (seed, w = 640, h = 430) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Endpoint de mise à jour des images existantes (reset + replace URLs)
const GALLERIES = [
  {
    rubrique: 'animaux',
    titre: "Faune d'Afrique de l'Ouest",
    description: "Animaux sauvages et domestiques présents en Côte d'Ivoire et dans la sous-région.",
    coverUrl: P('elephant-africa', 640, 400),
    images: [
      { legende: 'Éléphant de savane',   traduction: 'African bush elephant', imageUrl: P('elephant',     640, 430) },
      { legende: "Lion d'Afrique",        traduction: 'African lion',          imageUrl: P('lion-africa',  640, 430) },
      { legende: 'Chimpanzé commun',      traduction: 'Common chimpanzee',     imageUrl: P('chimpanzee',  640, 430) },
      { legende: 'Hippopotame',           traduction: 'Hippopotamus',          imageUrl: P('hippo',       640, 430) },
      { legende: 'Crocodile du Nil',      traduction: 'Nile crocodile',        imageUrl: P('crocodile',   640, 430) },
      { legende: 'Perroquet gris',        traduction: 'African grey parrot',   imageUrl: P('parrot',      640, 430) },
      { legende: 'Zèbre',                 traduction: 'Zebra',                 imageUrl: P('zebra',       640, 430) },
      { legende: 'Gorille',               traduction: 'Gorilla',               imageUrl: P('gorilla',     640, 430) },
      { legende: 'Girafe',                traduction: 'Giraffe',               imageUrl: P('giraffe',     640, 430) },
    ],
  },
  {
    rubrique: 'artisanat',
    titre: "Artisanat et Masques d'Afrique",
    description: "Objets d'art, masques et textiles traditionnels des peuples d'Afrique de l'Ouest.",
    coverUrl: P('african-mask', 640, 400),
    images: [
      { legende: 'Masque africain',      traduction: 'African mask',          imageUrl: P('african-mask',   640, 430) },
      { legende: 'Tissu traditionnel',   traduction: 'Traditional fabric',    imageUrl: P('fabric-pattern', 640, 430) },
      { legende: 'Sculpture en bois',    traduction: 'Wood sculpture',        imageUrl: P('wood-sculpture', 640, 430) },
      { legende: 'Poterie en argile',    traduction: 'Clay pottery',          imageUrl: P('pottery',        640, 430) },
      { legende: 'Bijou traditionnel',   traduction: 'Traditional jewellery', imageUrl: P('jewellery-gold', 640, 430) },
    ],
  },
  {
    rubrique: 'gastronomie',
    titre: 'Gastronomie ivoirienne',
    description: "Plats, ingrédients et scènes culinaires de la cuisine traditionnelle ivoirienne.",
    coverUrl: P('african-food', 640, 400),
    images: [
      { legende: 'Igname pilée',         traduction: 'Pounded yam',           imageUrl: P('yam-food',   640, 430) },
      { legende: 'Banane plantain',      traduction: 'Plantain banana',       imageUrl: P('plantain',   640, 430) },
      { legende: 'Noix de coco',         traduction: 'Coconut',               imageUrl: P('coconut',    640, 430) },
      { legende: 'Noix de cajou',        traduction: 'Cashew nuts',           imageUrl: P('cashew',     640, 430) },
      { legende: 'Fève de cacao',        traduction: 'Cocoa pod',             imageUrl: P('cacao',      640, 430) },
    ],
  },
];

const TRESORS = [
  // BAOULÉ
  { sourceEthnique:'baoule',  seuilXp:0,   emoji:'🎭', titre:'Masque Goli',          typeObjet:'Masque cérémoniel',     matiere:'Bois de fromager peint',     contenu:"Kplé kplé ni, wo di, wo tra. Goli flan, ɔ kɔ tra man kɔkɔ.",                  traduction:"Le Goli est dansé lors des funérailles. Il symbolise la force vitale transmise aux vivants par les ancêtres.", imageUrl:`${WK}/f/fd/Mask_Baoule_Louvre_71-1966-54.jpg/480px-Mask_Baoule_Louvre_71-1966-54.jpg` },
  { sourceEthnique:'baoule',  seuilXp:80,  emoji:'🧣', titre:'Pagne Kita',            typeObjet:'Textile traditionnel',  matiere:'Coton tissé à la main',      contenu:"Kita klotɔ su, bla su a a bo n'da siɛn. Sran kɔkɔ wla.",                    traduction:"Le pagne Kita est tissé par les femmes. Chaque motif géométrique porte un proverbe.",                           imageUrl:`${WK}/6/6c/GhanaKente.jpg/640px-GhanaKente.jpg` },
  { sourceEthnique:'baoule',  seuilXp:200, emoji:'🗿', titre:'Statuette Blolo Bian',  typeObjet:'Sculpture rituelle',    matiere:'Bois et pigments naturels',  contenu:"Blolo bian nin blolo bla, ɔ tra ɔ fi. Sran ɔ wla wuliɛ.",                  traduction:"La Blolo Bian est gardée chez soi pour entretenir une relation spirituelle avec son conjoint céleste.",        imageUrl:null },
  { sourceEthnique:'baoule',  seuilXp:400, emoji:'📿', titre:'Pendentif Akan en or',  typeObjet:'Joaillerie royale',     matiere:"Or fondu à la cire perdue",  contenu:"Akan wawɔ, srɛfuɛ, flɛ wɔ nin kɛkɛ. Ɔ yɛ famiɛn mun'yɛ.",              traduction:"Fondu selon la technique de la cire perdue héritée des Ashanti, ce bijou royal ne pouvait être porté que par les chefs.", imageUrl:`${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg` },
  // DIOULA
  { sourceEthnique:'dioula',  seuilXp:0,   emoji:'⚖️', titre:'Balance de Kong',       typeObjet:'Outil de commerce',    matiere:'Laiton et cuir tanné',       contenu:"Kong tana, sɛbɛ sara, ji bɔgɔ. Warankɛla ka kɛlɛ kɛ.",                   traduction:"Kong rayonnait jusqu'au Sahara. Cette balance mesurait l'or et les noix de kola avec précision.",              imageUrl:`${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg` },
  { sourceEthnique:'dioula',  seuilXp:80,  emoji:'🪬', titre:'Calebasse gravée',       typeObjet:'Récipient cérémoniel', matiere:'Cucurbitacée gravée',         contenu:"Wotoro kɛlɛn, ka sira wele. Warankɛla ɲɛ ka kɛ.",                        traduction:"Les motifs géométriques gravés racontent les routes commerciales du porteur.",                                  imageUrl:`${WK}/9/94/African_Pottery.jpg/640px-African_Pottery.jpg` },
  { sourceEthnique:'dioula',  seuilXp:200, emoji:'👘', titre:'Grand boubou brodé',     typeObjet:'Vêtement de prestige', matiere:"Bazin riche et fil d'or",    contenu:"Boubou, ka nyi, ka ɲɛ. Warankɛla ka ɲɛ ka kɛ.",                          traduction:"Le grand boubou à broderie est le signe de la réussite du commerçant.",                                        imageUrl:`${WK}/6/6c/GhanaKente.jpg/640px-GhanaKente.jpg` },
  { sourceEthnique:'dioula',  seuilXp:400, emoji:'🎸', titre:'Kora miniature',         typeObjet:'Instrument sacré',     matiere:'Calebasse, peau et 21 cordes', contenu:"Kora dɔ, jeli ka kumaben, ka ɲɛ ka kɛ. Manden sira.",                  traduction:"La kora à 21 cordes est l'instrument des griots Mandé, gardiens de la mémoire orale.",                        imageUrl:null },
  // SÉNOUFO
  { sourceEthnique:'senoufo', seuilXp:0,   emoji:'🦅', titre:'Sculpture Deble',        typeObjet:'Figure rituelle Poro', matiere:'Bois de rônier',              contenu:"Deble, Poro sanɔgɔ. Kpiɛmbele ka sɛ, tyeli ka sɛ.",                      traduction:"La sculpture Deble est portée lors des cérémonies du Poro. Elle représente l'ancêtre fondateur.",              imageUrl:`${WK}/4/4a/Senufo_figure_Louvre_71-1916-60.jpg/480px-Senufo_figure_Louvre_71-1916-60.jpg` },
  { sourceEthnique:'senoufo', seuilXp:80,  emoji:'🐦', titre:"Masque Kpeliye'e",       typeObjet:'Masque facial',        matiere:'Bois et métal',               contenu:"Kpeliye'e, tyolo sɔrɔ, pye sɔrɔ. Poro ka tyeli.",                       traduction:"Le masque Kpeliye'e guide l'âme vers les ancêtres lors des funérailles.",                                     imageUrl:`${WK}/4/4a/Senufo_figure_Louvre_71-1916-60.jpg/480px-Senufo_figure_Louvre_71-1916-60.jpg` },
  { sourceEthnique:'senoufo', seuilXp:200, emoji:'🏺', titre:'Corne à libation',       typeObjet:'Objet rituel',         matiere:'Ivoire sculpté',              contenu:"Tyolo ko, pye ko, Poro ka sɛ. Kamali dɛ.",                               traduction:"La corne à libation en ivoire est utilisée pour offrir des boissons aux ancêtres lors du Poro.",              imageUrl:null },
  // BÉTÉ
  { sourceEthnique:'bete',    seuilXp:0,   emoji:'🎭', titre:'Masque Gbéa',            typeObjet:'Masque de guerre',     matiere:'Bois et fibres végétales',   contenu:"Gbéa, wlɔkɔ, wlɛɛ. Kpan nya, kpan nya di.",                             traduction:"Le masque Gbéa était porté par les guerriers Bété avant la bataille.",                                         imageUrl:`${WK}/f/fd/Mask_Baoule_Louvre_71-1966-54.jpg/480px-Mask_Baoule_Louvre_71-1966-54.jpg` },
  { sourceEthnique:'bete',    seuilXp:80,  emoji:'🥁', titre:'Gong de palabre',        typeObjet:'Instrument communautaire', matiere:'Bronze fondu',            contenu:"Gɔng gbla, man kɔ. Nyɔnɔ kɔ, sran kɔ tra man.",                         traduction:"Le gong de palabre convoque l'assemblée du village. Son son porte loin dans la forêt.",                      imageUrl:null },
  // AGNI
  { sourceEthnique:'agni',    seuilXp:0,   emoji:'👑', titre:'Trône royal Agni',       typeObjet:'Siège de pouvoir',     matiere:"Bois sculpté et feuilles d'or", contenu:"Nana bia, famiɛn bia, asɛndua. Agni man famiɛn.",                      traduction:"Le trône royal est le symbole suprême de l'autorité Agni. Il ne touche jamais le sol.",                      imageUrl:null },
  { sourceEthnique:'agni',    seuilXp:200, emoji:'🏅', titre:'Médaillon pectoral',     typeObjet:'Insigne de noblesse',  matiere:'Or battu et incrusté',        contenu:"Kɔnkɔ, famiɛn mun, asɛndua. Agni ɲɔnna, sran ɔ wla.",                  traduction:"Ce médaillon en or était porté sur la poitrine par les nobles Agni lors des grandes cérémonies.",             imageUrl:`${WK}/5/5c/Akan_gold_weight.jpg/640px-Akan_gold_weight.jpg` },
];

router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const results = { galleries: [], tresors: [], skipped: 0 };

    // ── Galeries (create ou update) ───────────────────────────────────────────
    for (const [i, gal] of GALLERIES.entries()) {
      let gallery = await prisma.imageGallery.findFirst({ where: { titre: gal.titre } });

      if (gallery) {
        // Mise à jour cover + reset des images (nouvelles URLs)
        await prisma.imageGallery.update({ where: { id: gallery.id }, data: { coverUrl: gal.coverUrl } });
        await prisma.galleryImage.deleteMany({ where: { galleryId: gallery.id } });
      } else {
        gallery = await prisma.imageGallery.create({
          data: { rubrique: gal.rubrique, titre: gal.titre, description: gal.description, coverUrl: gal.coverUrl, ordre: i, status: 'PUBLISHED' },
        });
      }

      for (const [j, img] of gal.images.entries()) {
        await prisma.galleryImage.create({
          data: { galleryId: gallery.id, imageUrl: img.imageUrl, legende: img.legende, traduction: img.traduction, ordre: j + 1 },
        });
      }
      results.galleries.push({ titre: gal.titre, images: gal.images.length });
    }

    // ── Trésors ───────────────────────────────────────────────────────────────
    const languages = await prisma.language.findMany({ select: { id: true, code: true } });
    const langByCode = Object.fromEntries(languages.map(l => [l.code, l.id]));

    for (const t of TRESORS) {
      const existing = await prisma.culturalItem.findFirst({ where: { type: 'TRESOR', titre: t.titre } });
      if (existing) { results.skipped++; continue; }

      await prisma.culturalItem.create({
        data: {
          languageId:     langByCode[t.sourceEthnique] || null,
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
      results.tresors.push({ titre: t.titre, ethnie: t.sourceEthnique });
    }

    res.json({
      success: true,
      message: `Seed terminé — ${results.galleries.length} galerie(s), ${results.tresors.length} trésor(s) créé(s), ${results.skipped} déjà existant(s).`,
      results,
    });
  } catch (err) { next(err); }
});

module.exports = router;
