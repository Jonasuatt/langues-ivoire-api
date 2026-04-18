const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// DICTIONNAIRE ENRICHI — Vocabulaire essentiel
// ~80 nouveaux mots par langue (chiffres, couleurs, corps,
// animaux, nourriture, marché, verbes, temps/météo, famille élargie)
// ============================================================

const DICTIONARY_V2 = {
  baoule: [
    // --- Chiffres ---
    { mot: 'Kun', transcription: 'kun', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Nyo', transcription: 'nyo', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Sa', transcription: 'sa', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Nnan', transcription: 'nnan', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Nnu', transcription: 'nnu', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Nsien', transcription: 'nsiɛn', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Nsɔ', transcription: 'nsɔ', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Mɔnwle', transcription: 'mɔnwle', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Ngwlan', transcription: 'ngwlan', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Blu', transcription: 'blu', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Ufle', transcription: 'ufle', traduction: 'Blanc', categorie: 'couleurs', exemplePhrase: 'Tralɛ ufle', exempleTraduction: 'Vêtement blanc' },
    { mot: 'Blê', transcription: 'blê', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Ɔkwlɛ', transcription: 'ɔkwlɛ', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Akɔ nzuɛ', transcription: 'akɔ nzuɛ', traduction: 'Vert (couleur de l\'eau)', categorie: 'couleurs' },
    { mot: 'Sika kɔkɔrɛ', transcription: 'sika kɔkɔrɛ', traduction: 'Jaune (couleur de l\'or)', categorie: 'couleurs' },
    // --- Corps humain ---
    { mot: 'Ti', transcription: 'ti', traduction: 'Tête', categorie: 'corps', exemplePhrase: 'Min ti kpɛn', exempleTraduction: 'Ma tête est grosse' },
    { mot: 'Nyinma', transcription: 'nyinma', traduction: 'Oeil / Yeux', categorie: 'corps' },
    { mot: 'Su', transcription: 'su', traduction: 'Nez', categorie: 'corps' },
    { mot: 'Nuan', transcription: 'nuan', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Dre', transcription: 'dre', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Sa', transcription: 'sa', traduction: 'Main', categorie: 'corps' },
    { mot: 'Ja', transcription: 'ja', traduction: 'Pied / Jambe', categorie: 'corps' },
    { mot: 'Klun', transcription: 'klun', traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Wun', transcription: 'wun', traduction: 'Corps', categorie: 'corps' },
    { mot: 'Kɛn', transcription: 'kɛn', traduction: 'Dent', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Akɔ', transcription: 'akɔ', traduction: 'Poulet / Coq', categorie: 'animaux', exemplePhrase: 'Akɔ bo tuin', exempleTraduction: 'Le coq chante' },
    { mot: 'Bua', transcription: 'bua', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Mian', transcription: 'mian', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Alua', transcription: 'alua', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Wɔ', transcription: 'wɔ', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Sungble', transcription: 'sungble', traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Anɔma', transcription: 'anɔma', traduction: 'Oiseau', categorie: 'animaux' },
    { mot: 'Boli', transcription: 'boli', traduction: 'Chèvre', categorie: 'animaux' },
    // --- Nourriture complémentaire ---
    { mot: 'Aklɔnman', transcription: 'aklɔnman', traduction: 'Banane plantain', categorie: 'nourriture', exemplePhrase: 'Aklɔnman kpa', exempleTraduction: 'Bonne banane plantain' },
    { mot: 'Lɔ', transcription: 'lɔ', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Ble', transcription: 'ble', traduction: 'Maïs', categorie: 'nourriture' },
    { mot: 'Trɔ', transcription: 'trɔ', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Njin', transcription: 'njin', traduction: 'Huile', categorie: 'nourriture' },
    { mot: 'Kanjue', transcription: 'kanjue', traduction: 'Sel', categorie: 'nourriture' },
    { mot: 'Suke', transcription: 'suke', traduction: 'Sucre', categorie: 'nourriture' },
    // --- Verbes courants ---
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Aller', categorie: 'verbes', exemplePhrase: 'N kɔ fie su', exempleTraduction: 'Je vais au champ' },
    { mot: 'Ba', transcription: 'ba', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Nian', transcription: 'nian', traduction: 'Voir / Regarder', categorie: 'verbes' },
    { mot: 'Tié', transcription: 'tié', traduction: 'Écouter / Entendre', categorie: 'verbes' },
    { mot: 'Kan', transcription: 'kan', traduction: 'Parler / Dire', categorie: 'verbes' },
    { mot: 'Fa', transcription: 'fa', traduction: 'Prendre', categorie: 'verbes' },
    { mot: 'Man', transcription: 'man', traduction: 'Donner', categorie: 'verbes' },
    { mot: 'Mian', transcription: 'mian', traduction: 'Travailler', categorie: 'verbes' },
    { mot: 'La', transcription: 'la', traduction: 'Dormir / Se coucher', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Sortir', categorie: 'verbes' },
    { mot: 'Nɔn', transcription: 'nɔn', traduction: 'Boire', categorie: 'verbes' },
    { mot: 'Si', transcription: 'si', traduction: 'Savoir / Connaître', categorie: 'verbes' },
    // --- Famille élargie ---
    { mot: 'Aniaan', transcription: 'aniaan', traduction: 'Frère / Soeur', categorie: 'famille' },
    { mot: 'Siman', transcription: 'siman', traduction: 'Grand-père', categorie: 'famille' },
    { mot: 'Nannan', transcription: 'nannan', traduction: 'Grand-mère / Ancêtre', categorie: 'famille' },
    { mot: 'Yi', transcription: 'yi', traduction: 'Épouse', categorie: 'famille' },
    { mot: 'Bian', transcription: 'bian', traduction: 'Époux / Mari', categorie: 'famille' },
    // --- Vie quotidienne / Marché ---
    { mot: 'Gwa', transcription: 'gwa', traduction: 'Marché', categorie: 'vie_quotidienne', exemplePhrase: 'N kɔ gwa', exempleTraduction: 'Je vais au marché' },
    { mot: 'Tralɛ', transcription: 'tralɛ', traduction: 'Vêtement / Habit', categorie: 'vie_quotidienne' },
    { mot: 'Junman', transcription: 'junman', traduction: 'Travail', categorie: 'vie_quotidienne' },
    { mot: 'Sika', transcription: 'sika', traduction: 'Or / Richesse', categorie: 'vie_quotidienne' },
    { mot: 'Awlo', transcription: 'awlo', traduction: 'Famille / Foyer', categorie: 'famille' },
    // --- Nature / Temps ---
    { mot: 'Wia', transcription: 'wia', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Anglo', transcription: 'anglo', traduction: 'Lune', categorie: 'nature' },
    { mot: 'Nzuɛ', transcription: 'nzuɛ', traduction: 'Pluie', categorie: 'nature' },
    { mot: 'Asiɛ', transcription: 'asiɛ', traduction: 'Terre / Sol', categorie: 'nature' },
    { mot: 'Nglo', transcription: 'nglo', traduction: 'Ciel', categorie: 'nature' },
    { mot: 'Sin', transcription: 'sin', traduction: 'Vent', categorie: 'nature' },
    // --- Expressions utiles ---
    { mot: 'N klo ɔ', transcription: 'n klo ɔ', traduction: 'Je t\'aime', categorie: 'expressions', exemplePhrase: 'N klo ɔ sɛ', exempleTraduction: 'Je t\'aime beaucoup' },
    { mot: 'Yaci', transcription: 'yaci', traduction: 'Pardon / Excuse-moi', categorie: 'expressions' },
    { mot: 'A si ɔ?', transcription: 'a si ɔ', traduction: 'Tu comprends ?', categorie: 'expressions' },
    { mot: 'N wun i wlɛ', transcription: 'n wun i wlɛ', traduction: 'Je comprends', categorie: 'expressions' },
    { mot: 'Se ɔ?', transcription: 'se ɔ', traduction: 'Combien ?', categorie: 'expressions', exemplePhrase: 'Finfin se ɔ ?', exempleTraduction: 'Combien ça coûte ?' },
  ],

  dioula: [
    // --- Chiffres ---
    { mot: 'Kelen', transcription: 'kelen', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Fila', transcription: 'fila', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Saba', transcription: 'saba', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Naani', transcription: 'naani', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Duuru', transcription: 'duuru', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Wɔɔrɔ', transcription: 'wɔɔrɔ', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Wolonwula', transcription: 'wolonwula', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Segin', transcription: 'segin', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Kɔnɔntɔn', transcription: 'kɔnɔntɔn', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Tan', transcription: 'tan', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Gbɛ', transcription: 'gbɛ', traduction: 'Blanc', categorie: 'couleurs' },
    { mot: 'Fin', transcription: 'fin', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Wulen', transcription: 'wulen', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Binɛ', transcription: 'binɛ', traduction: 'Vert', categorie: 'couleurs' },
    { mot: 'Nɛrɛmuguman', transcription: 'nɛrɛmuguman', traduction: 'Jaune', categorie: 'couleurs' },
    // --- Corps humain ---
    { mot: 'Kun', transcription: 'kun', traduction: 'Tête', categorie: 'corps', exemplePhrase: 'N kun bɛ n dimi', exempleTraduction: 'Ma tête me fait mal' },
    { mot: 'Nyɛ', transcription: 'nyɛ', traduction: 'Oeil / Yeux', categorie: 'corps' },
    { mot: 'Nun', transcription: 'nun', traduction: 'Nez', categorie: 'corps' },
    { mot: 'Da', transcription: 'da', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Tulo', transcription: 'tulo', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Bolo', transcription: 'bolo', traduction: 'Main / Bras', categorie: 'corps' },
    { mot: 'Sen', transcription: 'sen', traduction: 'Pied / Jambe', categorie: 'corps' },
    { mot: 'Kɔnɔ', transcription: 'kɔnɔ', traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Fari', transcription: 'fari', traduction: 'Corps / Peau', categorie: 'corps' },
    { mot: 'Ɲin', transcription: 'ɲin', traduction: 'Dent', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Shɛ', transcription: 'shɛ', traduction: 'Poulet', categorie: 'animaux', exemplePhrase: 'Shɛ bɛ fiyɛ', exempleTraduction: 'Le poulet picore' },
    { mot: 'Saga', transcription: 'saga', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Jakuma', transcription: 'jakuma', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Wulu', transcription: 'wulu', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Sa', transcription: 'sa', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Sama', transcription: 'sama', traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Kɔnɔ', transcription: 'kɔnɔ', traduction: 'Oiseau', categorie: 'animaux' },
    { mot: 'Ba', transcription: 'ba', traduction: 'Chèvre', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Namasa', transcription: 'namasa', traduction: 'Banane', categorie: 'nourriture', exemplePhrase: 'Namasa ka di', exempleTraduction: 'La banane est bonne' },
    { mot: 'Malo', transcription: 'malo', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Kaba', transcription: 'kaba', traduction: 'Maïs', categorie: 'nourriture' },
    { mot: 'Na', transcription: 'na', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Tulu', transcription: 'tulu', traduction: 'Huile', categorie: 'nourriture' },
    { mot: 'Kɔgɔ', transcription: 'kɔgɔ', traduction: 'Sel', categorie: 'nourriture' },
    { mot: 'Sukaro', transcription: 'sukaro', traduction: 'Sucre', categorie: 'nourriture' },
    { mot: 'Jɛgɛ', transcription: 'jɛgɛ', traduction: 'Poisson', categorie: 'nourriture' },
    { mot: 'Sogo', transcription: 'sogo', traduction: 'Viande', categorie: 'nourriture' },
    // --- Verbes courants ---
    { mot: 'Taa', transcription: 'taa', traduction: 'Aller / Partir', categorie: 'verbes', exemplePhrase: 'N bɛ taa so', exempleTraduction: 'Je vais à la maison' },
    { mot: 'Na', transcription: 'na', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Ye', transcription: 'ye', traduction: 'Voir', categorie: 'verbes' },
    { mot: 'Mɛn', transcription: 'mɛn', traduction: 'Écouter / Entendre', categorie: 'verbes' },
    { mot: 'Fɔ', transcription: 'fɔ', traduction: 'Parler / Dire', categorie: 'verbes' },
    { mot: 'Ta', transcription: 'ta', traduction: 'Prendre', categorie: 'verbes' },
    { mot: 'Di', transcription: 'di', traduction: 'Donner', categorie: 'verbes' },
    { mot: 'Baara kɛ', transcription: 'baara kɛ', traduction: 'Travailler', categorie: 'verbes' },
    { mot: 'Sunɔgɔ', transcription: 'sunɔgɔ', traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Sortir', categorie: 'verbes' },
    { mot: 'Min', transcription: 'min', traduction: 'Boire', categorie: 'verbes' },
    { mot: 'Dun', transcription: 'dun', traduction: 'Manger', categorie: 'verbes' },
    // --- Famille élargie ---
    { mot: 'Kɔrɔ', transcription: 'kɔrɔ', traduction: 'Grand frère', categorie: 'famille' },
    { mot: 'Dɔgɔ', transcription: 'dɔgɔ', traduction: 'Petit frère / Petite soeur', categorie: 'famille' },
    { mot: 'Bɛma', transcription: 'bɛma', traduction: 'Grand-mère', categorie: 'famille' },
    { mot: 'Bɛfa', transcription: 'bɛfa', traduction: 'Grand-père', categorie: 'famille' },
    // --- Vie quotidienne / Marché ---
    { mot: 'Lɔgɔ', transcription: 'lɔgɔ', traduction: 'Marché', categorie: 'vie_quotidienne', exemplePhrase: 'N bɛ taa lɔgɔ la', exempleTraduction: 'Je vais au marché' },
    { mot: 'Fini', transcription: 'fini', traduction: 'Vêtement / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Baara', transcription: 'baara', traduction: 'Travail', categorie: 'vie_quotidienne' },
    { mot: 'Sanuya', transcription: 'sanuya', traduction: 'Or', categorie: 'vie_quotidienne' },
    // --- Nature / Temps ---
    { mot: 'Tile', transcription: 'tile', traduction: 'Soleil / Jour', categorie: 'nature' },
    { mot: 'Kalo', transcription: 'kalo', traduction: 'Lune / Mois', categorie: 'nature' },
    { mot: 'Sanji', transcription: 'sanji', traduction: 'Pluie', categorie: 'nature' },
    { mot: 'Dugukolo', transcription: 'dugukolo', traduction: 'Terre / Sol', categorie: 'nature' },
    { mot: 'Sankolo', transcription: 'sankolo', traduction: 'Ciel', categorie: 'nature' },
    { mot: 'Fɲɛ', transcription: 'fɲɛ', traduction: 'Vent', categorie: 'nature' },
    { mot: 'Yiri', transcription: 'yiri', traduction: 'Arbre', categorie: 'nature' },
    // --- Expressions utiles ---
    { mot: 'N b\'i fɛ', transcription: 'n bi fɛ', traduction: 'Je t\'aime', categorie: 'expressions', exemplePhrase: 'N b\'i fɛ kosɛbɛ', exempleTraduction: 'Je t\'aime beaucoup' },
    { mot: 'Hakɛ to', transcription: 'hakɛ to', traduction: 'Pardon / Excuse-moi', categorie: 'expressions' },
    { mot: 'I y\'a faamu wa?', transcription: 'i ya faamu wa', traduction: 'Tu comprends ?', categorie: 'expressions' },
    { mot: 'N y\'a faamu', transcription: 'n ya faamu', traduction: 'Je comprends', categorie: 'expressions' },
    { mot: 'A bɛ joli ye?', transcription: 'a bɛ joli ye', traduction: 'Combien ça coûte ?', categorie: 'expressions' },
    { mot: 'I tɔgɔ?', transcription: 'i tɔgɔ', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
    { mot: 'N tɔgɔ...', transcription: 'n tɔgɔ', traduction: 'Je m\'appelle...', categorie: 'expressions' },
  ],

  bete: [
    // --- Chiffres ---
    { mot: 'Dô', transcription: 'dô', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Plɛ', transcription: 'plɛ', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Yɛkpa', transcription: 'yɛkpa', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Nyɛ', transcription: 'nyɛ', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Sɔɔlu', transcription: 'sɔɔlu', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Sɔɔdô', transcription: 'sɔɔdô', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Sɔɔplɛ', transcription: 'sɔɔplɛ', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Sɔɔyɛkpa', transcription: 'sɔɔyɛkpa', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Sɔɔnyɛ', transcription: 'sɔɔnyɛ', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Vu', transcription: 'vu', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Flê', transcription: 'flê', traduction: 'Blanc', categorie: 'couleurs' },
    { mot: 'Ti', transcription: 'ti', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Zlê', transcription: 'zlê', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Vlê', transcription: 'vlê', traduction: 'Vert', categorie: 'couleurs' },
    { mot: 'Bhlê', transcription: 'bhlê', traduction: 'Jaune', categorie: 'couleurs' },
    // --- Corps humain ---
    { mot: 'Zu', transcription: 'zu', traduction: 'Tête', categorie: 'corps' },
    { mot: 'Nyɛ', transcription: 'nyɛ', traduction: 'Oeil', categorie: 'corps' },
    { mot: 'Mlu', transcription: 'mlu', traduction: 'Nez', categorie: 'corps' },
    { mot: 'Nu', transcription: 'nu', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Zu gblê', transcription: 'zu gblê', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Gbla', transcription: 'gbla', traduction: 'Main / Bras', categorie: 'corps' },
    { mot: 'Ja', transcription: 'ja', traduction: 'Pied', categorie: 'corps' },
    { mot: 'Ku', transcription: 'ku', traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Wli', transcription: 'wli', traduction: 'Dent', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Kɔkɔ', transcription: 'kɔkɔ', traduction: 'Poulet', categorie: 'animaux' },
    { mot: 'Bhlɛ', transcription: 'bhlɛ', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Gnɔ', transcription: 'gnɔ', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Gbli', transcription: 'gbli', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Da', transcription: 'da', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Tui', transcription: 'tui', traduction: 'Éléphant', categorie: 'animaux' },
    { mot: 'Wlè', transcription: 'wlè', traduction: 'Oiseau', categorie: 'animaux' },
    { mot: 'Bli', transcription: 'bli', traduction: 'Chèvre', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Blugu', transcription: 'blugu', traduction: 'Banane plantain', categorie: 'nourriture' },
    { mot: 'Mɔlɔ', transcription: 'mɔlɔ', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Gblo', transcription: 'gblo', traduction: 'Maïs', categorie: 'nourriture' },
    { mot: 'Nɛ', transcription: 'nɛ', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Drui', transcription: 'drui', traduction: 'Huile', categorie: 'nourriture' },
    { mot: 'Djê', transcription: 'djê', traduction: 'Sel', categorie: 'nourriture' },
    { mot: 'Sogo', transcription: 'sogo', traduction: 'Viande', categorie: 'nourriture' },
    // --- Verbes courants ---
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Aller', categorie: 'verbes', exemplePhrase: 'N kɔ gle', exempleTraduction: 'Je vais au village' },
    { mot: 'Lɔ', transcription: 'lɔ', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Yɛ', transcription: 'yɛ', traduction: 'Voir', categorie: 'verbes' },
    { mot: 'Nyo', transcription: 'nyo', traduction: 'Écouter', categorie: 'verbes' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Parler', categorie: 'verbes' },
    { mot: 'Mlɔ', transcription: 'mlɔ', traduction: 'Prendre', categorie: 'verbes' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Donner', categorie: 'verbes' },
    { mot: 'Nyran', transcription: 'nyran', traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Li', transcription: 'li', traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Nɔn', transcription: 'nɔn', traduction: 'Boire', categorie: 'verbes' },
    // --- Famille élargie ---
    { mot: 'Nyu gbo', transcription: 'nyu gbo', traduction: 'Frère / Soeur', categorie: 'famille' },
    { mot: 'Gɔgɔ gbo', transcription: 'gɔgɔ gbo', traduction: 'Grand-père', categorie: 'famille' },
    { mot: 'Yè gbo', transcription: 'yè gbo', traduction: 'Grand-mère', categorie: 'famille' },
    // --- Vie quotidienne ---
    { mot: 'Gbata', transcription: 'gbata', traduction: 'Marché', categorie: 'vie_quotidienne' },
    { mot: 'Trɔ', transcription: 'trɔ', traduction: 'Vêtement', categorie: 'vie_quotidienne' },
    { mot: 'Yû', transcription: 'yû', traduction: 'Travail', categorie: 'vie_quotidienne' },
    // --- Nature ---
    { mot: 'Kouya', transcription: 'kouya', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Zran', transcription: 'zran', traduction: 'Lune', categorie: 'nature' },
    { mot: 'Gbô', transcription: 'gbô', traduction: 'Pluie', categorie: 'nature' },
    { mot: 'Bly', transcription: 'bly', traduction: 'Ciel', categorie: 'nature' },
    // --- Expressions ---
    { mot: 'N gba wa', transcription: 'n gba wa', traduction: 'Pardon', categorie: 'expressions' },
    { mot: 'A se?', transcription: 'a se', traduction: 'Combien ?', categorie: 'expressions' },
    { mot: 'I klê dê?', transcription: 'i klê dê', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
  ],

  senoufo: [
    // --- Chiffres ---
    { mot: 'Ninri', transcription: 'ninri', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Shiin', transcription: 'shiin', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Taaré', transcription: 'taaré', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Sicyɛɛré', transcription: 'sicyɛɛré', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Kagangu', transcription: 'kagangu', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Kagannin', transcription: 'kagannin', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Kaganshiin', transcription: 'kaganshiin', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Kagantaaré', transcription: 'kagantaaré', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Kagansicyɛɛré', transcription: 'kagansicyɛɛré', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Kɛlɛ', transcription: 'kɛlɛ', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Fuun', transcription: 'fuun', traduction: 'Blanc', categorie: 'couleurs' },
    { mot: 'Fin', transcription: 'fin', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Wulen', transcription: 'wulen', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Janman', transcription: 'janman', traduction: 'Vert', categorie: 'couleurs' },
    { mot: 'Nɛrɛ', transcription: 'nɛrɛ', traduction: 'Jaune', categorie: 'couleurs' },
    // --- Corps humain ---
    { mot: 'Yiri', transcription: 'yiri', traduction: 'Tête', categorie: 'corps' },
    { mot: 'Nyɛn', transcription: 'nyɛn', traduction: 'Oeil', categorie: 'corps' },
    { mot: 'Mun', transcription: 'mun', traduction: 'Nez', categorie: 'corps' },
    { mot: 'Nyon', transcription: 'nyon', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Nuun', transcription: 'nuun', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Kaan', transcription: 'kaan', traduction: 'Main', categorie: 'corps' },
    { mot: 'Gben', transcription: 'gben', traduction: 'Pied', categorie: 'corps' },
    { mot: 'Kono', transcription: 'kono', traduction: 'Ventre', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Shyɛn', transcription: 'shyɛn', traduction: 'Poulet', categorie: 'animaux' },
    { mot: 'Saga', transcription: 'saga', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Nyaga', transcription: 'nyaga', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Wolo', transcription: 'wolo', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Saa', transcription: 'saa', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Nɔɔ', transcription: 'nɔɔ', traduction: 'Vache / Boeuf', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Bananè', transcription: 'bananè', traduction: 'Banane', categorie: 'nourriture' },
    { mot: 'Malo', transcription: 'malo', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Nafolo', transcription: 'nafolo', traduction: 'Igname', categorie: 'nourriture' },
    { mot: 'Nan', transcription: 'nan', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Kɔgɔ', transcription: 'kɔgɔ', traduction: 'Sel', categorie: 'nourriture' },
    { mot: 'Jɛ', transcription: 'jɛ', traduction: 'Poisson', categorie: 'nourriture' },
    { mot: 'Sogo', transcription: 'sogo', traduction: 'Viande', categorie: 'nourriture' },
    // --- Verbes ---
    { mot: 'Ta', transcription: 'ta', traduction: 'Aller', categorie: 'verbes' },
    { mot: 'Wan', transcription: 'wan', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Ka', transcription: 'ka', traduction: 'Voir', categorie: 'verbes' },
    { mot: 'Logon', transcription: 'logon', traduction: 'Écouter', categorie: 'verbes' },
    { mot: 'Fɔ', transcription: 'fɔ', traduction: 'Parler / Dire', categorie: 'verbes' },
    { mot: 'Gbele', transcription: 'gbele', traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Min', transcription: 'min', traduction: 'Boire', categorie: 'verbes' },
    { mot: 'Dagbɛ', transcription: 'dagbɛ', traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Baara', transcription: 'baara', traduction: 'Travailler', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Pɛɛ', transcription: 'pɛɛ', traduction: 'Grand-père', categorie: 'famille' },
    { mot: 'Naanyɛ', transcription: 'naanyɛ', traduction: 'Grand-mère', categorie: 'famille' },
    { mot: 'Cɛɛ', transcription: 'cɛɛ', traduction: 'Homme / Mari', categorie: 'famille' },
    { mot: 'Jaa', transcription: 'jaa', traduction: 'Femme / Épouse', categorie: 'famille' },
    // --- Nature ---
    { mot: 'Waa', transcription: 'waa', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Kalo', transcription: 'kalo', traduction: 'Lune', categorie: 'nature' },
    { mot: 'Sanji', transcription: 'sanji', traduction: 'Pluie', categorie: 'nature' },
    { mot: 'Taga', transcription: 'taga', traduction: 'Terre', categorie: 'nature' },
    // --- Expressions ---
    { mot: 'A joli?', transcription: 'a joli', traduction: 'Combien ?', categorie: 'expressions' },
    { mot: 'I tɔgɔ?', transcription: 'i tɔgɔ', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
  ],

  agni: [
    // --- Chiffres ---
    { mot: 'Kun', transcription: 'kun', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Nnyɔn', transcription: 'nnyɔn', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Nsan', transcription: 'nsan', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Nnan', transcription: 'nnan', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Nnum', transcription: 'nnum', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Nsia', transcription: 'nsia', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Nsɔn', transcription: 'nsɔn', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Mɔtwe', transcription: 'mɔtwe', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Nkɔn', transcription: 'nkɔn', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Blu', transcription: 'blu', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Fitifiti', transcription: 'fitifiti', traduction: 'Blanc', categorie: 'couleurs' },
    { mot: 'Tuntun', transcription: 'tuntun', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Kɔkɔrɛ', transcription: 'kɔkɔrɛ', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Ahabanan', transcription: 'ahabanan', traduction: 'Vert', categorie: 'couleurs' },
    { mot: 'Akɔndɛ', transcription: 'akɔndɛ', traduction: 'Jaune', categorie: 'couleurs' },
    // --- Corps humain ---
    { mot: 'Ti', transcription: 'ti', traduction: 'Tête', categorie: 'corps' },
    { mot: 'Anyinma', transcription: 'anyinma', traduction: 'Oeil', categorie: 'corps' },
    { mot: 'Bue', transcription: 'bue', traduction: 'Nez', categorie: 'corps' },
    { mot: 'Anuan', transcription: 'anuan', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Sui', transcription: 'sui', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Alɛ', transcription: 'alɛ', traduction: 'Main', categorie: 'corps' },
    { mot: 'Aja', transcription: 'aja', traduction: 'Pied', categorie: 'corps' },
    { mot: 'Aklun', transcription: 'aklun', traduction: 'Ventre / Coeur', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Akɔ', transcription: 'akɔ', traduction: 'Poulet', categorie: 'animaux' },
    { mot: 'Bua', transcription: 'bua', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Ngbua', transcription: 'ngbua', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Alua', transcription: 'alua', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Ɔwɔ', transcription: 'ɔwɔ', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Sonsɔn', transcription: 'sonsɔn', traduction: 'Éléphant', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Borɛdɛ', transcription: 'borɛdɛ', traduction: 'Banane plantain', categorie: 'nourriture' },
    { mot: 'Ɛmɔ', transcription: 'ɛmɔ', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Ablo', transcription: 'ablo', traduction: 'Maïs', categorie: 'nourriture' },
    { mot: 'Jran', transcription: 'jran', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Njin', transcription: 'njin', traduction: 'Huile', categorie: 'nourriture' },
    { mot: 'Djuɛ', transcription: 'djuɛ', traduction: 'Sel', categorie: 'nourriture' },
    { mot: 'Jue', transcription: 'jue', traduction: 'Poisson', categorie: 'nourriture' },
    // --- Verbes ---
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Aller', categorie: 'verbes', exemplePhrase: 'N kɔ fie su', exempleTraduction: 'Je vais au champ' },
    { mot: 'Ba', transcription: 'ba', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Wun', transcription: 'wun', traduction: 'Voir', categorie: 'verbes' },
    { mot: 'Ti', transcription: 'ti', traduction: 'Écouter', categorie: 'verbes' },
    { mot: 'Kan', transcription: 'kan', traduction: 'Parler', categorie: 'verbes' },
    { mot: 'Di', transcription: 'di', traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Nɔn', transcription: 'nɔn', traduction: 'Boire', categorie: 'verbes' },
    { mot: 'La', transcription: 'la', traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Man', transcription: 'man', traduction: 'Donner', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Niaan', transcription: 'niaan', traduction: 'Frère / Soeur', categorie: 'famille' },
    { mot: 'Nannan', transcription: 'nannan', traduction: 'Grand-père / Ancêtre', categorie: 'famille' },
    { mot: 'Yi', transcription: 'yi', traduction: 'Épouse', categorie: 'famille' },
    { mot: 'Bian', transcription: 'bian', traduction: 'Époux', categorie: 'famille' },
    // --- Nature ---
    { mot: 'Wia', transcription: 'wia', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Anwle', transcription: 'anwle', traduction: 'Lune', categorie: 'nature' },
    { mot: 'Nzuɛ', transcription: 'nzuɛ', traduction: 'Pluie', categorie: 'nature' },
    { mot: 'Asiɛ', transcription: 'asiɛ', traduction: 'Terre', categorie: 'nature' },
    { mot: 'Nnua', transcription: 'nnua', traduction: 'Arbre', categorie: 'nature' },
    // --- Expressions ---
    { mot: 'N klo ɔ', transcription: 'n klo ɔ', traduction: 'Je t\'aime', categorie: 'expressions' },
    { mot: 'Yaci', transcription: 'yaci', traduction: 'Pardon', categorie: 'expressions' },
    { mot: 'Ɛ bo sɛn?', transcription: 'ɛ bo sɛn', traduction: 'Combien ça coûte ?', categorie: 'expressions' },
    { mot: 'Wo dunman yɛ?', transcription: 'wo dunman yɛ', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
  ],

  gouro: [
    // --- Chiffres ---
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Yɔ', transcription: 'yɔ', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Yizi', transcription: 'yizi', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Sɔɔlu', transcription: 'sɔɔlu', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Sɔɛdɔ', transcription: 'sɔɛdɔ', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Sɔɛyɔ', transcription: 'sɔɛyɔ', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Sɔɛya', transcription: 'sɔɛya', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Sɔɛyizi', transcription: 'sɔɛyizi', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Vu', transcription: 'vu', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Fla', transcription: 'fla', traduction: 'Blanc', categorie: 'couleurs' },
    { mot: 'Tɛn', transcription: 'tɛn', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Zɛ', transcription: 'zɛ', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Vlê', transcription: 'vlê', traduction: 'Vert', categorie: 'couleurs' },
    // --- Corps humain ---
    { mot: 'Zu', transcription: 'zu', traduction: 'Tête', categorie: 'corps' },
    { mot: 'Yɛ', transcription: 'yɛ', traduction: 'Oeil', categorie: 'corps' },
    { mot: 'Mun', transcription: 'mun', traduction: 'Nez', categorie: 'corps' },
    { mot: 'Nyin', transcription: 'nyin', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Dlu', transcription: 'dlu', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Kla', transcription: 'kla', traduction: 'Main', categorie: 'corps' },
    { mot: 'Gbin', transcription: 'gbin', traduction: 'Pied', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Koko', transcription: 'koko', traduction: 'Poulet', categorie: 'animaux' },
    { mot: 'Bla', transcription: 'bla', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Gblè', transcription: 'gblè', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Da', transcription: 'da', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Wlè', transcription: 'wlè', traduction: 'Oiseau', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Blèè', transcription: 'blèè', traduction: 'Banane', categorie: 'nourriture' },
    { mot: 'Mɔlɔ', transcription: 'mɔlɔ', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Igname', categorie: 'nourriture' },
    { mot: 'Nɛ', transcription: 'nɛ', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Gblɔ', transcription: 'gblɔ', traduction: 'Poisson', categorie: 'nourriture' },
    // --- Verbes ---
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Aller', categorie: 'verbes' },
    { mot: 'Lɔ', transcription: 'lɔ', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Yɛ', transcription: 'yɛ', traduction: 'Voir', categorie: 'verbes' },
    { mot: 'Wɔ', transcription: 'wɔ', traduction: 'Parler', categorie: 'verbes' },
    { mot: 'Li', transcription: 'li', traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Mlɔ', transcription: 'mlɔ', traduction: 'Boire', categorie: 'verbes' },
    { mot: 'La', transcription: 'la', traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Donner', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Nyu', transcription: 'nyu', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Lu', transcription: 'lu', traduction: 'Frère / Soeur', categorie: 'famille' },
    // --- Nature ---
    { mot: 'Yrê', transcription: 'yrê', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Kli', transcription: 'kli', traduction: 'Lune', categorie: 'nature' },
    { mot: 'Yû', transcription: 'yû', traduction: 'Pluie', categorie: 'nature' },
    // --- Expressions ---
    { mot: 'A se?', transcription: 'a se', traduction: 'Combien ?', categorie: 'expressions' },
    { mot: 'A bê dê?', transcription: 'a bê dê', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
  ],

  guere: [
    // --- Chiffres ---
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Un (1)', categorie: 'chiffres' },
    { mot: 'Plɛ', transcription: 'plɛ', traduction: 'Deux (2)', categorie: 'chiffres' },
    { mot: 'Yaakpa', transcription: 'yaakpa', traduction: 'Trois (3)', categorie: 'chiffres' },
    { mot: 'Yiizi', transcription: 'yiizi', traduction: 'Quatre (4)', categorie: 'chiffres' },
    { mot: 'Sɔɔlu', transcription: 'sɔɔlu', traduction: 'Cinq (5)', categorie: 'chiffres' },
    { mot: 'Sɔɔdɔ', transcription: 'sɔɔdɔ', traduction: 'Six (6)', categorie: 'chiffres' },
    { mot: 'Sɔɔplɛ', transcription: 'sɔɔplɛ', traduction: 'Sept (7)', categorie: 'chiffres' },
    { mot: 'Sɔɔyaakpa', transcription: 'sɔɔyaakpa', traduction: 'Huit (8)', categorie: 'chiffres' },
    { mot: 'Sɔɔyiizi', transcription: 'sɔɔyiizi', traduction: 'Neuf (9)', categorie: 'chiffres' },
    { mot: 'Vu', transcription: 'vu', traduction: 'Dix (10)', categorie: 'chiffres' },
    // --- Couleurs ---
    { mot: 'Flê', transcription: 'flê', traduction: 'Blanc', categorie: 'couleurs' },
    { mot: 'Tî', transcription: 'tî', traduction: 'Noir', categorie: 'couleurs' },
    { mot: 'Zlê', transcription: 'zlê', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Vlê', transcription: 'vlê', traduction: 'Vert', categorie: 'couleurs' },
    // --- Corps ---
    { mot: 'Zu', transcription: 'zu', traduction: 'Tête', categorie: 'corps' },
    { mot: 'Nyɛ', transcription: 'nyɛ', traduction: 'Oeil', categorie: 'corps' },
    { mot: 'Nu', transcription: 'nu', traduction: 'Bouche', categorie: 'corps' },
    { mot: 'Tô', transcription: 'tô', traduction: 'Oreille', categorie: 'corps' },
    { mot: 'Gbla', transcription: 'gbla', traduction: 'Main', categorie: 'corps' },
    { mot: 'Gbin', transcription: 'gbin', traduction: 'Pied', categorie: 'corps' },
    { mot: 'Kô', transcription: 'kô', traduction: 'Ventre', categorie: 'corps' },
    // --- Animaux ---
    { mot: 'Kɔkɔ', transcription: 'kɔkɔ', traduction: 'Poulet', categorie: 'animaux' },
    { mot: 'Bhlɛ', transcription: 'bhlɛ', traduction: 'Mouton', categorie: 'animaux' },
    { mot: 'Gblè', transcription: 'gblè', traduction: 'Chien', categorie: 'animaux' },
    { mot: 'Da', transcription: 'da', traduction: 'Serpent', categorie: 'animaux' },
    { mot: 'Wlè', transcription: 'wlè', traduction: 'Oiseau', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Bligbu', transcription: 'bligbu', traduction: 'Banane', categorie: 'nourriture' },
    { mot: 'Mɔlɔ', transcription: 'mɔlɔ', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Nɛ', transcription: 'nɛ', traduction: 'Sauce', categorie: 'nourriture' },
    { mot: 'Sogo', transcription: 'sogo', traduction: 'Viande', categorie: 'nourriture' },
    { mot: 'Drui', transcription: 'drui', traduction: 'Huile', categorie: 'nourriture' },
    // --- Verbes ---
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Aller', categorie: 'verbes' },
    { mot: 'Lɔ', transcription: 'lɔ', traduction: 'Venir', categorie: 'verbes' },
    { mot: 'Yɛ', transcription: 'yɛ', traduction: 'Voir', categorie: 'verbes' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Parler', categorie: 'verbes' },
    { mot: 'Li', transcription: 'li', traduction: 'Manger', categorie: 'verbes' },
    { mot: 'Nɔn', transcription: 'nɔn', traduction: 'Boire', categorie: 'verbes' },
    { mot: 'La', transcription: 'la', traduction: 'Dormir', categorie: 'verbes' },
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Donner', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Nyu gbo', transcription: 'nyu gbo', traduction: 'Frère / Soeur', categorie: 'famille' },
    { mot: 'Tɔ gbo', transcription: 'tɔ gbo', traduction: 'Grand-père', categorie: 'famille' },
    // --- Nature ---
    { mot: 'Wli', transcription: 'wli', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Zran', transcription: 'zran', traduction: 'Lune', categorie: 'nature' },
    { mot: 'Gbô', transcription: 'gbô', traduction: 'Pluie', categorie: 'nature' },
    // --- Expressions ---
    { mot: 'A se?', transcription: 'a se', traduction: 'Combien ?', categorie: 'expressions' },
    { mot: 'Gblo', transcription: 'gblo', traduction: 'Pardon / Excuse', categorie: 'expressions' },
  ],

  nouchi: [
    // --- Salutations complémentaires ---
    { mot: 'Ça va un peu', transcription: 'sa va un peu', traduction: 'Ça va (réponse modeste)', categorie: 'salutations', exemplePhrase: 'Ça va un peu, on est là', exempleTraduction: 'Ça va, on se débrouille' },
    { mot: 'Akwaba', transcription: 'akwaba', traduction: 'Bienvenue (du Baoulé)', categorie: 'salutations' },
    { mot: 'Mon frère', transcription: 'mon frère', traduction: 'Ami proche / Pote (pas forcément famille)', categorie: 'salutations' },
    { mot: 'Tantie', transcription: 'tantie', traduction: 'Femme respectée / Vendeuse au marché', categorie: 'salutations' },
    { mot: 'Tonton', transcription: 'tonton', traduction: 'Homme respecté / Aîné', categorie: 'salutations' },
    // --- Vie quotidienne ---
    { mot: 'Boro', transcription: 'boro', traduction: 'Blanc / Européen', categorie: 'vie_sociale' },
    { mot: 'Faire le caillou', transcription: 'faire le caillou', traduction: 'Résister / Être têtu', categorie: 'expressions', exemplePhrase: 'Il fait le caillou', exempleTraduction: 'Il résiste / Il ne cède pas' },
    { mot: 'Dèh', transcription: 'dèh', traduction: 'Exclamation d\'insistance (hein / quoi)', categorie: 'expressions', exemplePhrase: 'C\'est bon dèh !', exempleTraduction: 'C\'est bon quand même !' },
    { mot: 'Kpakpato', transcription: 'kpakpato', traduction: 'Commère / Curieux', categorie: 'personnalite' },
    { mot: 'Gbè', transcription: 'gbè', traduction: 'Mourir / Être fini', categorie: 'verbes', exemplePhrase: 'Mon téléphone a gbè', exempleTraduction: 'Mon téléphone est mort' },
    { mot: 'Môgô', transcription: 'môgô', traduction: 'Personne / Quelqu\'un (du Dioula)', categorie: 'vie_sociale' },
    { mot: 'Faire palabre', transcription: 'faire palabre', traduction: 'Créer des problèmes / Se disputer', categorie: 'expressions' },
    { mot: 'Brouteur', transcription: 'brouteur', traduction: 'Arnaqueur sur internet', categorie: 'vie_sociale' },
    { mot: 'Enjaillement', transcription: 'enjaillement', traduction: 'Ambiance / Plaisir / Bonne humeur', categorie: 'expressions', exemplePhrase: 'Y a l\'enjaillement ici !', exempleTraduction: 'Il y a de l\'ambiance ici !' },
    { mot: 'Gnaga', transcription: 'gnaga', traduction: 'Repas populaire à base de viande grillée', categorie: 'nourriture' },
    { mot: 'Garba', transcription: 'garba', traduction: 'Plat d\'attiéké avec thon frit', categorie: 'nourriture', exemplePhrase: 'On va manger garba', exempleTraduction: 'On va manger du garba' },
    { mot: 'Koutoukou', transcription: 'koutoukou', traduction: 'Alcool artisanal de palme / Eau-de-vie locale', categorie: 'nourriture' },
    { mot: 'Bangui', transcription: 'bangui', traduction: 'Vin de palme', categorie: 'nourriture' },
    { mot: 'Gnamakoudji', transcription: 'gnamakoudji', traduction: 'Jus de gingembre', categorie: 'nourriture' },
    // --- Transport ---
    { mot: 'Pinasse', transcription: 'pinasse', traduction: 'Pirogue motorisée', categorie: 'transport' },
    { mot: 'Clando', transcription: 'clando', traduction: 'Taxi clandestin', categorie: 'transport' },
    // --- Expressions populaires ---
    { mot: 'C\'est gâté', transcription: "c'est gâté", traduction: 'C\'est fichu / C\'est raté', categorie: 'expressions' },
    { mot: 'Ça fait deux jours', transcription: 'sa fè deu jour', traduction: 'Ça fait longtemps (pas littéralement 2 jours)', categorie: 'expressions' },
    { mot: 'On dit quoi ?', transcription: 'on dit quoi', traduction: 'Quoi de neuf ? / Comment ça va ?', categorie: 'salutations' },
    { mot: 'Y a fohi', transcription: 'ya fohi', traduction: 'Il n\'y a rien / Pas de souci', categorie: 'expressions' },
    { mot: 'Affaire', transcription: 'affaire', traduction: 'Situation / Problème / Business', categorie: 'vie_quotidienne' },
    { mot: 'Djoss', transcription: 'djoss', traduction: 'Ami proche / Meilleur ami', categorie: 'vie_sociale', exemplePhrase: 'C\'est mon djoss', exempleTraduction: 'C\'est mon meilleur ami' },
    { mot: 'Gawa', transcription: 'gawa', traduction: 'Mort / Décès', categorie: 'vie_sociale' },
    { mot: 'Coupé-décalé', transcription: 'coupé-décalé', traduction: 'Genre musical & danse festive ivoirienne', categorie: 'musique' },
    { mot: 'Maïga', transcription: 'maïga', traduction: 'Vendeur ambulant (souvent étranger)', categorie: 'vie_sociale' },
  ],
};


// ============================================================
// PHRASES UTILES — Situations courantes
// ============================================================
const PHRASES = {
  baoule: [
    { phrase: 'N kɔ gwa', traduction: 'Je vais au marché', transcription: 'n kɔ gwa', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'Finfin se ɔ?', traduction: 'Combien ça coûte ?', transcription: 'finfin se ɔ', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'N klo ɔ sɛ', traduction: 'Je t\'aime beaucoup', transcription: 'n klo ɔ sɛ', categorie: 'expressions', contexte: 'Sentiment' },
    { phrase: 'Min ti kpɛn', traduction: 'J\'ai mal à la tête', transcription: 'min ti kpɛn', categorie: 'corps', contexte: 'Santé' },
    { phrase: 'Aliɛ di?', traduction: 'As-tu mangé ?', transcription: 'aliɛ di', categorie: 'salutations', contexte: 'Salutation informelle' },
    { phrase: 'N ba ɔ kunmin', traduction: 'Je reviendrai demain', transcription: 'n ba ɔ kunmin', categorie: 'expressions', contexte: 'Rendez-vous' },
    { phrase: 'Klun jɔ min', traduction: 'J\'ai faim', transcription: 'klun jɔ min', categorie: 'nourriture', contexte: 'Quotidien' },
    { phrase: 'Nzuɛ sa min', traduction: 'J\'ai soif', transcription: 'nzuɛ sa min', categorie: 'nourriture', contexte: 'Quotidien' },
  ],
  dioula: [
    { phrase: 'N bɛ taa lɔgɔ la', traduction: 'Je vais au marché', transcription: 'n bɛ taa lɔgɔ la', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'A bɛ joli ye?', traduction: 'Combien ça coûte ?', transcription: 'a bɛ joli ye', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'N b\'i fɛ kosɛbɛ', traduction: 'Je t\'aime beaucoup', transcription: 'n bi fɛ kosɛbɛ', categorie: 'expressions', contexte: 'Sentiment' },
    { phrase: 'N kun bɛ n dimi', traduction: 'J\'ai mal à la tête', transcription: 'n kun bɛ n dimi', categorie: 'corps', contexte: 'Santé' },
    { phrase: 'I ka kɛnɛ wa?', traduction: 'Tu vas bien ?', transcription: 'i ka kɛnɛ wa', categorie: 'salutations', contexte: 'Salutation' },
    { phrase: 'N bɛ sini na', traduction: 'Je reviendrai demain', transcription: 'n bɛ sini na', categorie: 'expressions', contexte: 'Rendez-vous' },
    { phrase: 'Kɔngɔ bɛ n la', traduction: 'J\'ai faim', transcription: 'kɔngɔ bɛ n la', categorie: 'nourriture', contexte: 'Quotidien' },
    { phrase: 'Min kɔ bɛ n la', traduction: 'J\'ai soif', transcription: 'min kɔ bɛ n la', categorie: 'nourriture', contexte: 'Quotidien' },
    { phrase: 'I tɔgɔ di ye?', traduction: 'Comment tu t\'appelles ?', transcription: 'i tɔgɔ di ye', categorie: 'salutations', contexte: 'Présentation' },
    { phrase: 'N tɔgɔ ye...', traduction: 'Je m\'appelle...', transcription: 'n tɔgɔ ye', categorie: 'salutations', contexte: 'Présentation' },
  ],
  bete: [
    { phrase: 'N kɔ gbata', traduction: 'Je vais au marché', transcription: 'n kɔ gbata', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'A se?', traduction: 'Combien ça coûte ?', transcription: 'a se', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'I ya ô !', traduction: 'Bienvenue !', transcription: 'i ya ô', categorie: 'salutations', contexte: 'Accueil' },
  ],
  senoufo: [
    { phrase: 'Kawelé ! I ka kɛnɛ wa?', traduction: 'Bonjour ! Tu vas bien ?', transcription: 'kawelé i ka kɛnɛ wa', categorie: 'salutations', contexte: 'Salutation' },
    { phrase: 'A joli?', traduction: 'Combien ?', transcription: 'a joli', categorie: 'vie_quotidienne', contexte: 'Marché' },
  ],
  agni: [
    { phrase: 'N kɔ gwa', traduction: 'Je vais au marché', transcription: 'n kɔ gwa', categorie: 'vie_quotidienne', contexte: 'Marché' },
    { phrase: 'Ɛ bo sɛn?', traduction: 'Combien ça coûte ?', transcription: 'ɛ bo sɛn', categorie: 'vie_quotidienne', contexte: 'Marché' },
  ],
  gouro: [
    { phrase: 'A se?', traduction: 'Combien ?', transcription: 'a se', categorie: 'vie_quotidienne', contexte: 'Marché' },
  ],
  guere: [
    { phrase: 'A se?', traduction: 'Combien ?', transcription: 'a se', categorie: 'vie_quotidienne', contexte: 'Marché' },
  ],
  nouchi: [
    { phrase: 'On dit quoi mon frère ?', traduction: 'Comment ça va l\'ami ?', transcription: 'on di kwa mon frère', categorie: 'salutations', contexte: 'Salutation entre amis' },
    { phrase: 'Y a l\'enjaillement ici !', traduction: 'Il y a de l\'ambiance ici !', transcription: 'ya lenjaillement ici', categorie: 'expressions', contexte: 'Fête / Sortie' },
    { phrase: 'On va manger garba', traduction: 'On va manger du garba (attiéké + thon)', transcription: 'on va manjé garba', categorie: 'nourriture', contexte: 'Repas' },
    { phrase: 'C\'est mon djoss', traduction: 'C\'est mon meilleur ami', transcription: 'sé mon djoss', categorie: 'vie_sociale', contexte: 'Amitié' },
    { phrase: 'Tu fais le caillou dèh !', traduction: 'Tu es vraiment têtu !', transcription: 'tu fè le kayou dèh', categorie: 'expressions', contexte: 'Quotidien' },
  ],
};


async function main() {
  console.log('🌍 Enrichissement du dictionnaire Langues Ivoire...\n');

  // Récupérer les langues
  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) {
    langMap[l.code] = l.id;
  }

  let totalWords = 0;
  let totalPhrases = 0;
  let skipped = 0;

  // --- Insertion des mots ---
  for (const [langCode, words] of Object.entries(DICTIONARY_V2)) {
    const languageId = langMap[langCode];
    if (!languageId) {
      console.log(`  ⚠️  Langue "${langCode}" non trouvée, ignorée.`);
      continue;
    }

    console.log(`📖 ${langCode.toUpperCase()} — ${words.length} mots à ajouter...`);

    for (const word of words) {
      // Vérifier si le mot existe déjà
      const existing = await prisma.dictionaryEntry.findFirst({
        where: {
          languageId,
          mot: word.mot,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.dictionaryEntry.create({
        data: {
          languageId,
          mot: word.mot,
          transcription: word.transcription,
          traduction: word.traduction,
          categorie: word.categorie,
          exemplePhrase: word.exemplePhrase || null,
          exempleTraduction: word.exempleTraduction || null,
          status: 'PUBLISHED',
          statutSRS: 0,
        },
      });
      totalWords++;
    }
  }

  // --- Insertion des phrases ---
  for (const [langCode, phrases] of Object.entries(PHRASES)) {
    const languageId = langMap[langCode];
    if (!languageId) continue;

    console.log(`💬 ${langCode.toUpperCase()} — ${phrases.length} phrases à ajouter...`);

    for (const phrase of phrases) {
      const existing = await prisma.usefulPhrase.findFirst({
        where: {
          languageId,
          phrase: phrase.phrase,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.usefulPhrase.create({
        data: {
          languageId,
          phrase: phrase.phrase,
          traduction: phrase.traduction,
          transcription: phrase.transcription,
          categorie: phrase.categorie,
          contexte: phrase.contexte || null,
          status: 'PUBLISHED',
        },
      });
      totalPhrases++;
    }
  }

  console.log(`\n✅ Terminé !`);
  console.log(`   📖 ${totalWords} mots ajoutés`);
  console.log(`   💬 ${totalPhrases} phrases ajoutées`);
  console.log(`   ⏩ ${skipped} doublons ignorés`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
