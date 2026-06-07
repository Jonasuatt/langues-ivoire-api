/**
 * seed-vocabulaire-etendu.js
 * Enrichit le dictionnaire : +45 mots par langue sur 6 catégories
 * Corps humain · Animaux · Chiffres · Couleurs · Verbes · Émotions
 * Total cible : 580+ mots (9 langues × ~65 mots)
 *
 * Usage : node prisma/seed-vocabulaire-etendu.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES ÉTENDUES PAR LANGUE
// ─────────────────────────────────────────────────────────────────────────────

const VOCABULAIRE = {

  // ════════════════════════════════════════════════════════════════════════════
  baoule: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Kun',      transcription: 'kun',      traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Nyo',      transcription: 'nyo',      traduction: 'Deux (2)',  categorie: 'chiffres' },
    { mot: 'Sa',       transcription: 'sa',       traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Nnan',     transcription: 'nnan',     traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Nnu',      transcription: 'nnu',      traduction: 'Cinq (5)',  categorie: 'chiffres' },
    { mot: 'Nsia',     transcription: 'nsia',     traduction: 'Six (6)',   categorie: 'chiffres' },
    { mot: 'Nsonvue',  transcription: 'nsonvue',  traduction: 'Sept (7)',  categorie: 'chiffres' },
    { mot: 'Mɔnwɔ',   transcription: 'mɔnwɔ',   traduction: 'Huit (8)',  categorie: 'chiffres' },
    { mot: 'Ngwlan',   transcription: 'ngwlan',   traduction: 'Neuf (9)',  categorie: 'chiffres' },
    { mot: 'Blu',      transcription: 'blu',      traduction: 'Dix (10)', categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Ti',       transcription: 'ti',       traduction: 'Tête',      categorie: 'corps' },
    { mot: 'Nyin',     transcription: 'nyin',     traduction: 'Œil',       categorie: 'corps' },
    { mot: 'Nuan',     transcription: 'nuan',     traduction: 'Bouche',    categorie: 'corps' },
    { mot: 'Wlɛ',     transcription: 'wlɛ',     traduction: 'Main',      categorie: 'corps' },
    { mot: 'Nan',      transcription: 'nan',      traduction: 'Pied',      categorie: 'corps' },
    { mot: 'Ble',      transcription: 'ble',      traduction: 'Ventre',    categorie: 'corps' },
    { mot: 'Kpɔ',     transcription: 'kpɔ',     traduction: 'Dos',       categorie: 'corps' },
    { mot: 'Tie',      transcription: 'tie',      traduction: 'Cœur',      categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Oya',      transcription: 'oya',      traduction: 'Chien',     categorie: 'animaux' },
    { mot: 'Gbakpa',   transcription: 'gbakpa',   traduction: 'Chat',      categorie: 'animaux' },
    { mot: 'Klɔ',     transcription: 'klɔ',     traduction: 'Lion',      categorie: 'animaux' },
    { mot: 'Waka',     transcription: 'waka',     traduction: 'Oiseau',    categorie: 'animaux' },
    { mot: 'Nanzuɛ',  transcription: 'nanzuɛ',  traduction: 'Serpent',   categorie: 'animaux' },
    { mot: 'Ayɔwɔ',   transcription: 'ayɔwɔ',   traduction: 'Éléphant',  categorie: 'animaux' },
    { mot: 'Kuɔ',     transcription: 'kuɔ',     traduction: 'Chèvre',    categorie: 'animaux' },
    { mot: 'Blɔkwɛ',  transcription: 'blɔkwɛ',  traduction: 'Mouton',    categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Fuɛfuɛ',  transcription: 'fuɛfuɛ',  traduction: 'Blanc',     categorie: 'couleurs' },
    { mot: 'Tuntun',   transcription: 'tuntun',   traduction: 'Noir',      categorie: 'couleurs' },
    { mot: 'Kokɔkɔ',  transcription: 'kokɔkɔ',  traduction: 'Rouge',     categorie: 'couleurs' },
    { mot: 'Yɛklɛ',   transcription: 'yɛklɛ',   traduction: 'Vert',      categorie: 'couleurs' },
    { mot: 'Wuliwuli', transcription: 'wuliwuli', traduction: 'Jaune',     categorie: 'couleurs' },
    { mot: 'Blubluu',  transcription: 'blubluu',  traduction: 'Bleu',      categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Ko',       transcription: 'ko',       traduction: 'Venir',     categorie: 'verbes', exemplePhrase: 'Ko wa !' },
    { mot: 'Kɔ',      transcription: 'kɔ',      traduction: 'Aller',     categorie: 'verbes' },
    { mot: 'Dɔ',      transcription: 'dɔ',      traduction: 'Aimer',     categorie: 'verbes' },
    { mot: 'Kle',      transcription: 'kle',      traduction: 'Voir',      categorie: 'verbes' },
    { mot: 'Ti',       transcription: 'ti',       traduction: 'Entendre',  categorie: 'verbes' },
    { mot: 'Fle',      transcription: 'fle',      traduction: 'Acheter',   categorie: 'verbes' },
    { mot: 'To',       transcription: 'to',       traduction: 'Dormir',    categorie: 'verbes' },
    { mot: 'Mli',      transcription: 'mli',      traduction: 'Parler',    categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Anwannwan', transcription: 'anwannwan', traduction: 'Joie / Content', categorie: 'emotions' },
    { mot: 'Awaawaa',   transcription: 'awaawaa',   traduction: 'Tristesse',      categorie: 'emotions' },
    { mot: 'Sran kɔ',  transcription: 'sran kɔ',  traduction: 'Peur',           categorie: 'emotions' },
    { mot: 'Ngwlɛ',    transcription: 'ngwlɛ',    traduction: 'Colère',         categorie: 'emotions' },
    { mot: 'Wlɔ',     transcription: 'wlɔ',     traduction: 'Fatigue',        categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  dioula: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Kelen',      transcription: 'kelen',      traduction: 'Un (1)',     categorie: 'chiffres' },
    { mot: 'Fila',       transcription: 'fila',       traduction: 'Deux (2)',   categorie: 'chiffres' },
    { mot: 'Saba',       transcription: 'saba',       traduction: 'Trois (3)',  categorie: 'chiffres' },
    { mot: 'Naani',      transcription: 'naani',      traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Duuru',      transcription: 'duuru',      traduction: 'Cinq (5)',   categorie: 'chiffres' },
    { mot: 'Wɔɔrɔ',    transcription: 'wɔɔrɔ',    traduction: 'Six (6)',    categorie: 'chiffres' },
    { mot: 'Wolonwula',  transcription: 'wolonwula',  traduction: 'Sept (7)',   categorie: 'chiffres' },
    { mot: 'Segin',      transcription: 'segin',      traduction: 'Huit (8)',   categorie: 'chiffres' },
    { mot: 'Kɔnɔntɔn', transcription: 'kɔnɔntɔn', traduction: 'Neuf (9)',   categorie: 'chiffres' },
    { mot: 'Tan',        transcription: 'tan',        traduction: 'Dix (10)',  categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Kun',     transcription: 'kun',     traduction: 'Tête',    categorie: 'corps' },
    { mot: 'Yɛlɛn',  transcription: 'yɛlɛn',  traduction: 'Œil',     categorie: 'corps' },
    { mot: 'Daa',     transcription: 'daa',     traduction: 'Bouche',  categorie: 'corps' },
    { mot: 'Bolo',    transcription: 'bolo',    traduction: 'Main',    categorie: 'corps' },
    { mot: 'Seen',    transcription: 'seen',    traduction: 'Pied',    categorie: 'corps' },
    { mot: 'Kɔnɔ',  transcription: 'kɔnɔ',  traduction: 'Ventre',  categorie: 'corps' },
    { mot: 'Fali',    transcription: 'fali',    traduction: 'Dos',     categorie: 'corps' },
    { mot: 'Tigi',    transcription: 'tigi',    traduction: 'Cœur',    categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Wulu',    transcription: 'wulu',    traduction: 'Chien',    categorie: 'animaux' },
    { mot: 'Jakuma',  transcription: 'jakuma',  traduction: 'Chat',     categorie: 'animaux' },
    { mot: 'Wara',    transcription: 'wara',    traduction: 'Lion',     categorie: 'animaux' },
    { mot: 'Kɔnɔ',  transcription: 'kɔnɔ',  traduction: 'Oiseau',   categorie: 'animaux' },
    { mot: 'Jini',    transcription: 'jini',    traduction: 'Serpent',  categorie: 'animaux' },
    { mot: 'Sigi',    transcription: 'sigi',    traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Bɛ',     transcription: 'bɛ',     traduction: 'Chèvre',   categorie: 'animaux' },
    { mot: 'Saga',    transcription: 'saga',    traduction: 'Mouton',   categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Jɛ',     transcription: 'jɛ',     traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Fin',     transcription: 'fin',     traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Mɛnkɛ', transcription: 'mɛnkɛ', traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Nɔgɔ',  transcription: 'nɔgɔ',  traduction: 'Gris',   categorie: 'couleurs' },
    { mot: 'Gelen',   transcription: 'gelen',   traduction: 'Jaune',  categorie: 'couleurs' },
    { mot: 'Buluku',  transcription: 'buluku',  traduction: 'Bleu',   categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Na',      transcription: 'na',      traduction: 'Venir',   categorie: 'verbes', exemplePhrase: 'I ka na.' },
    { mot: 'Taa',     transcription: 'taa',     traduction: 'Aller',   categorie: 'verbes' },
    { mot: 'Dɔn',    transcription: 'dɔn',    traduction: 'Savoir',  categorie: 'verbes' },
    { mot: 'Ye',      transcription: 'ye',      traduction: 'Voir',    categorie: 'verbes' },
    { mot: 'Mɛn',    transcription: 'mɛn',    traduction: 'Entendre',categorie: 'verbes' },
    { mot: 'San',     transcription: 'san',     traduction: 'Acheter', categorie: 'verbes' },
    { mot: 'Su',      transcription: 'su',      traduction: 'Dormir',  categorie: 'verbes' },
    { mot: 'Kuma',    transcription: 'kuma',    traduction: 'Parler',  categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Tɔɔrɔ', transcription: 'tɔɔrɔ', traduction: 'Douleur / Problème', categorie: 'emotions' },
    { mot: 'Sɛwɛ',  transcription: 'sɛwɛ',  traduction: 'Joie',               categorie: 'emotions' },
    { mot: 'Siran',   transcription: 'siran',   traduction: 'Peur',               categorie: 'emotions' },
    { mot: 'Dimi',    transcription: 'dimi',    traduction: 'Tristesse',          categorie: 'emotions' },
    { mot: 'Nɔɔri', transcription: 'nɔɔri', traduction: 'Colère',             categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  bete: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Dɔ',    transcription: 'dɔ',    traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Yɛ',   transcription: 'yɛ',   traduction: 'Deux (2)',  categorie: 'chiffres' },
    { mot: 'Tan',   transcription: 'tan',   traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Naan',  transcription: 'naan',  traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Nunu',  transcription: 'nunu',  traduction: 'Cinq (5)',  categorie: 'chiffres' },
    { mot: 'Sia',   transcription: 'sia',   traduction: 'Six (6)',   categorie: 'chiffres' },
    { mot: 'Son',   transcription: 'son',   traduction: 'Sept (7)',  categorie: 'chiffres' },
    { mot: 'Lɔ',   transcription: 'lɔ',   traduction: 'Huit (8)',  categorie: 'chiffres' },
    { mot: 'Ngwle', transcription: 'ngwle', traduction: 'Neuf (9)',  categorie: 'chiffres' },
    { mot: 'Blu',   transcription: 'blu',   traduction: 'Dix (10)', categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Ti',    transcription: 'ti',    traduction: 'Tête',   categorie: 'corps' },
    { mot: 'Nyin',  transcription: 'nyin',  traduction: 'Œil',    categorie: 'corps' },
    { mot: 'Nua',   transcription: 'nua',   traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Blɔ',  transcription: 'blɔ',  traduction: 'Main',   categorie: 'corps' },
    { mot: 'Nan',   transcription: 'nan',   traduction: 'Pied',   categorie: 'corps' },
    { mot: 'Blo',   transcription: 'blo',   traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Kpla',  transcription: 'kpla',  traduction: 'Dos',    categorie: 'corps' },
    { mot: 'Gblɔ', transcription: 'gblɔ', traduction: 'Cœur',   categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Nyo',   transcription: 'nyo',   traduction: 'Chien',    categorie: 'animaux' },
    { mot: 'Gbli',  transcription: 'gbli',  traduction: 'Chat',     categorie: 'animaux' },
    { mot: 'Gbɔ',  transcription: 'gbɔ',  traduction: 'Buffle',   categorie: 'animaux' },
    { mot: 'Nyin',  transcription: 'nyin',  traduction: 'Oiseau',   categorie: 'animaux' },
    { mot: 'Gbli',  transcription: 'gbli',  traduction: 'Serpent',  categorie: 'animaux' },
    { mot: 'Pɔn',  transcription: 'pɔn',  traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Klɔ',  transcription: 'klɔ',  traduction: 'Chèvre',   categorie: 'animaux' },
    { mot: 'Bli',   transcription: 'bli',   traduction: 'Mouton',   categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Fufu',  transcription: 'fufu',  traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Tun',   transcription: 'tun',   traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Koko',  transcription: 'koko',  traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Gbɛ',  transcription: 'gbɛ',  traduction: 'Vert',   categorie: 'couleurs' },
    { mot: 'Yele',  transcription: 'yele',  traduction: 'Jaune',  categorie: 'couleurs' },
    { mot: 'Blo',   transcription: 'blo',   traduction: 'Bleu',   categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Lo',    transcription: 'lo',    traduction: 'Venir',  categorie: 'verbes' },
    { mot: 'Dja',   transcription: 'dja',   traduction: 'Aller',  categorie: 'verbes' },
    { mot: 'Dɔ',   transcription: 'dɔ',   traduction: 'Aimer',  categorie: 'verbes' },
    { mot: 'Le',    transcription: 'le',    traduction: 'Voir',   categorie: 'verbes' },
    { mot: 'Gbɔ',  transcription: 'gbɔ',  traduction: 'Boire',  categorie: 'verbes' },
    { mot: 'Di',    transcription: 'di',    traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Zɔ',   transcription: 'zɔ',   traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Gblo',  transcription: 'gblo',  traduction: 'Parler', categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Nyɛ',  transcription: 'nyɛ',  traduction: 'Joie',      categorie: 'emotions' },
    { mot: 'Kpli',  transcription: 'kpli',  traduction: 'Tristesse', categorie: 'emotions' },
    { mot: 'Gbɔ',  transcription: 'gbɔ',  traduction: 'Peur',      categorie: 'emotions' },
    { mot: 'Wlɔ',  transcription: 'wlɔ',  traduction: 'Colère',    categorie: 'emotions' },
    { mot: 'Bly',   transcription: 'bly',   traduction: 'Fatigue',   categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  senoufo: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Kɔlɔ',   transcription: 'kɔlɔ',   traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Tya',     transcription: 'tya',     traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Taan',    transcription: 'taan',    traduction: 'Trois (3)',categorie: 'chiffres' },
    { mot: 'Naŋ',    transcription: 'naŋ',    traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Kaŋ',    transcription: 'kaŋ',    traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Pɛɛ',   transcription: 'pɛɛ',   traduction: 'Six (6)',  categorie: 'chiffres' },
    { mot: 'Loŋ',   transcription: 'loŋ',   traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Yɛŋ',   transcription: 'yɛŋ',   traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Kɔŋkɔn', transcription: 'kɔŋkɔn', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Tyen',    transcription: 'tyen',    traduction: 'Dix (10)',categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Kun',   transcription: 'kun',   traduction: 'Tête',   categorie: 'corps' },
    { mot: 'Nyiin', transcription: 'nyiin', traduction: 'Œil',    categorie: 'corps' },
    { mot: 'Da',    transcription: 'da',    traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Bolo',  transcription: 'bolo',  traduction: 'Main',   categorie: 'corps' },
    { mot: 'Seen',  transcription: 'seen',  traduction: 'Pied',   categorie: 'corps' },
    { mot: 'Gbɛ',  transcription: 'gbɛ',  traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Pala',  transcription: 'pala',  traduction: 'Dos',    categorie: 'corps' },
    { mot: 'Sigi',  transcription: 'sigi',  traduction: 'Cœur',   categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Wulu',  transcription: 'wulu',  traduction: 'Chien',    categorie: 'animaux' },
    { mot: 'Gosi',  transcription: 'gosi',  traduction: 'Chat',     categorie: 'animaux' },
    { mot: 'Wara',  transcription: 'wara',  traduction: 'Lion',     categorie: 'animaux' },
    { mot: 'Nyiin', transcription: 'nyiin', traduction: 'Oiseau',   categorie: 'animaux' },
    { mot: 'Gbeli', transcription: 'gbeli', traduction: 'Serpent',  categorie: 'animaux' },
    { mot: 'Sɔŋ',  transcription: 'sɔŋ',  traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Bɛ',   transcription: 'bɛ',   traduction: 'Chèvre',   categorie: 'animaux' },
    { mot: 'Piini', transcription: 'piini', traduction: 'Mouton',   categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Tyɛɛ', transcription: 'tyɛɛ', traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Finŋ', transcription: 'finŋ', traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Kokoŋ',transcription: 'kokoŋ',traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Yilen', transcription: 'yilen', traduction: 'Vert',  categorie: 'couleurs' },
    { mot: 'Gelen', transcription: 'gelen', traduction: 'Jaune', categorie: 'couleurs' },
    { mot: 'Bulu',  transcription: 'bulu',  traduction: 'Bleu',  categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Na',    transcription: 'na',    traduction: 'Venir',  categorie: 'verbes' },
    { mot: 'Taa',   transcription: 'taa',   traduction: 'Aller',  categorie: 'verbes' },
    { mot: 'Dɔ',   transcription: 'dɔ',   traduction: 'Aimer',  categorie: 'verbes' },
    { mot: 'Ye',    transcription: 'ye',    traduction: 'Voir',   categorie: 'verbes' },
    { mot: 'Kɔ',   transcription: 'kɔ',   traduction: 'Boire',  categorie: 'verbes' },
    { mot: 'Di',    transcription: 'di',    traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Su',    transcription: 'su',    traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Yii',   transcription: 'yii',   traduction: 'Parler', categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Sɛwɛ', transcription: 'sɛwɛ', traduction: 'Joie',      categorie: 'emotions' },
    { mot: 'Tɔɔrɔ',transcription: 'tɔɔrɔ',traduction: 'Tristesse', categorie: 'emotions' },
    { mot: 'Siran', transcription: 'siran', traduction: 'Peur',      categorie: 'emotions' },
    { mot: 'Gbeli', transcription: 'gbeli', traduction: 'Colère',    categorie: 'emotions' },
    { mot: 'Tyɛ',  transcription: 'tyɛ',  traduction: 'Fatigue',   categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  agni: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Baako',    transcription: 'baako',   traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Mmienu',   transcription: 'mmienu',  traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Mmiɛnsa', transcription: 'mmiɛnsa',traduction: 'Trois (3)',categorie: 'chiffres' },
    { mot: 'Ɛnan',    transcription: 'ɛnan',    traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Enum',     transcription: 'enum',    traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Nsia',     transcription: 'nsia',    traduction: 'Six (6)',  categorie: 'chiffres' },
    { mot: 'Nson',     transcription: 'nson',    traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Mɔwɔ',   transcription: 'mɔwɔ',   traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Nkron',    transcription: 'nkron',   traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Edu',      transcription: 'edu',     traduction: 'Dix (10)',categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Etiri',  transcription: 'etiri',  traduction: 'Tête',   categorie: 'corps' },
    { mot: 'Aniwa',  transcription: 'aniwa',  traduction: 'Œil',    categorie: 'corps' },
    { mot: 'Ano',    transcription: 'ano',    traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Nsa',    transcription: 'nsa',    traduction: 'Main',   categorie: 'corps' },
    { mot: 'Nan',    transcription: 'nan',    traduction: 'Pied',   categorie: 'corps' },
    { mot: 'Yam',    transcription: 'yam',    traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Akyi',   transcription: 'akyi',   traduction: 'Dos',    categorie: 'corps' },
    { mot: 'Koma',   transcription: 'koma',   traduction: 'Cœur',   categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Okraman',transcription: 'okraman',traduction: 'Chien',   categorie: 'animaux' },
    { mot: 'Agyinan', transcription: 'agyinan',traduction: 'Chat',    categorie: 'animaux' },
    { mot: 'Gyata',   transcription: 'gyata',  traduction: 'Lion',    categorie: 'animaux' },
    { mot: 'Anoma',   transcription: 'anoma',  traduction: 'Oiseau',  categorie: 'animaux' },
    { mot: 'Owo',     transcription: 'owo',    traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Esono',   transcription: 'esono',  traduction: 'Éléphant',categorie: 'animaux' },
    { mot: 'Abirekyi',transcription: 'abirekyi',traduction: 'Chèvre', categorie: 'animaux' },
    { mot: 'Odwan',   transcription: 'odwan',  traduction: 'Mouton',  categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Fufuo',  transcription: 'fufuo',  traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Tuntum', transcription: 'tuntum', traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Kɔkɔɔ', transcription: 'kɔkɔɔ', traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Ahabam', transcription: 'ahabam', traduction: 'Vert',   categorie: 'couleurs' },
    { mot: 'Akokoɔ',transcription: 'akokoɔ',traduction: 'Jaune',  categorie: 'couleurs' },
    { mot: 'Bluu',   transcription: 'bluu',   traduction: 'Bleu',   categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Ba',    transcription: 'ba',    traduction: 'Venir',  categorie: 'verbes' },
    { mot: 'Kɔ',   transcription: 'kɔ',   traduction: 'Aller',  categorie: 'verbes' },
    { mot: 'Dɔ',   transcription: 'dɔ',   traduction: 'Aimer',  categorie: 'verbes' },
    { mot: 'Hu',    transcription: 'hu',    traduction: 'Voir',   categorie: 'verbes' },
    { mot: 'Nom',   transcription: 'nom',   traduction: 'Boire',  categorie: 'verbes' },
    { mot: 'Di',    transcription: 'di',    traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Da',    transcription: 'da',    traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Kasa',  transcription: 'kasa',  traduction: 'Parler', categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Ahosɛpɛ',transcription: 'ahosɛpɛ',traduction: 'Joie',      categorie: 'emotions' },
    { mot: 'Werɛhow',transcription: 'werɛhow',traduction: 'Tristesse', categorie: 'emotions' },
    { mot: 'Suro',    transcription: 'suro',    traduction: 'Peur',      categorie: 'emotions' },
    { mot: 'Bo fuw',  transcription: 'bo fuw',  traduction: 'Colère',    categorie: 'emotions' },
    { mot: 'Afɔre',  transcription: 'afɔre',  traduction: 'Fatigue',   categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  gouro: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Do',     transcription: 'do',     traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Yɛ',    transcription: 'yɛ',    traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Tan',    transcription: 'tan',    traduction: 'Trois (3)',categorie: 'chiffres' },
    { mot: 'Naan',   transcription: 'naan',   traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Nun',    transcription: 'nun',    traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Sia',    transcription: 'sia',    traduction: 'Six (6)',  categorie: 'chiffres' },
    { mot: 'Sɔn',   transcription: 'sɔn',   traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Yi lɔ', transcription: 'yi lɔ', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Gbɛn',  transcription: 'gbɛn',  traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Blo',    transcription: 'blo',    traduction: 'Dix (10)',categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Ti',    transcription: 'ti',    traduction: 'Tête',   categorie: 'corps' },
    { mot: 'Yɛ',   transcription: 'yɛ',   traduction: 'Œil',    categorie: 'corps' },
    { mot: 'Nu',    transcription: 'nu',    traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Bolo',  transcription: 'bolo',  traduction: 'Main',   categorie: 'corps' },
    { mot: 'Naan',  transcription: 'naan',  traduction: 'Pied',   categorie: 'corps' },
    { mot: 'Klɛ',  transcription: 'klɛ',  traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Gblo',  transcription: 'gblo',  traduction: 'Dos',    categorie: 'corps' },
    { mot: 'Tie',   transcription: 'tie',   traduction: 'Cœur',   categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Wulu',  transcription: 'wulu',  traduction: 'Chien',    categorie: 'animaux' },
    { mot: 'Gosi',  transcription: 'gosi',  traduction: 'Chat',     categorie: 'animaux' },
    { mot: 'Kla',   transcription: 'kla',   traduction: 'Lion',     categorie: 'animaux' },
    { mot: 'Yɛle',  transcription: 'yɛle',  traduction: 'Oiseau',   categorie: 'animaux' },
    { mot: 'Gble',  transcription: 'gble',  traduction: 'Serpent',  categorie: 'animaux' },
    { mot: 'Pɔn',  transcription: 'pɔn',  traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Bɛ',   transcription: 'bɛ',   traduction: 'Chèvre',   categorie: 'animaux' },
    { mot: 'Bii',   transcription: 'bii',   traduction: 'Mouton',   categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Fɛɛ',  transcription: 'fɛɛ',  traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Tun',   transcription: 'tun',   traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Koko',  transcription: 'koko',  traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Yile',  transcription: 'yile',  traduction: 'Vert',   categorie: 'couleurs' },
    { mot: 'Wuli',  transcription: 'wuli',  traduction: 'Jaune',  categorie: 'couleurs' },
    { mot: 'Blu',   transcription: 'blu',   traduction: 'Bleu',   categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Na',    transcription: 'na',    traduction: 'Venir',  categorie: 'verbes' },
    { mot: 'Dja',   transcription: 'dja',   traduction: 'Aller',  categorie: 'verbes' },
    { mot: 'Dɔ',   transcription: 'dɔ',   traduction: 'Aimer',  categorie: 'verbes' },
    { mot: 'Yɛn',  transcription: 'yɛn',  traduction: 'Voir',   categorie: 'verbes' },
    { mot: 'Min',   transcription: 'min',   traduction: 'Boire',  categorie: 'verbes' },
    { mot: 'Di',    transcription: 'di',    traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Zɔ',   transcription: 'zɔ',   traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Gba',   transcription: 'gba',   traduction: 'Parler', categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Nyɛ',  transcription: 'nyɛ',  traduction: 'Joie',      categorie: 'emotions' },
    { mot: 'Gblɔ', transcription: 'gblɔ', traduction: 'Tristesse', categorie: 'emotions' },
    { mot: 'Gbɔ',  transcription: 'gbɔ',  traduction: 'Peur',      categorie: 'emotions' },
    { mot: 'Kpli',  transcription: 'kpli',  traduction: 'Colère',    categorie: 'emotions' },
    { mot: 'Wlɔ',  transcription: 'wlɔ',  traduction: 'Fatigue',   categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  guere: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Do',    transcription: 'do',    traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Yi',    transcription: 'yi',    traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Tan',   transcription: 'tan',   traduction: 'Trois (3)',categorie: 'chiffres' },
    { mot: 'Naan',  transcription: 'naan',  traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Nunu',  transcription: 'nunu',  traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Sian',  transcription: 'sian',  traduction: 'Six (6)',  categorie: 'chiffres' },
    { mot: 'Lɔŋ',  transcription: 'lɔŋ',  traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Yele',  transcription: 'yele',  traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Gbɛn', transcription: 'gbɛn', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Blo',   transcription: 'blo',   traduction: 'Dix (10)',categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Ti',    transcription: 'ti',    traduction: 'Tête',   categorie: 'corps' },
    { mot: 'Nyɔ',  transcription: 'nyɔ',  traduction: 'Œil',    categorie: 'corps' },
    { mot: 'Nua',   transcription: 'nua',   traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Gbla',  transcription: 'gbla',  traduction: 'Main',   categorie: 'corps' },
    { mot: 'Nan',   transcription: 'nan',   traduction: 'Pied',   categorie: 'corps' },
    { mot: 'Blo',   transcription: 'blo',   traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Kpɔ',  transcription: 'kpɔ',  traduction: 'Dos',    categorie: 'corps' },
    { mot: 'Tie',   transcription: 'tie',   traduction: 'Cœur',   categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Waa',   transcription: 'waa',   traduction: 'Chien',    categorie: 'animaux' },
    { mot: 'Nyo',   transcription: 'nyo',   traduction: 'Chat',     categorie: 'animaux' },
    { mot: 'Kla',   transcription: 'kla',   traduction: 'Lion',     categorie: 'animaux' },
    { mot: 'Nyin',  transcription: 'nyin',  traduction: 'Oiseau',   categorie: 'animaux' },
    { mot: 'Gbɛli', transcription: 'gbɛli', traduction: 'Serpent',  categorie: 'animaux' },
    { mot: 'Sɔŋ',  transcription: 'sɔŋ',  traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Bɛ',   transcription: 'bɛ',   traduction: 'Chèvre',   categorie: 'animaux' },
    { mot: 'Bii',   transcription: 'bii',   traduction: 'Mouton',   categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Fɛfɛ',  transcription: 'fɛfɛ',  traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Tuntun', transcription: 'tuntun', traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Kɔkɔ',  transcription: 'kɔkɔ',  traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Gbɛ',   transcription: 'gbɛ',   traduction: 'Vert',   categorie: 'couleurs' },
    { mot: 'Yelen',  transcription: 'yelen',  traduction: 'Jaune',  categorie: 'couleurs' },
    { mot: 'Bulu',   transcription: 'bulu',   traduction: 'Bleu',   categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Lo',    transcription: 'lo',    traduction: 'Venir',  categorie: 'verbes' },
    { mot: 'Dja',   transcription: 'dja',   traduction: 'Aller',  categorie: 'verbes' },
    { mot: 'Dɔ',   transcription: 'dɔ',   traduction: 'Aimer',  categorie: 'verbes' },
    { mot: 'Lɛ',   transcription: 'lɛ',   traduction: 'Voir',   categorie: 'verbes' },
    { mot: 'Min',   transcription: 'min',   traduction: 'Boire',  categorie: 'verbes' },
    { mot: 'Di',    transcription: 'di',    traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Zɔ',   transcription: 'zɔ',   traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Gblo',  transcription: 'gblo',  traduction: 'Parler', categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Nyɛ',  transcription: 'nyɛ',  traduction: 'Joie',      categorie: 'emotions' },
    { mot: 'Gblo',  transcription: 'gblo',  traduction: 'Tristesse', categorie: 'emotions' },
    { mot: 'Gbɔ',  transcription: 'gbɔ',  traduction: 'Peur',      categorie: 'emotions' },
    { mot: 'Kpli',  transcription: 'kpli',  traduction: 'Colère',    categorie: 'emotions' },
    { mot: 'Wlo',   transcription: 'wlo',   traduction: 'Fatigue',   categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  yacouba: [
    // ── Chiffres ─────────────────────────────────────────────────────────────
    { mot: 'Dɔ',    transcription: 'dɔ',    traduction: 'Un (1)',    categorie: 'chiffres' },
    { mot: 'Yi',    transcription: 'yi',    traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Tan',   transcription: 'tan',   traduction: 'Trois (3)',categorie: 'chiffres' },
    { mot: 'Naŋ',  transcription: 'naŋ',  traduction: 'Quatre (4)',categorie: 'chiffres' },
    { mot: 'Nuŋ',  transcription: 'nuŋ',  traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Sia',   transcription: 'sia',   traduction: 'Six (6)',  categorie: 'chiffres' },
    { mot: 'Lɔŋ',  transcription: 'lɔŋ',  traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Yɛn',  transcription: 'yɛn',  traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Gbɛ',  transcription: 'gbɛ',  traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Blo',   transcription: 'blo',   traduction: 'Dix (10)',categorie: 'chiffres' },
    // ── Corps humain ─────────────────────────────────────────────────────────
    { mot: 'Ti',    transcription: 'ti',    traduction: 'Tête',   categorie: 'corps' },
    { mot: 'Nyɛ',  transcription: 'nyɛ',  traduction: 'Œil',    categorie: 'corps' },
    { mot: 'Nu',    transcription: 'nu',    traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Gba',   transcription: 'gba',   traduction: 'Main',   categorie: 'corps' },
    { mot: 'Na',    transcription: 'na',    traduction: 'Pied',   categorie: 'corps' },
    { mot: 'Blo',   transcription: 'blo',   traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Kpɔ',  transcription: 'kpɔ',  traduction: 'Dos',    categorie: 'corps' },
    { mot: 'Tie',   transcription: 'tie',   traduction: 'Cœur',   categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Waa',   transcription: 'waa',   traduction: 'Chien',    categorie: 'animaux' },
    { mot: 'Nyo',   transcription: 'nyo',   traduction: 'Chat',     categorie: 'animaux' },
    { mot: 'Kla',   transcription: 'kla',   traduction: 'Lion',     categorie: 'animaux' },
    { mot: 'Gbele', transcription: 'gbele', traduction: 'Oiseau',   categorie: 'animaux' },
    { mot: 'Gbɛli', transcription: 'gbɛli', traduction: 'Serpent',  categorie: 'animaux' },
    { mot: 'Sɔŋ',  transcription: 'sɔŋ',  traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Bɛ',   transcription: 'bɛ',   traduction: 'Chèvre',   categorie: 'animaux' },
    { mot: 'Bii',   transcription: 'bii',   traduction: 'Mouton',   categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Fɛfɛ',  transcription: 'fɛfɛ',  traduction: 'Blanc',  categorie: 'couleurs' },
    { mot: 'Tuntun', transcription: 'tuntun', traduction: 'Noir',   categorie: 'couleurs' },
    { mot: 'Kɔkɔ',  transcription: 'kɔkɔ',  traduction: 'Rouge',  categorie: 'couleurs' },
    { mot: 'Yile',   transcription: 'yile',   traduction: 'Vert',   categorie: 'couleurs' },
    { mot: 'Wuli',   transcription: 'wuli',   traduction: 'Jaune',  categorie: 'couleurs' },
    { mot: 'Blu',    transcription: 'blu',    traduction: 'Bleu',   categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Gɔ',   transcription: 'gɔ',   traduction: 'Venir',  categorie: 'verbes' },
    { mot: 'Dja',   transcription: 'dja',   traduction: 'Aller',  categorie: 'verbes' },
    { mot: 'Dɔ',   transcription: 'dɔ',   traduction: 'Aimer',  categorie: 'verbes' },
    { mot: 'Yɛn',  transcription: 'yɛn',  traduction: 'Voir',   categorie: 'verbes' },
    { mot: 'Min',   transcription: 'min',   traduction: 'Boire',  categorie: 'verbes' },
    { mot: 'Di',    transcription: 'di',    traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Zɔ',   transcription: 'zɔ',   traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Gblo',  transcription: 'gblo',  traduction: 'Parler', categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'Nyɛ',  transcription: 'nyɛ',  traduction: 'Joie',      categorie: 'emotions' },
    { mot: 'Glo',   transcription: 'glo',   traduction: 'Tristesse', categorie: 'emotions' },
    { mot: 'Gbɔ',  transcription: 'gbɔ',  traduction: 'Peur',      categorie: 'emotions' },
    { mot: 'Kpli',  transcription: 'kpli',  traduction: 'Colère',    categorie: 'emotions' },
    { mot: 'Wlo',   transcription: 'wlo',   traduction: 'Fatigue',   categorie: 'emotions' },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  nouchi: [
    // ── Chiffres (verlan & argot) ─────────────────────────────────────────────
    { mot: 'Eun',         transcription: 'eun',       traduction: 'Un (1) — argot ivoirien',      categorie: 'chiffres' },
    { mot: 'Deux',        transcription: 'dø',        traduction: 'Deux (2)',                      categorie: 'chiffres' },
    { mot: 'Trois',       transcription: 'tʁwa',      traduction: 'Trois (3)',                     categorie: 'chiffres' },
    { mot: 'Quatre',      transcription: 'katʁ',      traduction: 'Quatre (4)',                    categorie: 'chiffres' },
    { mot: 'Cinq',        transcription: 'sɛ̃k',      traduction: 'Cinq (5)',                     categorie: 'chiffres' },
    { mot: 'Bikini',      transcription: 'bikini',    traduction: 'Mille francs (1 000 FCFA)',     categorie: 'chiffres', exemplePhrase: 'Tchoquer deux bikini !' },
    { mot: 'Balle',       transcription: 'bal',       traduction: 'Cent francs (100 FCFA)',         categorie: 'chiffres', exemplePhrase: 'J\'ai plus une balle.' },
    { mot: 'Sac',         transcription: 'sak',       traduction: 'Dix mille francs (10 000 FCFA)',categorie: 'chiffres' },
    { mot: 'Zéro',        transcription: 'zero',      traduction: 'Rien / Zéro',                  categorie: 'chiffres' },
    { mot: 'Le compte',   transcription: 'lə kɔ̃t',  traduction: 'Le prix exact / le total',     categorie: 'chiffres' },
    // ── Corps humain (Nouchi) ─────────────────────────────────────────────────
    { mot: 'La caisse',   transcription: 'la kɛs',   traduction: 'Le corps / La silhouette',  categorie: 'corps', exemplePhrase: 'Il a une belle caisse !' },
    { mot: 'La cafetière',transcription: 'la kafetjɛʁ',traduction: 'La tête / Le cerveau',    categorie: 'corps' },
    { mot: 'Les gants',   transcription: 'le gɑ̃',   traduction: 'Les mains',                 categorie: 'corps' },
    { mot: 'Les pinceaux',transcription: 'le pɛ̃so',  traduction: 'Les pieds',                categorie: 'corps' },
    { mot: 'Le bide',     transcription: 'lə bid',    traduction: 'Le ventre',                 categorie: 'corps' },
    { mot: 'Les yeux poto',transcription:'le jø poto', traduction: 'Regard méfiant / surveiller',categorie: 'corps' },
    { mot: 'La bouche séchée', transcription: 'la buʃ seʃe', traduction: 'Avoir faim / manquer d\'argent', categorie: 'corps' },
    { mot: 'Gros dos',    transcription: 'gʁo do',   traduction: 'Haut placé / Puissant',     categorie: 'corps' },
    // ── Animaux ──────────────────────────────────────────────────────────────
    { mot: 'Poule mouillée', transcription: 'pul muje', traduction: 'Lâche / Peureux',        categorie: 'animaux' },
    { mot: 'Panthère',    transcription: 'pɑ̃tɛʁ',   traduction: 'Ivoirien de souche (fierté)',categorie: 'animaux' },
    { mot: 'Moustique',   transcription: 'mustik',    traduction: 'Personne de petite taille', categorie: 'animaux' },
    { mot: 'Cafard',      transcription: 'kafaʁ',     traduction: 'Délateur / Mouchard',       categorie: 'animaux' },
    { mot: 'Serpent',     transcription: 'sɛʁpɑ̃',   traduction: 'Personne sournoise / traitre',categorie: 'animaux' },
    { mot: 'Rat',         transcription: 'ʁa',        traduction: 'Voleur / Débrouillard louche',categorie: 'animaux' },
    { mot: 'Gros poisson',transcription: 'gʁo pwasɔ̃',traduction: 'Personnage important',      categorie: 'animaux' },
    { mot: 'Petit poulet',transcription: 'pəti pulɛ', traduction: 'Jeune inexpérimenté',       categorie: 'animaux' },
    // ── Couleurs ─────────────────────────────────────────────────────────────
    { mot: 'Choukou',     transcription: 'ʃuku',      traduction: 'Noir (teint foncé)',        categorie: 'couleurs', exemplePhrase: 'Il est choukou là !' },
    { mot: 'Kpata kpata', transcription: 'kpata kpata',traduction: 'Très sombre / Noir intense',categorie: 'couleurs' },
    { mot: 'Tomates',     transcription: 'tɔmat',     traduction: 'Rouge / Vermeil (teint)',   categorie: 'couleurs' },
    { mot: 'Clair',       transcription: 'klɛʁ',      traduction: 'Teint clair / Peau lumineuse',categorie: 'couleurs' },
    { mot: 'Toubabou',    transcription: 'tubaby',     traduction: 'Blanc (personne ou couleur)',categorie: 'couleurs' },
    { mot: 'Gbê',         transcription: 'gbɛ',       traduction: 'Vert (de la forêt)',        categorie: 'couleurs' },
    // ── Verbes ───────────────────────────────────────────────────────────────
    { mot: 'Dégager',     transcription: 'degaʒe',    traduction: 'Partir / Quitter',          categorie: 'verbes', exemplePhrase: 'Dégager là !' },
    { mot: 'Zouker',      transcription: 'zuke',      traduction: 'Danser (Zouglou)',           categorie: 'verbes' },
    { mot: 'Arnaquer',    transcription: 'aʁnake',    traduction: 'Escroquer / Tromper',        categorie: 'verbes' },
    { mot: 'Griller',     transcription: 'gʁije',     traduction: 'Surprendre / Démasquer',     categorie: 'verbes', exemplePhrase: 'On t\'a grillé !' },
    { mot: 'Cartonner',   transcription: 'kaʁtɔne',   traduction: 'Réussir / Cartonner',        categorie: 'verbes' },
    { mot: 'Galérer',     transcription: 'galeʁe',    traduction: 'Souffrir / Avoir du mal',    categorie: 'verbes' },
    { mot: 'Kiffé',       transcription: 'kife',      traduction: 'Aimer / Apprécier',          categorie: 'verbes', exemplePhrase: 'Je kiffe trop ce son !' },
    { mot: 'Zapper',      transcription: 'zape',      traduction: 'Ignorer / Négliger',         categorie: 'verbes' },
    // ── Émotions ─────────────────────────────────────────────────────────────
    { mot: 'C\'est chaud',   transcription: 'sɛ ʃo',    traduction: 'C\'est difficile / c\'est grave', categorie: 'emotions' },
    { mot: 'C\'est cool',    transcription: 'sɛ kul',   traduction: 'C\'est bien / relax',             categorie: 'emotions' },
    { mot: 'Ça dépasse',     transcription: 'sa depas', traduction: 'Incroyable / Excessif',           categorie: 'emotions' },
    { mot: 'On est ensemble',transcription: 'ɔ̃ nɛ tɑ̃sabl', traduction: 'Solidarité / On est là',   categorie: 'emotions', exemplePhrase: 'On est ensemble frère !' },
    { mot: 'Ma tête n\'est pas là', transcription: 'ma tɛt nɛ pa la', traduction: 'Je ne suis pas d\'humeur / Je suis préoccupé', categorie: 'emotions' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXÉCUTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌍 Enrichissement vocabulaire LINGUA Africa...\n');

  const languages = await prisma.language.findMany({ where: { isActive: true } });
  const langMap = Object.fromEntries(languages.map(l => [l.code, l]));

  let added = 0, skipped = 0;

  for (const [code, mots] of Object.entries(VOCABULAIRE)) {
    const lang = langMap[code];
    if (!lang) {
      console.warn(`⚠️  Langue "${code}" non trouvée en base — ignorée.`);
      continue;
    }

    console.log(`\n📖 ${lang.nom} (${mots.length} mots à insérer)`);

    for (const mot of mots) {
      // Vérifier si le mot existe déjà (même mot + même langue)
      const exists = await prisma.dictionaryEntry.findFirst({
        where: {
          languageId: lang.id,
          mot: mot.mot,
        },
      });

      if (exists) {
        process.stdout.write('.');
        skipped++;
        continue;
      }

      await prisma.dictionaryEntry.create({
        data: {
          languageId:   lang.id,
          mot:          mot.mot,
          transcription: mot.transcription || null,
          traduction:   mot.traduction,
          categorie:    mot.categorie || null,
          exemplePhrase: mot.exemplePhrase || null,
          status:       'PUBLISHED',
        },
      });

      process.stdout.write('+');
      added++;
    }
  }

  console.log(`\n\n✅ Terminé !`);
  console.log(`   Mots ajoutés  : ${added}`);
  console.log(`   Déjà existants : ${skipped}`);
  console.log(`   Total estimé  : ${added + skipped + 155}+ mots en base\n`);
}

main()
  .catch(e => { console.error('❌ Erreur :', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
