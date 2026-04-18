const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// DICTIONNAIRE V3 — Enrichissement pour atteindre 200+ mots/langue
// Catégories : fruits/légumes, métiers, lieux, adjectifs,
// santé, jours/temps, objets, commerce, insectes, arbres
// ============================================================

const DICTIONARY_V3 = {
  baoule: [
    // --- Fruits & Légumes ---
    { mot: 'Mangue', transcription: 'mangue', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Ananan', transcription: 'ananan', traduction: 'Ananas', categorie: 'nourriture' },
    { mot: 'Kokoe', transcription: 'kokoe', traduction: 'Noix de coco', categorie: 'nourriture' },
    { mot: 'Toroman', transcription: 'toroman', traduction: 'Orange', categorie: 'nourriture' },
    { mot: 'Kɔɔdɛ', transcription: 'kɔɔdɛ', traduction: 'Papaye', categorie: 'nourriture' },
    { mot: 'Tomati', transcription: 'tomati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Gbagba', transcription: 'gbagba', traduction: 'Aubergine', categorie: 'nourriture' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Ayêyê', transcription: 'ayêyê', traduction: 'Gombo', categorie: 'nourriture' },
    { mot: 'Lɔtɔ', transcription: 'lɔtɔ', traduction: 'Arachide', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Klô', transcription: 'klô', traduction: 'Village', categorie: 'lieux', exemplePhrase: 'N kɔ klô su', exempleTraduction: 'Je vais au village' },
    { mot: 'Fie', transcription: 'fie', traduction: 'Champ / Plantation', categorie: 'lieux' },
    { mot: 'Suklu', transcription: 'suklu', traduction: 'École', categorie: 'lieux' },
    { mot: 'Gwa', transcription: 'gwa', traduction: 'Marché', categorie: 'lieux' },
    { mot: 'Nvle kpli', transcription: 'nvle kpli', traduction: 'Grande ville', categorie: 'lieux' },
    { mot: 'Ayre dan', transcription: 'ayre dan', traduction: 'Hôpital / Dispensaire', categorie: 'lieux' },
    { mot: 'Ɲanmiɛn sua', transcription: 'ɲanmiɛn sua', traduction: 'Église / Lieu de prière', categorie: 'lieux' },
    { mot: 'Nzuɛ bo', transcription: 'nzuɛ bo', traduction: 'Rivière / Marigot', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Sran bo junman', transcription: 'sran bo junman', traduction: 'Travailleur', categorie: 'vie_sociale' },
    { mot: 'Fie su difuɛ', transcription: 'fie su difuɛ', traduction: 'Cultivateur / Agriculteur', categorie: 'vie_sociale' },
    { mot: 'Jue tafuɛ', transcription: 'jue tafuɛ', traduction: 'Pêcheur', categorie: 'vie_sociale' },
    { mot: 'Ayre yofuɛ', transcription: 'ayre yofuɛ', traduction: 'Médecin / Guérisseur', categorie: 'vie_sociale' },
    { mot: 'Like klefuɛ', transcription: 'like klefuɛ', traduction: 'Enseignant / Maître', categorie: 'vie_sociale' },
    { mot: 'Gwa su atɛ yofuɛ', transcription: 'gwa su atɛ yofuɛ', traduction: 'Commerçant / Vendeur', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Kpli', transcription: 'kpli', traduction: 'Grand / Gros', categorie: 'expressions', exemplePhrase: 'Blɔ kpli', exempleTraduction: 'Grande maison' },
    { mot: 'Kaan', transcription: 'kaan', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Kpa', transcription: 'kpa', traduction: 'Bon / Bien', categorie: 'expressions' },
    { mot: 'Tɛ', transcription: 'tɛ', traduction: 'Mauvais', categorie: 'expressions' },
    { mot: 'Uflɛ', transcription: 'uflɛ', traduction: 'Nouveau / Neuf', categorie: 'expressions' },
    { mot: 'Nvle', transcription: 'nvle', traduction: 'Vieux / Ancien', categorie: 'expressions' },
    { mot: 'Nglɛnglɛ', transcription: 'nglɛnglɛ', traduction: 'Beau / Joli', categorie: 'expressions' },
    { mot: 'Wawa', transcription: 'wawa', traduction: 'Chaud', categorie: 'expressions' },
    { mot: 'Blɔɔ', transcription: 'blɔɔ', traduction: 'Froid', categorie: 'expressions' },
    { mot: 'Nɲɔnlɛ', transcription: 'nɲɔnlɛ', traduction: 'Rapide / Vite', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Tukpaciɛ', transcription: 'tukpaciɛ', traduction: 'Maladie', categorie: 'corps', exemplePhrase: 'Tukpaciɛ kle min', exempleTraduction: 'Je suis malade' },
    { mot: 'Ayre', transcription: 'ayre', traduction: 'Médicament / Remède', categorie: 'corps' },
    { mot: 'Mmoja', transcription: 'mmoja', traduction: 'Sang', categorie: 'corps' },
    { mot: 'Ase', transcription: 'ase', traduction: 'Os', categorie: 'corps' },
    { mot: 'Kpɛn', transcription: 'kpɛn', traduction: 'Douleur / Avoir mal', categorie: 'corps' },
    // --- Objets du quotidien ---
    { mot: 'Sua', transcription: 'sua', traduction: 'Chambre / Pièce', categorie: 'habitat' },
    { mot: 'Buali', transcription: 'buali', traduction: 'Marmite / Casserole', categorie: 'habitat' },
    { mot: 'Talɛ', transcription: 'talɛ', traduction: 'Assiette / Plat', categorie: 'habitat' },
    { mot: 'Ngo', transcription: 'ngo', traduction: 'Cuillère', categorie: 'habitat' },
    { mot: 'Kɔtrɔ', transcription: 'kɔtrɔ', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Klanzin', transcription: 'klanzin', traduction: 'Lampe / Lumière', categorie: 'habitat' },
    { mot: 'Bia', transcription: 'bia', traduction: 'Chaise / Trône', categorie: 'habitat' },
    { mot: 'Bua', transcription: 'bua', traduction: 'Lit / Natte', categorie: 'habitat' },
    // --- Temps ---
    { mot: 'Andɛ', transcription: 'andɛ', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne' },
    { mot: 'Kunmin', transcription: 'kunmin', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Nnɛn', transcription: 'nnɛn', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Nglɛmun', transcription: 'nglɛmun', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Nnɔsua', transcription: 'nnɔsua', traduction: 'Après-midi', categorie: 'vie_quotidienne' },
    { mot: 'Kɔnguɛ', transcription: 'kɔnguɛ', traduction: 'Nuit / Soir', categorie: 'vie_quotidienne' },
    { mot: 'Blɛ', transcription: 'blɛ', traduction: 'Temps / Moment', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kle', transcription: 'kle', traduction: 'Montrer / Enseigner', categorie: 'verbes' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kanngan', transcription: 'kanngan', traduction: 'Lire', categorie: 'verbes' },
    { mot: 'Su', transcription: 'su', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Seri', transcription: 'seri', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Suan', transcription: 'suan', traduction: 'Apprendre / Étudier', categorie: 'verbes' },
    { mot: 'Tɔ', transcription: 'tɔ', traduction: 'Cuisiner / Préparer', categorie: 'verbes' },
    { mot: 'Wla', transcription: 'wla', traduction: 'Porter (vêtement)', categorie: 'verbes' },
    { mot: 'Jran', transcription: 'jran', traduction: 'Se lever / Se tenir debout', categorie: 'verbes' },
    { mot: 'Tran', transcription: 'tran', traduction: 'S\'asseoir / Habiter', categorie: 'verbes' },
    { mot: 'Tɔn', transcription: 'tɔn', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Acheter', categorie: 'verbes' },
    // --- Chiffres 20-100 ---
    { mot: 'Abla', transcription: 'abla', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Abla blu', transcription: 'abla blu', traduction: 'Trente (30)', categorie: 'chiffres' },
    { mot: 'Abla nyo', transcription: 'abla nyo', traduction: 'Quarante (40)', categorie: 'chiffres' },
    { mot: 'Abla nyo blu', transcription: 'abla nyo blu', traduction: 'Cinquante (50)', categorie: 'chiffres' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Cent (100)', categorie: 'chiffres' },
  ],

  dioula: [
    // --- Fruits & Légumes ---
    { mot: 'Mangoro', transcription: 'mangoro', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Anana', transcription: 'anana', traduction: 'Ananas', categorie: 'nourriture' },
    { mot: 'Kɔkɔ', transcription: 'kɔkɔ', traduction: 'Noix de coco', categorie: 'nourriture' },
    { mot: 'Lɛmuru', transcription: 'lɛmuru', traduction: 'Orange / Citron', categorie: 'nourriture' },
    { mot: 'Papaya', transcription: 'papaya', traduction: 'Papaye', categorie: 'nourriture' },
    { mot: 'Tamati', transcription: 'tamati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Nturuba', transcription: 'nturuba', traduction: 'Aubergine', categorie: 'nourriture' },
    { mot: 'Foronto', transcription: 'foronto', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Gwan', transcription: 'gwan', traduction: 'Gombo', categorie: 'nourriture' },
    { mot: 'Tiga', transcription: 'tiga', traduction: 'Arachide', categorie: 'nourriture', exemplePhrase: 'Tiga na ka di', exempleTraduction: 'La sauce arachide est bonne' },
    { mot: 'Dɛgɛ', transcription: 'dɛgɛ', traduction: 'Manioc', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Dugu', transcription: 'dugu', traduction: 'Village / Ville', categorie: 'lieux' },
    { mot: 'Foro', transcription: 'foro', traduction: 'Champ', categorie: 'lieux', exemplePhrase: 'N bɛ taa foro la', exempleTraduction: 'Je vais au champ' },
    { mot: 'Lakɔli', transcription: 'lakɔli', traduction: 'École', categorie: 'lieux' },
    { mot: 'Lɔgɔ', transcription: 'lɔgɔ', traduction: 'Marché', categorie: 'lieux' },
    { mot: 'Dɔgɔtɔrɔso', transcription: 'dɔgɔtɔrɔso', traduction: 'Hôpital', categorie: 'lieux' },
    { mot: 'Misiri', transcription: 'misiri', traduction: 'Mosquée', categorie: 'lieux' },
    { mot: 'Egilisi', transcription: 'egilisi', traduction: 'Église', categorie: 'lieux' },
    { mot: 'Ba', transcription: 'ba', traduction: 'Fleuve / Rivière', categorie: 'lieux' },
    { mot: 'Kulu', transcription: 'kulu', traduction: 'Montagne / Colline', categorie: 'lieux' },
    { mot: 'Sira', transcription: 'sira', traduction: 'Route / Chemin', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Sɛnɛkɛla', transcription: 'sɛnɛkɛla', traduction: 'Cultivateur', categorie: 'vie_sociale', exemplePhrase: 'N fa ye sɛnɛkɛla ye', exempleTraduction: 'Mon père est cultivateur' },
    { mot: 'Jɛgɛli', transcription: 'jɛgɛli', traduction: 'Pêcheur', categorie: 'vie_sociale' },
    { mot: 'Dɔgɔtɔrɔ', transcription: 'dɔgɔtɔrɔ', traduction: 'Médecin', categorie: 'vie_sociale' },
    { mot: 'Karamɔgɔ', transcription: 'karamɔgɔ', traduction: 'Enseignant / Maître', categorie: 'vie_sociale' },
    { mot: 'Julakɛla', transcription: 'julakɛla', traduction: 'Commerçant', categorie: 'vie_sociale' },
    { mot: 'Numu', transcription: 'numu', traduction: 'Forgeron', categorie: 'vie_sociale' },
    { mot: 'Jeli', transcription: 'jeli', traduction: 'Griot', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Ba', transcription: 'ba', traduction: 'Grand / Gros', categorie: 'expressions' },
    { mot: 'Dɔgɔ', transcription: 'dɔgɔ', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Ɲuman', transcription: 'ɲuman', traduction: 'Bon / Beau', categorie: 'expressions', exemplePhrase: 'I ka ɲuman', exempleTraduction: 'Tu es beau/belle' },
    { mot: 'Jugu', transcription: 'jugu', traduction: 'Mauvais / Méchant', categorie: 'expressions' },
    { mot: 'Kura', transcription: 'kura', traduction: 'Nouveau / Neuf', categorie: 'expressions' },
    { mot: 'Kɔrɔ', transcription: 'kɔrɔ', traduction: 'Vieux / Ancien', categorie: 'expressions' },
    { mot: 'Gɛlɛn', transcription: 'gɛlɛn', traduction: 'Difficile / Dur', categorie: 'expressions' },
    { mot: 'Nɔgɔ', transcription: 'nɔgɔ', traduction: 'Facile', categorie: 'expressions' },
    { mot: 'Teliman', transcription: 'teliman', traduction: 'Rapide / Vite', categorie: 'expressions' },
    { mot: 'Dɔɔnin', transcription: 'dɔɔnin', traduction: 'Lent / Doucement', categorie: 'expressions' },
    { mot: 'Farin', transcription: 'farin', traduction: 'Chaud', categorie: 'expressions' },
    { mot: 'Suma', transcription: 'suma', traduction: 'Froid / Frais', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Bana', transcription: 'bana', traduction: 'Maladie', categorie: 'corps', exemplePhrase: 'Bana bɛ n la', exempleTraduction: 'Je suis malade' },
    { mot: 'Fura', transcription: 'fura', traduction: 'Médicament / Remède', categorie: 'corps' },
    { mot: 'Joli', transcription: 'joli', traduction: 'Sang', categorie: 'corps' },
    { mot: 'Kolo', transcription: 'kolo', traduction: 'Os', categorie: 'corps' },
    { mot: 'Dimi', transcription: 'dimi', traduction: 'Douleur', categorie: 'corps', exemplePhrase: 'N sen bɛ n dimi', exempleTraduction: 'Mon pied me fait mal' },
    { mot: 'Kɛnɛya', transcription: 'kɛnɛya', traduction: 'Santé / Bonne santé', categorie: 'corps' },
    // --- Objets ---
    { mot: 'Bɔn', transcription: 'bɔn', traduction: 'Chambre', categorie: 'habitat' },
    { mot: 'Daga', transcription: 'daga', traduction: 'Marmite', categorie: 'habitat' },
    { mot: 'Filen', transcription: 'filen', traduction: 'Assiette', categorie: 'habitat' },
    { mot: 'Muru', transcription: 'muru', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Fitini', transcription: 'fitini', traduction: 'Lampe / Lumière', categorie: 'habitat' },
    { mot: 'Sigi', transcription: 'sigi', traduction: 'Chaise / Siège', categorie: 'habitat' },
    { mot: 'Dala', transcription: 'dala', traduction: 'Lit / Natte', categorie: 'habitat' },
    { mot: 'Sɛbɛn', transcription: 'sɛbɛn', traduction: 'Papier / Livre', categorie: 'vie_quotidienne' },
    // --- Temps ---
    { mot: 'Bi', transcription: 'bi', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne', exemplePhrase: 'Bi ye tile ɲuman ye', exempleTraduction: 'Aujourd\'hui est un bon jour' },
    { mot: 'Sini', transcription: 'sini', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Kunu', transcription: 'kunu', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Sɔgɔma', transcription: 'sɔgɔma', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Tilefɛ', transcription: 'tilefɛ', traduction: 'Après-midi', categorie: 'vie_quotidienne' },
    { mot: 'Su', transcription: 'su', traduction: 'Nuit / Soir', categorie: 'vie_quotidienne' },
    { mot: 'Waati', transcription: 'waati', traduction: 'Temps / Heure', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kalan', transcription: 'kalan', traduction: 'Étudier / Lire / Apprendre', categorie: 'verbes', exemplePhrase: 'N bɛ kalan kɛ', exempleTraduction: 'J\'étudie' },
    { mot: 'Sɛbɛn', transcription: 'sɛbɛn', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kasi', transcription: 'kasi', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Yɛlɛ', transcription: 'yɛlɛ', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Tobili', transcription: 'tobili', traduction: 'Cuisiner', categorie: 'verbes' },
    { mot: 'Don', transcription: 'don', traduction: 'Porter (vêtement) / Entrer', categorie: 'verbes' },
    { mot: 'Wili', transcription: 'wili', traduction: 'Se lever', categorie: 'verbes' },
    { mot: 'Sigi', transcription: 'sigi', traduction: 'S\'asseoir', categorie: 'verbes' },
    { mot: 'Feere', transcription: 'feere', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'San', transcription: 'san', traduction: 'Acheter', categorie: 'verbes', exemplePhrase: 'N bɛ malo san', exempleTraduction: 'J\'achète du riz' },
    { mot: 'Bɔli', transcription: 'bɔli', traduction: 'Courir', categorie: 'verbes' },
    { mot: 'Tɛmɛ', transcription: 'tɛmɛ', traduction: 'Passer / Traverser', categorie: 'verbes' },
    // --- Chiffres 20-100 ---
    { mot: 'Mugan', transcription: 'mugan', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Bi saba', transcription: 'bi saba', traduction: 'Trente (30)', categorie: 'chiffres' },
    { mot: 'Bi naani', transcription: 'bi naani', traduction: 'Quarante (40)', categorie: 'chiffres' },
    { mot: 'Bi duuru', transcription: 'bi duuru', traduction: 'Cinquante (50)', categorie: 'chiffres' },
    { mot: 'Kɛmɛ', transcription: 'kɛmɛ', traduction: 'Cent (100)', categorie: 'chiffres' },
    { mot: 'Ba kelen', transcription: 'ba kelen', traduction: 'Mille (1000)', categorie: 'chiffres' },
    // --- Expressions complémentaires ---
    { mot: 'Ala k\'an kisi', transcription: 'ala kan kisi', traduction: 'Que Dieu nous protège', categorie: 'spiritualite' },
    { mot: 'Alla ye ɲuman kɛ', transcription: 'alla ye ɲuman kɛ', traduction: 'Que Dieu fasse le bien', categorie: 'spiritualite' },
    { mot: 'Aw ni baara', transcription: 'aw ni baara', traduction: 'Merci pour le travail (à plusieurs)', categorie: 'salutations' },
    { mot: 'K\'an bɛn', transcription: 'kan bɛn', traduction: 'Au revoir (à demain)', categorie: 'salutations' },
  ],

  bete: [
    // --- Fruits & Légumes ---
    { mot: 'Mango', transcription: 'mango', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Kokoyè', transcription: 'kokoyè', traduction: 'Noix de coco', categorie: 'nourriture' },
    { mot: 'Tomati', transcription: 'tomati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Kpèkpè', transcription: 'kpèkpè', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Gbagba', transcription: 'gbagba', traduction: 'Aubergine', categorie: 'nourriture' },
    { mot: 'Nyan', transcription: 'nyan', traduction: 'Gombo', categorie: 'nourriture' },
    { mot: 'Kpaago', transcription: 'kpaago', traduction: 'Arachide', categorie: 'nourriture' },
    { mot: 'Baga', transcription: 'baga', traduction: 'Manioc', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Gle', transcription: 'gle', traduction: 'Village', categorie: 'lieux' },
    { mot: 'Klo', transcription: 'klo', traduction: 'Champ', categorie: 'lieux' },
    { mot: 'Lakulu', transcription: 'lakulu', traduction: 'École', categorie: 'lieux' },
    { mot: 'Gbata', transcription: 'gbata', traduction: 'Marché', categorie: 'lieux' },
    { mot: 'Gbo nyon', transcription: 'gbo nyon', traduction: 'Rivière', categorie: 'lieux' },
    { mot: 'Sila', transcription: 'sila', traduction: 'Route / Chemin', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Klo li yɛ', transcription: 'klo li yɛ', traduction: 'Cultivateur', categorie: 'vie_sociale' },
    { mot: 'Glô ta yɛ', transcription: 'glô ta yɛ', traduction: 'Pêcheur', categorie: 'vie_sociale' },
    { mot: 'Like klefuɛ', transcription: 'like klefuɛ', traduction: 'Enseignant', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Kpli', transcription: 'kpli', traduction: 'Grand', categorie: 'expressions' },
    { mot: 'Yri', transcription: 'yri', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Nyɛn', transcription: 'nyɛn', traduction: 'Bon / Beau', categorie: 'expressions' },
    { mot: 'Yra', transcription: 'yra', traduction: 'Mauvais', categorie: 'expressions' },
    { mot: 'Wli', transcription: 'wli', traduction: 'Chaud', categorie: 'expressions' },
    { mot: 'Frô', transcription: 'frô', traduction: 'Froid', categorie: 'expressions' },
    { mot: 'Nyan', transcription: 'nyan', traduction: 'Nouveau', categorie: 'expressions' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Vieux', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Yalɛ', transcription: 'yalɛ', traduction: 'Maladie', categorie: 'corps' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Médicament', categorie: 'corps' },
    { mot: 'Djê', transcription: 'djê', traduction: 'Sang', categorie: 'corps' },
    { mot: 'Kpra', transcription: 'kpra', traduction: 'Douleur', categorie: 'corps' },
    // --- Objets ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Marmite', categorie: 'habitat' },
    { mot: 'Plê', transcription: 'plê', traduction: 'Assiette', categorie: 'habitat' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Gblê', transcription: 'gblê', traduction: 'Lampe', categorie: 'habitat' },
    { mot: 'Bia', transcription: 'bia', traduction: 'Chaise', categorie: 'habitat' },
    // --- Temps ---
    { mot: 'Yanan', transcription: 'yanan', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne' },
    { mot: 'Sinin', transcription: 'sinin', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Gnèn', transcription: 'gnèn', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Dro', transcription: 'dro', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Yukô', transcription: 'yukô', traduction: 'Nuit', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kle', transcription: 'kle', traduction: 'Montrer / Enseigner', categorie: 'verbes' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kpla', transcription: 'kpla', traduction: 'Lire', categorie: 'verbes' },
    { mot: 'Sra', transcription: 'sra', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Fli', transcription: 'fli', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Tɔ', transcription: 'tɔ', traduction: 'Cuisiner', categorie: 'verbes' },
    { mot: 'Gbu', transcription: 'gbu', traduction: 'Courir', categorie: 'verbes' },
    { mot: 'Jran', transcription: 'jran', traduction: 'Se lever', categorie: 'verbes' },
    { mot: 'Tra', transcription: 'tra', traduction: 'S\'asseoir', categorie: 'verbes' },
    { mot: 'Tɔn', transcription: 'tɔn', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Acheter', categorie: 'verbes' },
    // --- Chiffres 20-100 ---
    { mot: 'Mwua', transcription: 'mwua', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Mwua vu', transcription: 'mwua vu', traduction: 'Trente (30)', categorie: 'chiffres' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Cent (100)', categorie: 'chiffres' },
  ],

  senoufo: [
    // --- Fruits & Légumes ---
    { mot: 'Mangoro', transcription: 'mangoro', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Tamati', transcription: 'tamati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Foronto', transcription: 'foronto', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Gwan', transcription: 'gwan', traduction: 'Gombo', categorie: 'nourriture' },
    { mot: 'Tiga', transcription: 'tiga', traduction: 'Arachide', categorie: 'nourriture' },
    { mot: 'Bananku', transcription: 'bananku', traduction: 'Banane plantain', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Kaha', transcription: 'kaha', traduction: 'Village', categorie: 'lieux' },
    { mot: 'Foro', transcription: 'foro', traduction: 'Champ', categorie: 'lieux' },
    { mot: 'Lakɔli', transcription: 'lakɔli', traduction: 'École', categorie: 'lieux' },
    { mot: 'Misiri', transcription: 'misiri', traduction: 'Mosquée', categorie: 'lieux' },
    { mot: 'Sira', transcription: 'sira', traduction: 'Route / Chemin', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Fɔlɔ', transcription: 'fɔlɔ', traduction: 'Cultivateur', categorie: 'vie_sociale' },
    { mot: 'Karagɔ', transcription: 'karagɔ', traduction: 'Enseignant', categorie: 'vie_sociale' },
    { mot: 'Numu', transcription: 'numu', traduction: 'Forgeron', categorie: 'vie_sociale' },
    { mot: 'Fono', transcription: 'fono', traduction: 'Tisserand', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Gbɔ', transcription: 'gbɔ', traduction: 'Grand', categorie: 'expressions' },
    { mot: 'Fiyen', transcription: 'fiyen', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Ɲuman', transcription: 'ɲuman', traduction: 'Bon / Beau', categorie: 'expressions' },
    { mot: 'Jugu', transcription: 'jugu', traduction: 'Mauvais', categorie: 'expressions' },
    { mot: 'Kura', transcription: 'kura', traduction: 'Nouveau', categorie: 'expressions' },
    { mot: 'Kɔrɔ', transcription: 'kɔrɔ', traduction: 'Vieux / Ancien', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Bana', transcription: 'bana', traduction: 'Maladie', categorie: 'corps' },
    { mot: 'Fura', transcription: 'fura', traduction: 'Médicament', categorie: 'corps' },
    { mot: 'Dimi', transcription: 'dimi', traduction: 'Douleur', categorie: 'corps' },
    // --- Objets ---
    { mot: 'Daga', transcription: 'daga', traduction: 'Marmite', categorie: 'habitat' },
    { mot: 'Muru', transcription: 'muru', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Sigi', transcription: 'sigi', traduction: 'Chaise', categorie: 'habitat' },
    { mot: 'Dala', transcription: 'dala', traduction: 'Lit / Natte', categorie: 'habitat' },
    // --- Temps ---
    { mot: 'Bi', transcription: 'bi', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne' },
    { mot: 'Sini', transcription: 'sini', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Kunu', transcription: 'kunu', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Sɔgɔma', transcription: 'sɔgɔma', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Wula', transcription: 'wula', traduction: 'Soir / Nuit', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kalan', transcription: 'kalan', traduction: 'Étudier / Lire', categorie: 'verbes' },
    { mot: 'Sɛbɛn', transcription: 'sɛbɛn', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kasi', transcription: 'kasi', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Yɛlɛ', transcription: 'yɛlɛ', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Tobili', transcription: 'tobili', traduction: 'Cuisiner', categorie: 'verbes' },
    { mot: 'Bɔli', transcription: 'bɔli', traduction: 'Courir', categorie: 'verbes' },
    { mot: 'Wili', transcription: 'wili', traduction: 'Se lever', categorie: 'verbes' },
    { mot: 'Sigi', transcription: 'sigi', traduction: 'S\'asseoir', categorie: 'verbes' },
    { mot: 'Feere', transcription: 'feere', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'San', transcription: 'san', traduction: 'Acheter', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Kɔrɔ', transcription: 'kɔrɔ', traduction: 'Aîné / Grand frère', categorie: 'famille' },
    { mot: 'Dɔgɔ', transcription: 'dɔgɔ', traduction: 'Cadet / Petit frère', categorie: 'famille' },
    // --- Chiffres ---
    { mot: 'Kɛlɛ fila', transcription: 'kɛlɛ fila', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Kɛmɛ', transcription: 'kɛmɛ', traduction: 'Cent (100)', categorie: 'chiffres' },
  ],

  agni: [
    // --- Fruits & Légumes ---
    { mot: 'Mangue', transcription: 'mangue', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Ananan', transcription: 'ananan', traduction: 'Ananas', categorie: 'nourriture' },
    { mot: 'Kokoe', transcription: 'kokoe', traduction: 'Noix de coco', categorie: 'nourriture' },
    { mot: 'Toroman', transcription: 'toroman', traduction: 'Orange', categorie: 'nourriture' },
    { mot: 'Tomati', transcription: 'tomati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Yêyê', transcription: 'yêyê', traduction: 'Gombo', categorie: 'nourriture' },
    { mot: 'Lɔtɔ', transcription: 'lɔtɔ', traduction: 'Arachide', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Klô', transcription: 'klô', traduction: 'Village', categorie: 'lieux' },
    { mot: 'Fie', transcription: 'fie', traduction: 'Champ', categorie: 'lieux' },
    { mot: 'Suklu', transcription: 'suklu', traduction: 'École', categorie: 'lieux' },
    { mot: 'Nvle kpli', transcription: 'nvle kpli', traduction: 'Grande ville', categorie: 'lieux' },
    { mot: 'Nzuɛ bo', transcription: 'nzuɛ bo', traduction: 'Rivière', categorie: 'lieux' },
    { mot: 'Atin', transcription: 'atin', traduction: 'Route / Chemin', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Fie su difuɛ', transcription: 'fie su difuɛ', traduction: 'Cultivateur', categorie: 'vie_sociale' },
    { mot: 'Jue tafuɛ', transcription: 'jue tafuɛ', traduction: 'Pêcheur', categorie: 'vie_sociale' },
    { mot: 'Like klefuɛ', transcription: 'like klefuɛ', traduction: 'Enseignant', categorie: 'vie_sociale' },
    { mot: 'Atɛ yofuɛ', transcription: 'atɛ yofuɛ', traduction: 'Commerçant', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Kpli', transcription: 'kpli', traduction: 'Grand', categorie: 'expressions' },
    { mot: 'Kaan', transcription: 'kaan', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Kpa', transcription: 'kpa', traduction: 'Bon', categorie: 'expressions' },
    { mot: 'Tɛ', transcription: 'tɛ', traduction: 'Mauvais', categorie: 'expressions' },
    { mot: 'Nglɛnglɛ', transcription: 'nglɛnglɛ', traduction: 'Beau / Joli', categorie: 'expressions' },
    { mot: 'Wawa', transcription: 'wawa', traduction: 'Chaud', categorie: 'expressions' },
    { mot: 'Blɔɔ', transcription: 'blɔɔ', traduction: 'Froid', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Tukpaciɛ', transcription: 'tukpaciɛ', traduction: 'Maladie', categorie: 'corps' },
    { mot: 'Ayre', transcription: 'ayre', traduction: 'Médicament', categorie: 'corps' },
    { mot: 'Mmoja', transcription: 'mmoja', traduction: 'Sang', categorie: 'corps' },
    { mot: 'Kpɛn', transcription: 'kpɛn', traduction: 'Douleur', categorie: 'corps' },
    // --- Objets ---
    { mot: 'Sua', transcription: 'sua', traduction: 'Chambre', categorie: 'habitat' },
    { mot: 'Buali', transcription: 'buali', traduction: 'Marmite', categorie: 'habitat' },
    { mot: 'Talɛ', transcription: 'talɛ', traduction: 'Assiette', categorie: 'habitat' },
    { mot: 'Kɔtrɔ', transcription: 'kɔtrɔ', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Bia', transcription: 'bia', traduction: 'Chaise', categorie: 'habitat' },
    // --- Temps ---
    { mot: 'Andɛ', transcription: 'andɛ', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne' },
    { mot: 'Kunmin', transcription: 'kunmin', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Nnɛn', transcription: 'nnɛn', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Nglɛmun', transcription: 'nglɛmun', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Kɔnguɛ', transcription: 'kɔnguɛ', traduction: 'Nuit / Soir', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kle', transcription: 'kle', traduction: 'Montrer', categorie: 'verbes' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kanngan', transcription: 'kanngan', traduction: 'Lire', categorie: 'verbes' },
    { mot: 'Su', transcription: 'su', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Seri', transcription: 'seri', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Tɔ', transcription: 'tɔ', traduction: 'Cuisiner', categorie: 'verbes' },
    { mot: 'Tɔn', transcription: 'tɔn', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Acheter', categorie: 'verbes' },
    { mot: 'Jran', transcription: 'jran', traduction: 'Se lever', categorie: 'verbes' },
    { mot: 'Tran', transcription: 'tran', traduction: 'S\'asseoir / Habiter', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Aniaan', transcription: 'aniaan', traduction: 'Frère / Soeur', categorie: 'famille' },
    { mot: 'Siman', transcription: 'siman', traduction: 'Grand-père', categorie: 'famille' },
    { mot: 'Awlo', transcription: 'awlo', traduction: 'Famille / Foyer', categorie: 'famille' },
    // --- Chiffres ---
    { mot: 'Abla', transcription: 'abla', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Cent (100)', categorie: 'chiffres' },
  ],

  gouro: [
    // --- Fruits & Légumes ---
    { mot: 'Mango', transcription: 'mango', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Koko', transcription: 'koko', traduction: 'Noix de coco', categorie: 'nourriture' },
    { mot: 'Tomati', transcription: 'tomati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Kpèkpè', transcription: 'kpèkpè', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Kpaago', transcription: 'kpaago', traduction: 'Arachide', categorie: 'nourriture' },
    { mot: 'Baga', transcription: 'baga', traduction: 'Manioc', categorie: 'nourriture' },
    { mot: 'Sogo', transcription: 'sogo', traduction: 'Viande', categorie: 'nourriture' },
    { mot: 'Djê', transcription: 'djê', traduction: 'Sel', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Gle', transcription: 'gle', traduction: 'Village', categorie: 'lieux' },
    { mot: 'Klo', transcription: 'klo', traduction: 'Champ', categorie: 'lieux' },
    { mot: 'Lakulu', transcription: 'lakulu', traduction: 'École', categorie: 'lieux' },
    { mot: 'Gbata', transcription: 'gbata', traduction: 'Marché', categorie: 'lieux' },
    { mot: 'Sila', transcription: 'sila', traduction: 'Route', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Klo li yɛ', transcription: 'klo li yɛ', traduction: 'Cultivateur', categorie: 'vie_sociale' },
    { mot: 'Gblɔ ta yɛ', transcription: 'gblɔ ta yɛ', traduction: 'Pêcheur', categorie: 'vie_sociale' },
    { mot: 'Numu', transcription: 'numu', traduction: 'Forgeron', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Kpli', transcription: 'kpli', traduction: 'Grand', categorie: 'expressions' },
    { mot: 'Yri', transcription: 'yri', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Nyɛn', transcription: 'nyɛn', traduction: 'Bon / Beau', categorie: 'expressions' },
    { mot: 'Yra', transcription: 'yra', traduction: 'Mauvais', categorie: 'expressions' },
    { mot: 'Wli', transcription: 'wli', traduction: 'Chaud', categorie: 'expressions' },
    { mot: 'Frô', transcription: 'frô', traduction: 'Froid', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Yalɛ', transcription: 'yalɛ', traduction: 'Maladie', categorie: 'corps' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Médicament', categorie: 'corps' },
    { mot: 'Kpra', transcription: 'kpra', traduction: 'Douleur', categorie: 'corps' },
    // --- Objets ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Marmite', categorie: 'habitat' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Bia', transcription: 'bia', traduction: 'Chaise', categorie: 'habitat' },
    { mot: 'Gblê', transcription: 'gblê', traduction: 'Lampe', categorie: 'habitat' },
    // --- Temps ---
    { mot: 'Yanan', transcription: 'yanan', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne' },
    { mot: 'Sinin', transcription: 'sinin', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Gnèn', transcription: 'gnèn', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Dro', transcription: 'dro', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Yukô', transcription: 'yukô', traduction: 'Nuit', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kle', transcription: 'kle', traduction: 'Montrer', categorie: 'verbes' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kpla', transcription: 'kpla', traduction: 'Lire', categorie: 'verbes' },
    { mot: 'Sra', transcription: 'sra', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Fli', transcription: 'fli', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Tɔ', transcription: 'tɔ', traduction: 'Cuisiner', categorie: 'verbes' },
    { mot: 'Gbu', transcription: 'gbu', traduction: 'Courir', categorie: 'verbes' },
    { mot: 'Jran', transcription: 'jran', traduction: 'Se lever', categorie: 'verbes' },
    { mot: 'Tra', transcription: 'tra', traduction: 'S\'asseoir', categorie: 'verbes' },
    { mot: 'Tɔn', transcription: 'tɔn', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Acheter', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Gɔgɔ', transcription: 'gɔgɔ', traduction: 'Père', categorie: 'famille' },
    { mot: 'Yè', transcription: 'yè', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Nyu gbo', transcription: 'nyu gbo', traduction: 'Frère / Soeur', categorie: 'famille' },
    // --- Animaux supplémentaires ---
    { mot: 'Gnɔ', transcription: 'gnɔ', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Bli', transcription: 'bli', traduction: 'Chèvre', categorie: 'animaux' },
    { mot: 'Nɔɔ', transcription: 'nɔɔ', traduction: 'Vache', categorie: 'animaux' },
    // --- Corps supplémentaire ---
    { mot: 'Wli', transcription: 'wli', traduction: 'Dent', categorie: 'corps' },
    { mot: 'Ku', transcription: 'ku', traduction: 'Ventre', categorie: 'corps' },
    { mot: 'Djê', transcription: 'djê', traduction: 'Sang', categorie: 'corps' },
    // --- Chiffres ---
    { mot: 'Mwua', transcription: 'mwua', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Cent (100)', categorie: 'chiffres' },
    // --- Expressions ---
    { mot: 'N gba wa', transcription: 'n gba wa', traduction: 'Pardon', categorie: 'expressions' },
    { mot: 'I klê dê?', transcription: 'i klê dê', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
    { mot: 'N klê...', transcription: 'n klê', traduction: 'Je m\'appelle...', categorie: 'expressions' },
  ],

  guere: [
    // --- Fruits & Légumes ---
    { mot: 'Mango', transcription: 'mango', traduction: 'Mangue', categorie: 'nourriture' },
    { mot: 'Koko', transcription: 'koko', traduction: 'Noix de coco', categorie: 'nourriture' },
    { mot: 'Tomati', transcription: 'tomati', traduction: 'Tomate', categorie: 'nourriture' },
    { mot: 'Kpèkpè', transcription: 'kpèkpè', traduction: 'Piment', categorie: 'nourriture' },
    { mot: 'Kpaago', transcription: 'kpaago', traduction: 'Arachide', categorie: 'nourriture' },
    { mot: 'Baga', transcription: 'baga', traduction: 'Manioc', categorie: 'nourriture' },
    { mot: 'Djê', transcription: 'djê', traduction: 'Sel', categorie: 'nourriture' },
    // --- Lieux ---
    { mot: 'Gle', transcription: 'gle', traduction: 'Village', categorie: 'lieux' },
    { mot: 'Klo', transcription: 'klo', traduction: 'Champ', categorie: 'lieux' },
    { mot: 'Lakulu', transcription: 'lakulu', traduction: 'École', categorie: 'lieux' },
    { mot: 'Gbata', transcription: 'gbata', traduction: 'Marché', categorie: 'lieux' },
    { mot: 'Sila', transcription: 'sila', traduction: 'Route', categorie: 'lieux' },
    { mot: 'Gbo nyon', transcription: 'gbo nyon', traduction: 'Rivière', categorie: 'lieux' },
    // --- Métiers ---
    { mot: 'Klo li yɛ', transcription: 'klo li yɛ', traduction: 'Cultivateur', categorie: 'vie_sociale' },
    { mot: 'Glô ta yɛ', transcription: 'glô ta yɛ', traduction: 'Pêcheur', categorie: 'vie_sociale' },
    { mot: 'Numu', transcription: 'numu', traduction: 'Forgeron', categorie: 'vie_sociale' },
    // --- Adjectifs ---
    { mot: 'Kpli', transcription: 'kpli', traduction: 'Grand', categorie: 'expressions' },
    { mot: 'Yri', transcription: 'yri', traduction: 'Petit', categorie: 'expressions' },
    { mot: 'Nyɛn', transcription: 'nyɛn', traduction: 'Bon', categorie: 'expressions' },
    { mot: 'Yra', transcription: 'yra', traduction: 'Mauvais', categorie: 'expressions' },
    { mot: 'Wli', transcription: 'wli', traduction: 'Chaud', categorie: 'expressions' },
    { mot: 'Frô', transcription: 'frô', traduction: 'Froid', categorie: 'expressions' },
    // --- Santé ---
    { mot: 'Yalɛ', transcription: 'yalɛ', traduction: 'Maladie', categorie: 'corps' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Médicament', categorie: 'corps' },
    { mot: 'Djê', transcription: 'djê', traduction: 'Sang', categorie: 'corps' },
    { mot: 'Kpra', transcription: 'kpra', traduction: 'Douleur', categorie: 'corps' },
    // --- Objets ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Marmite', categorie: 'habitat' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Couteau', categorie: 'habitat' },
    { mot: 'Bia', transcription: 'bia', traduction: 'Chaise', categorie: 'habitat' },
    { mot: 'Gblê', transcription: 'gblê', traduction: 'Lampe', categorie: 'habitat' },
    // --- Temps ---
    { mot: 'Yanan', transcription: 'yanan', traduction: 'Aujourd\'hui', categorie: 'vie_quotidienne' },
    { mot: 'Sinin', transcription: 'sinin', traduction: 'Demain', categorie: 'vie_quotidienne' },
    { mot: 'Gnèn', transcription: 'gnèn', traduction: 'Hier', categorie: 'vie_quotidienne' },
    { mot: 'Dro', transcription: 'dro', traduction: 'Matin', categorie: 'vie_quotidienne' },
    { mot: 'Yukô', transcription: 'yukô', traduction: 'Nuit', categorie: 'vie_quotidienne' },
    // --- Verbes complémentaires ---
    { mot: 'Kle', transcription: 'kle', traduction: 'Montrer', categorie: 'verbes' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Kpla', transcription: 'kpla', traduction: 'Lire', categorie: 'verbes' },
    { mot: 'Sra', transcription: 'sra', traduction: 'Pleurer', categorie: 'verbes' },
    { mot: 'Fli', transcription: 'fli', traduction: 'Rire', categorie: 'verbes' },
    { mot: 'Tɔ', transcription: 'tɔ', traduction: 'Cuisiner', categorie: 'verbes' },
    { mot: 'Gbu', transcription: 'gbu', traduction: 'Courir', categorie: 'verbes' },
    { mot: 'Jran', transcription: 'jran', traduction: 'Se lever', categorie: 'verbes' },
    { mot: 'Tra', transcription: 'tra', traduction: 'S\'asseoir', categorie: 'verbes' },
    { mot: 'Tɔn', transcription: 'tɔn', traduction: 'Vendre', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Acheter', categorie: 'verbes' },
    // --- Famille ---
    { mot: 'Yɔ gbo', transcription: 'yɔ gbo', traduction: 'Grand-mère', categorie: 'famille' },
    // --- Animaux supplémentaires ---
    { mot: 'Gnɔ', transcription: 'gnɔ', traduction: 'Chat', categorie: 'animaux' },
    { mot: 'Bli', transcription: 'bli', traduction: 'Chèvre', categorie: 'animaux' },
    { mot: 'Nɔɔ', transcription: 'nɔɔ', traduction: 'Vache', categorie: 'animaux' },
    // --- Corps supplémentaire ---
    { mot: 'Wli', transcription: 'wli', traduction: 'Dent', categorie: 'corps' },
    { mot: 'Mlu', transcription: 'mlu', traduction: 'Nez', categorie: 'corps' },
    // --- Chiffres ---
    { mot: 'Mwua', transcription: 'mwua', traduction: 'Vingt (20)', categorie: 'chiffres' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Cent (100)', categorie: 'chiffres' },
    // --- Expressions ---
    { mot: 'I klê dê?', transcription: 'i klê dê', traduction: 'Comment tu t\'appelles ?', categorie: 'expressions' },
    { mot: 'N klê...', transcription: 'n klê', traduction: 'Je m\'appelle...', categorie: 'expressions' },
  ],

  nouchi: [
    // --- Verbes populaires ---
    { mot: 'Kiffer', transcription: 'kiffer', traduction: 'Aimer beaucoup / Adorer', categorie: 'verbes', exemplePhrase: 'Je kiffe ce son', exempleTraduction: 'J\'adore cette musique' },
    { mot: 'Cailler', transcription: 'cailler', traduction: 'S\'amuser / Profiter', categorie: 'verbes', exemplePhrase: 'On va cailler ce soir', exempleTraduction: 'On va s\'amuser ce soir' },
    { mot: 'Enjailler', transcription: 'enjailler', traduction: 'S\'ambiancer / Faire la fête', categorie: 'verbes' },
    { mot: 'Grotter', transcription: 'grotter', traduction: 'Habiter / Vivre dans un endroit', categorie: 'verbes', exemplePhrase: 'Je grotte à Yopougon', exempleTraduction: 'J\'habite à Yopougon' },
    { mot: 'Gouper', transcription: 'gouper', traduction: 'Avoir peur', categorie: 'verbes' },
    { mot: 'Damer', transcription: 'damer', traduction: 'Manger', categorie: 'verbes', exemplePhrase: 'On va damer ?', exempleTraduction: 'On va manger ?' },
    { mot: 'Flécher', transcription: 'flécher', traduction: 'Draguer / Courtiser', categorie: 'verbes' },
    { mot: 'Boucaner', transcription: 'boucaner', traduction: 'Se mettre en colère / Fulminer', categorie: 'verbes' },
    { mot: 'Saper', transcription: 'saper', traduction: 'S\'habiller avec style', categorie: 'verbes', exemplePhrase: 'Il est bien sapé', exempleTraduction: 'Il est bien habillé' },
    { mot: 'Taper le cauris', transcription: 'taper le cauris', traduction: 'Perdre son temps / Gaspiller', categorie: 'verbes' },
    // --- Lieux d'Abidjan ---
    { mot: 'Yop', transcription: 'yop', traduction: 'Yopougon (commune populaire)', categorie: 'lieux', exemplePhrase: 'Les gens de Yop sont chauds', exempleTraduction: 'Les habitants de Yopougon sont dynamiques' },
    { mot: 'Abobo', transcription: 'abobo', traduction: 'Abobo (commune populaire nord)', categorie: 'lieux' },
    { mot: 'Cocody', transcription: 'cocody', traduction: 'Cocody (quartier résidentiel chic)', categorie: 'lieux' },
    { mot: 'Plateau', transcription: 'plateau', traduction: 'Le Plateau (centre d\'affaires)', categorie: 'lieux' },
    { mot: 'Treich', transcription: 'treich', traduction: 'Treichville (quartier historique)', categorie: 'lieux' },
    { mot: 'Adjamé', transcription: 'adjamé', traduction: 'Adjamé (quartier commerçant)', categorie: 'lieux' },
    // --- Nourriture complémentaire ---
    { mot: 'Tchep', transcription: 'tchep', traduction: 'Riz au gras sénégalais', categorie: 'nourriture' },
    { mot: 'Placali', transcription: 'placali', traduction: 'Pâte de manioc fermenté', categorie: 'nourriture' },
    { mot: 'Aloko', transcription: 'aloko', traduction: 'Banane plantain frite (variante de alloco)', categorie: 'nourriture' },
    { mot: 'Choukouya', transcription: 'choukouya', traduction: 'Brochettes de viande grillée épicée', categorie: 'nourriture' },
    { mot: 'Djoumblé', transcription: 'djoumblé', traduction: 'Riz sauce gombo', categorie: 'nourriture' },
    // --- Expressions complémentaires ---
    { mot: 'C\'est doux', transcription: "c'est doux", traduction: 'C\'est agréable / C\'est bien', categorie: 'expressions', exemplePhrase: 'La vie est doux ici', exempleTraduction: 'La vie est agréable ici' },
    { mot: 'Ça va aller', transcription: 'sa va aller', traduction: 'Tout ira bien (encouragement)', categorie: 'expressions' },
    { mot: 'Tu es fort', transcription: 'tu è for', traduction: 'Tu es doué / Bravo (compliment)', categorie: 'expressions' },
    { mot: 'C\'est chaud', transcription: "c'est chaud", traduction: 'C\'est difficile / compliqué', categorie: 'expressions' },
    { mot: 'Au village', transcription: 'o vilaj', traduction: 'Dans son village d\'origine / Chez soi', categorie: 'expressions' },
    { mot: 'C\'est cadeau', transcription: "c'est cadeau", traduction: 'C\'est gratuit / C\'est offert', categorie: 'expressions' },
    { mot: 'Massa', transcription: 'massa', traduction: 'Chef / Patron (terme respectueux)', categorie: 'vie_sociale' },
    { mot: 'Mogo', transcription: 'mogo', traduction: 'Quelqu\'un d\'important / VIP', categorie: 'vie_sociale' },
    { mot: 'Esprit', transcription: 'esprit', traduction: 'Intelligence / Ruse / Malice', categorie: 'expressions', exemplePhrase: 'Il a l\'esprit', exempleTraduction: 'Il est malin' },
    { mot: 'Faire le show', transcription: 'faire le show', traduction: 'Se donner en spectacle / Frimer', categorie: 'expressions' },
    // --- Musique & Culture ---
    { mot: 'Mapouka', transcription: 'mapouka', traduction: 'Danse traditionnelle devenue populaire', categorie: 'musique' },
    { mot: 'Logobi', transcription: 'logobi', traduction: 'Style de danse urbaine ivoirienne', categorie: 'musique' },
    { mot: 'DJ Arafat', transcription: 'dj arafat', traduction: 'Légende du coupé-décalé (icône culturelle)', categorie: 'musique' },
    { mot: 'Youssoumba', transcription: 'youssoumba', traduction: 'Style musical traditionnel', categorie: 'musique' },
    // --- Commerce ---
    { mot: 'Bana-bana', transcription: 'bana-bana', traduction: 'Vendeur ambulant / Petit commerçant', categorie: 'vie_sociale' },
    { mot: 'Coxer', transcription: 'coxer', traduction: 'Rabatteur de transport (qui crie les destinations)', categorie: 'vie_sociale' },
    { mot: 'Tablier', transcription: 'tablier', traduction: 'Étalage de fortune / Petit commerce de rue', categorie: 'vie_sociale' },
    // --- Adjectifs / Personnalité ---
    { mot: 'Babi', transcription: 'babi', traduction: 'Bizarre / Chelou', categorie: 'personnalite' },
    { mot: 'Gnata', transcription: 'gnata', traduction: 'Paresseux / Fainéant', categorie: 'personnalite' },
    { mot: 'Kpê', transcription: 'kpê', traduction: 'Courageux / Costaud', categorie: 'personnalite' },
    { mot: 'Blo', transcription: 'blo', traduction: 'Fou / Dingue (pas péjoratif)', categorie: 'personnalite', exemplePhrase: 'Tu es blo !', exempleTraduction: 'Tu es dingue !' },
    { mot: 'Sapeur', transcription: 'sapeur', traduction: 'Personne très bien habillée / Élégant', categorie: 'personnalite' },
  ],
};

// --- Phrases utiles V3 ---
const PHRASES_V3 = {
  baoule: [
    { phrase: 'N su suan Baoulé aniɛn', traduction: 'J\'apprends la langue Baoulé', transcription: 'n su suan baoulé aniɛn', categorie: 'expressions', contexte: 'Apprentissage' },
    { phrase: 'Tukpaciɛ kle min', traduction: 'Je suis malade', transcription: 'tukpaciɛ kle min', categorie: 'corps', contexte: 'Santé' },
    { phrase: 'Fie su difuɛ yo min', traduction: 'Je suis cultivateur', transcription: 'fie su difuɛ yo min', categorie: 'vie_sociale', contexte: 'Présentation' },
    { phrase: 'Nglɛmun kpa', traduction: 'Bonne matinée', transcription: 'nglɛmun kpa', categorie: 'salutations', contexte: 'Matin' },
    { phrase: 'Like klefuɛ yo min', traduction: 'Je suis enseignant', transcription: 'like klefuɛ yo min', categorie: 'vie_sociale', contexte: 'Présentation' },
  ],
  dioula: [
    { phrase: 'N bɛ Julakan kalan na', traduction: 'J\'apprends le Dioula', transcription: 'n bɛ julakan kalan na', categorie: 'expressions', contexte: 'Apprentissage' },
    { phrase: 'Bana bɛ n la', traduction: 'Je suis malade', transcription: 'bana bɛ n la', categorie: 'corps', contexte: 'Santé' },
    { phrase: 'N ye sɛnɛkɛla ye', traduction: 'Je suis cultivateur', transcription: 'n ye sɛnɛkɛla ye', categorie: 'vie_sociale', contexte: 'Présentation' },
    { phrase: 'Dɔgɔtɔrɔso bɛ min?', traduction: 'Où est l\'hôpital ?', transcription: 'dɔgɔtɔrɔso bɛ min', categorie: 'lieux', contexte: 'Urgence' },
    { phrase: 'N bɛ sɛbɛn kalan na', traduction: 'J\'étudie un livre', transcription: 'n bɛ sɛbɛn kalan na', categorie: 'expressions', contexte: 'Apprentissage' },
    { phrase: 'Sira jumɛn bɛ taa lɔgɔ la?', traduction: 'Quel chemin va au marché ?', transcription: 'sira jumɛn bɛ taa lɔgɔ la', categorie: 'lieux', contexte: 'Orientation' },
  ],
  nouchi: [
    { phrase: 'Mon frère, on va cailler ce soir !', traduction: 'Mon ami, on va s\'amuser ce soir !', transcription: 'mon frèr on va kayé sé swar', categorie: 'expressions', contexte: 'Sortie' },
    { phrase: 'Je grotte à Yop', traduction: 'J\'habite à Yopougon', transcription: 'jé grott a yop', categorie: 'lieux', contexte: 'Présentation' },
    { phrase: 'Tantie, garba combien ?', traduction: 'Madame, combien coûte le garba ?', transcription: 'tanti garba konbien', categorie: 'nourriture', contexte: 'Marché' },
    { phrase: 'Il est bien sapé dèh !', traduction: 'Il est très bien habillé !', transcription: 'il è bien sapé dèh', categorie: 'expressions', contexte: 'Compliment' },
  ],
};


async function main() {
  console.log('🌍 Enrichissement V3 du dictionnaire Langues Ivoire...\n');

  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) {
    langMap[l.code] = l.id;
  }

  let totalWords = 0;
  let totalPhrases = 0;
  let skipped = 0;

  for (const [langCode, words] of Object.entries(DICTIONARY_V3)) {
    const languageId = langMap[langCode];
    if (!languageId) {
      console.log(`  ⚠️  Langue "${langCode}" non trouvée.`);
      continue;
    }

    console.log(`📖 ${langCode.toUpperCase()} — ${words.length} mots...`);

    for (const word of words) {
      const existing = await prisma.dictionaryEntry.findFirst({
        where: { languageId, mot: word.mot },
      });
      if (existing) { skipped++; continue; }

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

  for (const [langCode, phrases] of Object.entries(PHRASES_V3)) {
    const languageId = langMap[langCode];
    if (!languageId) continue;

    console.log(`💬 ${langCode.toUpperCase()} — ${phrases.length} phrases...`);

    for (const phrase of phrases) {
      const existing = await prisma.usefulPhrase.findFirst({
        where: { languageId, phrase: phrase.phrase },
      });
      if (existing) { skipped++; continue; }

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
