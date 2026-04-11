const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// DICTIONNAIRE — 8 LANGUES
// ============================================================
const DICTIONARY = {
  baoule: [
    { mot: 'Mô ô', transcription: 'mɔ ɔ', traduction: 'Bonjour (à une personne)', categorie: 'salutations', exemplePhrase: 'Mô ô, a di ?' },
    { mot: 'Mô wô', transcription: 'mɔ wɔ', traduction: 'Bonjour (à plusieurs)', categorie: 'salutations', exemplePhrase: 'Mô wô, amɔnin di ?' },
    { mot: 'Akwaba', transcription: 'akwaba', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'A yako', transcription: 'a yako', traduction: 'Bonne continuation / Au revoir', categorie: 'salutations' },
    { mot: 'N\'da', transcription: 'nda', traduction: 'Maman', categorie: 'famille' },
    { mot: 'N\'si', transcription: 'nsi', traduction: 'Papa', categorie: 'famille' },
    { mot: 'Nyɛn', transcription: 'nyɛn', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Nzuɛ', transcription: 'nzuɛ', traduction: 'Eau', categorie: 'nature' },
    { mot: 'Blɔ', transcription: 'blɔ', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Onuon', transcription: 'onuon', traduction: 'Poisson', categorie: 'nourriture' },
    { mot: 'Yam', transcription: 'yam', traduction: 'Igname', categorie: 'nourriture' },
    { mot: 'Kɛkɛ', transcription: 'kɛkɛ', traduction: 'Vélo', categorie: 'transport' },
    { mot: 'Finfin', transcription: 'finfin', traduction: 'Argent', categorie: 'vie_quotidienne' },
    { mot: 'Ewɔ', transcription: 'ewɔ', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Ango', transcription: 'ango', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Nyɛnmɛ', transcription: 'nyɛnmɛ', traduction: 'Dieu', categorie: 'spiritualite' },
    { mot: 'Sran', transcription: 'sran', traduction: 'Personne / Être humain', categorie: 'vie_sociale' },
    { mot: 'Nnua', transcription: 'nnua', traduction: 'Arbre', categorie: 'nature' },
    { mot: 'Waka', transcription: 'waka', traduction: 'Marcher / Aller', categorie: 'verbes' },
    { mot: 'Di', transcription: 'di', traduction: 'Manger / Être bien (salutation)', categorie: 'verbes' },
  ],
  dioula: [
    { mot: 'I ni sɔgɔma', transcription: 'i ni sogoma', traduction: 'Bonjour (matin)', categorie: 'salutations', exemplePhrase: 'I ni sɔgɔma, i ka kɛnɛ wa ?' },
    { mot: 'I ni tile', transcription: 'i ni tile', traduction: 'Bonjour (après-midi)', categorie: 'salutations' },
    { mot: 'I ni wula', transcription: 'i ni wula', traduction: 'Bonsoir', categorie: 'salutations' },
    { mot: 'Aw ni ce', transcription: 'aw ni cɛ', traduction: 'Merci (à plusieurs)', categorie: 'salutations' },
    { mot: 'I ni ce', transcription: 'i ni cɛ', traduction: 'Merci (à une personne)', categorie: 'salutations' },
    { mot: 'Ani', transcription: 'ani', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Ayi', transcription: 'ayi', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Mɔgɔ', transcription: 'mɔgɔ', traduction: 'Personne', categorie: 'vie_sociale' },
    { mot: 'Den', transcription: 'dɛn', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Fa', transcription: 'fa', traduction: 'Père', categorie: 'famille' },
    { mot: 'Ba', transcription: 'ba', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Ji', transcription: 'ji', traduction: 'Eau', categorie: 'nature' },
    { mot: 'So', transcription: 'so', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Wari', transcription: 'wari', traduction: 'Argent', categorie: 'vie_quotidienne' },
    { mot: 'Dugu', transcription: 'dugu', traduction: 'Village / Ville', categorie: 'geographie' },
    { mot: 'Tɔgɔ', transcription: 'tɔgɔ', traduction: 'Nom', categorie: 'identite' },
    { mot: 'Kɔnɔ', transcription: 'kɔnɔ', traduction: 'Ventre / Intérieur', categorie: 'corps' },
    { mot: 'Suman', transcription: 'suman', traduction: 'Fétiche / Amulette', categorie: 'spiritualite' },
    { mot: 'Cɛ', transcription: 'cɛ', traduction: 'Homme / Mari', categorie: 'famille' },
    { mot: 'Muso', transcription: 'muso', traduction: 'Femme / Épouse', categorie: 'famille' },
  ],
  bete: [
    { mot: 'Gbahon', transcription: 'gbahon', traduction: 'Bonjour', categorie: 'salutations', exemplePhrase: 'Gbahon ! I ya ô' },
    { mot: 'I ya ô', transcription: 'i ya o', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Kpa-a', transcription: 'kpa-a', traduction: 'Merci', categorie: 'salutations' },
    { mot: 'Ao', transcription: 'ao', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Wê', transcription: 'wê', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Gbo', transcription: 'gbo', traduction: 'Eau', categorie: 'nature' },
    { mot: 'Gnon', transcription: 'gnon', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Nylu', transcription: 'nylu', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Gɔgɔ', transcription: 'gɔgɔ', traduction: 'Père', categorie: 'famille' },
    { mot: 'Yè', transcription: 'yè', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Zran', transcription: 'zran', traduction: 'Argent', categorie: 'vie_quotidienne' },
    { mot: 'Gbla', transcription: 'gbla', traduction: 'Homme', categorie: 'vie_sociale' },
    { mot: 'Pwa', transcription: 'pwa', traduction: 'Femme', categorie: 'vie_sociale' },
    { mot: 'Gle', transcription: 'gle', traduction: 'Champ / Village', categorie: 'geographie' },
    { mot: 'Bly', transcription: 'bly', traduction: 'Feu', categorie: 'nature' },
    { mot: 'Klô', transcription: 'klô', traduction: 'Forêt', categorie: 'nature' },
    { mot: 'Kouya', transcription: 'kouya', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Dyɛ', transcription: 'dyɛ', traduction: 'Dieu / Esprit', categorie: 'spiritualite' },
    { mot: 'Glô', transcription: 'glô', traduction: 'Poisson', categorie: 'nourriture' },
    { mot: 'Yên', transcription: 'yên', traduction: 'Igname', categorie: 'nourriture' },
  ],
  senoufo: [
    { mot: 'Kawelé', transcription: 'kawelé', traduction: 'Bonjour / Comment vas-tu ?', categorie: 'salutations', exemplePhrase: 'Kawelé ! Nanga !' },
    { mot: 'Nanga', transcription: 'nanga', traduction: 'Merci', categorie: 'salutations' },
    { mot: 'A nawan', transcription: 'a nawan', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Yɛɛ', transcription: 'yɛɛ', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Nayi', transcription: 'nayi', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Mogo', transcription: 'mogo', traduction: 'Eau', categorie: 'nature' },
    { mot: 'Cogo', transcription: 'cogo', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Tyɛlɛ', transcription: 'tyɛlɛ', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Folon', transcription: 'folon', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Tyen', transcription: 'tyen', traduction: 'Père', categorie: 'famille' },
    { mot: 'Ngo', transcription: 'ngo', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Katyo', transcription: 'katyo', traduction: 'Terre / Sol', categorie: 'nature' },
    { mot: 'Poro', transcription: 'poro', traduction: 'Société d\'initiation (sacré)', categorie: 'spiritualite' },
    { mot: 'Sogoyon', transcription: 'sogoyon', traduction: 'Animal', categorie: 'nature' },
    { mot: 'Nɔgɔ', transcription: 'nɔgɔ', traduction: 'Argent / Fer', categorie: 'vie_quotidienne' },
    { mot: 'Sando', transcription: 'sando', traduction: 'Devin / Voyant', categorie: 'spiritualite' },
    { mot: 'Kafɔ', transcription: 'kafɔ', traduction: 'Association / Groupe', categorie: 'vie_sociale' },
    { mot: 'Woro', transcription: 'woro', traduction: 'Noix de cola', categorie: 'traditions' },
    { mot: 'Kolo', transcription: 'kolo', traduction: 'Tam-tam / Tambour', categorie: 'musique' },
    { mot: 'Gbɔn', transcription: 'gbɔn', traduction: 'Feu', categorie: 'nature' },
  ],
  agni: [
    { mot: 'Mô ô', transcription: 'mɔ ɔ', traduction: 'Bonjour (singulier)', categorie: 'salutations', exemplePhrase: 'Mô ô, wo ho te sɛn ?' },
    { mot: 'Akwaba', transcription: 'akwaba', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Yɛbɛkɔ', transcription: 'yɛbɛkɔ', traduction: 'Au revoir', categorie: 'salutations' },
    { mot: 'Dabi', transcription: 'dabi', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Aane', transcription: 'aane', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Nsuo', transcription: 'nsuo', traduction: 'Eau', categorie: 'nature' },
    { mot: 'Fie', transcription: 'fie', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Abɔfra', transcription: 'abɔfra', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Sika', transcription: 'sika', traduction: 'Argent / Or', categorie: 'vie_quotidienne' },
    { mot: 'Onipa', transcription: 'onipa', traduction: 'Personne', categorie: 'vie_sociale' },
    { mot: 'Nyame', transcription: 'nyame', traduction: 'Dieu', categorie: 'spiritualite' },
    { mot: 'Agya', transcription: 'agya', traduction: 'Père', categorie: 'famille' },
    { mot: 'Ena', transcription: 'ena', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Ɛdi', transcription: 'ɛdi', traduction: 'Nourriture', categorie: 'nourriture' },
    { mot: 'Ewiem', transcription: 'ewiem', traduction: 'Ciel', categorie: 'nature' },
    { mot: 'Fufuo', transcription: 'fufuo', traduction: 'Blanc / Pur', categorie: 'couleurs' },
    { mot: 'Kokoo', transcription: 'kokoo', traduction: 'Rouge', categorie: 'couleurs' },
    { mot: 'Tuo', transcription: 'tuo', traduction: 'Guerre / Dispute', categorie: 'vie_sociale' },
    { mot: 'Adwuma', transcription: 'adwuma', traduction: 'Travail', categorie: 'vie_quotidienne' },
    { mot: 'Ahemfie', transcription: 'ahemfie', traduction: 'Palais royal', categorie: 'royaute' },
  ],
  gouro: [
    { mot: 'Wa ka', transcription: 'wa ka', traduction: 'Bonjour', categorie: 'salutations', exemplePhrase: 'Wa ka ! Wa wo !' },
    { mot: 'Wala', transcription: 'wala', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Wa wo', transcription: 'wa wo', traduction: 'Merci', categorie: 'salutations' },
    { mot: 'Ɔɔ', transcription: 'ɔɔ', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Ayi', transcription: 'ayi', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Yi', transcription: 'yi', traduction: 'Eau', categorie: 'nature' },
    { mot: 'Zɔ', transcription: 'zɔ', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Wɛ', transcription: 'wɛ', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Sɛn', transcription: 'sɛn', traduction: 'Argent', categorie: 'vie_quotidienne' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Forêt', categorie: 'nature' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Pɛ', transcription: 'pɛ', traduction: 'Femme', categorie: 'famille' },
    { mot: 'Gblɔ', transcription: 'gblɔ', traduction: 'Homme', categorie: 'famille' },
    { mot: 'Yɛglɛ', transcription: 'yɛglɛ', traduction: 'Père', categorie: 'famille' },
    { mot: 'Yi do', transcription: 'yi do', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Zo', transcription: 'zo', traduction: 'Feu', categorie: 'nature' },
    { mot: 'Flɛ', transcription: 'flɛ', traduction: 'Tisser / Tissu', categorie: 'artisanat' },
    { mot: 'Gbɛ', transcription: 'gbɛ', traduction: 'Masque (objet sacré)', categorie: 'spiritualite' },
    { mot: 'Dro', transcription: 'dro', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Pla', transcription: 'pla', traduction: 'Igname', categorie: 'nourriture' },
  ],
  guere: [
    { mot: 'Gbɔɔ', transcription: 'gbɔɔ', traduction: 'Bonjour', categorie: 'salutations', exemplePhrase: 'Gbɔɔ ! Ida !' },
    { mot: 'Ida', transcription: 'ida', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Gblo', transcription: 'gblo', traduction: 'Merci', categorie: 'salutations' },
    { mot: 'Ɔɔ', transcription: 'ɔɔ', traduction: 'Oui', categorie: 'expressions' },
    { mot: 'Ayo', transcription: 'ayo', traduction: 'Non', categorie: 'expressions' },
    { mot: 'Yî', transcription: 'yî', traduction: 'Eau', categorie: 'nature' },
    { mot: 'Kpô', transcription: 'kpô', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Nyu', transcription: 'nyu', traduction: 'Enfant', categorie: 'famille' },
    { mot: 'Zran', transcription: 'zran', traduction: 'Argent', categorie: 'vie_quotidienne' },
    { mot: 'Gla', transcription: 'gla', traduction: 'Forêt', categorie: 'nature' },
    { mot: 'Gbla', transcription: 'gbla', traduction: 'Guerrier / Homme fort', categorie: 'vie_sociale' },
    { mot: 'Pɔ', transcription: 'pɔ', traduction: 'Femme', categorie: 'famille' },
    { mot: 'Tɔ', transcription: 'tɔ', traduction: 'Père', categorie: 'famille' },
    { mot: 'Yɔ', transcription: 'yɔ', traduction: 'Mère', categorie: 'famille' },
    { mot: 'Wli', transcription: 'wli', traduction: 'Soleil', categorie: 'nature' },
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Terre / Sol', categorie: 'nature' },
    { mot: 'Kô', transcription: 'kô', traduction: 'Feu', categorie: 'nature' },
    { mot: 'Zɛ', transcription: 'zɛ', traduction: 'Masque de guerre', categorie: 'traditions' },
    { mot: 'Gle', transcription: 'gle', traduction: 'Riz', categorie: 'nourriture' },
    { mot: 'Bâ', transcription: 'bâ', traduction: 'Chasser / Chasse', categorie: 'activites' },
  ],
  nouchi: [
    { mot: 'Wê', transcription: 'wê', traduction: 'Toi / Hey toi (interpellation)', categorie: 'expressions', exemplePhrase: 'Wê, tu viens ?' },
    { mot: 'Yako', transcription: 'yako', traduction: 'Désolé / Condoléances', categorie: 'salutations', exemplePhrase: 'Yako frère !' },
    { mot: 'Dja', transcription: 'dja', traduction: 'Partir / Aller', categorie: 'verbes', exemplePhrase: 'On dja là !' },
    { mot: 'Gou', transcription: 'gou', traduction: 'Avoir peur / Craindre', categorie: 'expressions' },
    { mot: 'Blèff', transcription: 'blèff', traduction: 'Mentir / Exagérer / Esbroufer', categorie: 'expressions', exemplePhrase: 'Tu fais le blèff !' },
    { mot: 'Tchoquer', transcription: 'tchoquer', traduction: 'Donner de l\'argent / Payer', categorie: 'vie_quotidienne' },
    { mot: 'Gbaka', transcription: 'gbaka', traduction: 'Minibus de transport en commun', categorie: 'transport' },
    { mot: 'Maquis', transcription: 'maquis', traduction: 'Restaurant populaire en plein air', categorie: 'lieux' },
    { mot: 'Alloco', transcription: 'alloco', traduction: 'Banane plantain frite (plat populaire)', categorie: 'nourriture' },
    { mot: 'Attiéké', transcription: 'attiéké', traduction: 'Semoule de manioc (plat de base)', categorie: 'nourriture' },
    { mot: 'Foutou', transcription: 'foutou', traduction: 'Pâte d\'igname ou banane pilée', categorie: 'nourriture' },
    { mot: 'Tchamba', transcription: 'tchamba', traduction: 'Individu malin / Débrouillard', categorie: 'personnalite' },
    { mot: 'Gaou', transcription: 'gaou', traduction: 'Naïf / Ignorant / Pigeon', categorie: 'personnalite', exemplePhrase: 'Tu es un vrai gaou !' },
    { mot: 'Zouglou', transcription: 'zouglou', traduction: 'Genre musical & danse ivoirien populaire', categorie: 'musique' },
    { mot: 'Cocoyer', transcription: 'cocoyer', traduction: 'Être à la mode / S\'habiller chic', categorie: 'mode' },
    { mot: 'Wôrô wôrô', transcription: 'wôrô wôrô', traduction: 'Taxi partagé (voiture)', categorie: 'transport' },
    { mot: 'C\'est comment ?', transcription: "c'est comment", traduction: 'Comment ça va ? / C\'est quoi ?', categorie: 'salutations' },
    { mot: 'Impeccable', transcription: 'impeccable', traduction: 'Très bien / Parfait (intensifié)', categorie: 'expressions' },
    { mot: 'On va faire comment ?', transcription: "on va faire comment", traduction: 'Qu\'est-ce qu\'on fait ? / Comment on gère ?', categorie: 'expressions' },
    { mot: 'Dieu merci', transcription: 'dieu merci', traduction: 'Formule de satisfaction / Tout va bien', categorie: 'expressions' },
  ],
};

// ============================================================
// LEÇONS — 2 leçons par langue
// ============================================================
const LESSONS = {
  baoule: [
    {
      titre: 'Les Chiffres en Baoulé',
      description: 'Apprenez à compter de 1 à 10 en Baoulé.',
      ordre: 2, niveau: 'A1', pointsXp: 40,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les chiffres 1 à 5',
            mots: [
              { mot: 'Kun', traduction: '1 (Un)', transcription: 'kun' },
              { mot: 'Nyo', traduction: '2 (Deux)', transcription: 'nyo' },
              { mot: 'Sa', traduction: '3 (Trois)', transcription: 'sa' },
              { mot: 'Nnan', traduction: '4 (Quatre)', transcription: 'nnan' },
              { mot: 'Nnu', traduction: '5 (Cinq)', transcription: 'nnu' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Trois" en Baoulé ?', choix: ['Kun', 'Sa', 'Nyo', 'Nnan'] },
            solution: { reponse: 'Sa' },
            pointsXp: 10,
            explication: '"Sa" signifie 3 en Baoulé. "Kun" = 1, "Nyo" = 2, "Nnan" = 4.',
          },
        },
        {
          type: 'VOCABULARY', ordre: 2,
          contenu: {
            titre: 'Les chiffres 6 à 10',
            mots: [
              { mot: 'Nsia', traduction: '6 (Six)', transcription: 'nsia' },
              { mot: 'Nson', traduction: '7 (Sept)', transcription: 'nson' },
              { mot: 'Mɔnjuɛ', traduction: '8 (Huit)', transcription: 'mɔnjuɛ' },
              { mot: 'Ngwlan', traduction: '9 (Neuf)', transcription: 'ngwlan' },
              { mot: 'Blu', traduction: '10 (Dix)', transcription: 'blu' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Dix" en Baoulé ?', choix: ['Nson', 'Ngwlan', 'Blu', 'Nsia'] },
            solution: { reponse: 'Blu' },
            pointsXp: 10,
            explication: '"Blu" signifie 10 en Baoulé.',
          },
        },
      ],
    },
    {
      titre: 'La Famille en Baoulé',
      description: 'Apprenez le vocabulaire de la famille en Baoulé.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les membres de la famille',
            mots: [
              { mot: 'N\'da', traduction: 'Maman', transcription: 'nda' },
              { mot: 'N\'si', traduction: 'Papa', transcription: 'nsi' },
              { mot: 'Nyɛn', traduction: 'Enfant', transcription: 'nyɛn' },
              { mot: 'N\'wawa', traduction: 'Grand-mère', transcription: 'nwawa' },
              { mot: 'N\'sisi', traduction: 'Grand-père', transcription: 'nsisi' },
              { mot: 'Wawafuɛ', traduction: 'Frère / Sœur', transcription: 'wawafuɛ' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Maman" en Baoulé ?', choix: ['N\'si', 'N\'da', 'Nyɛn', 'N\'wawa'] },
            solution: { reponse: "N'da" },
            pointsXp: 15,
            explication: '"N\'da" signifie Maman en Baoulé. "N\'si" = Papa.',
          },
        },
      ],
    },
  ],
  dioula: [
    {
      titre: 'Les Salutations en Dioula',
      description: 'Apprenez à saluer en Dioula selon le moment de la journée.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations selon l\'heure',
            mots: [
              { mot: 'I ni sɔgɔma', traduction: 'Bonjour (matin)', transcription: 'i ni sogoma' },
              { mot: 'I ni tile', traduction: 'Bonjour (après-midi)', transcription: 'i ni tile' },
              { mot: 'I ni wula', traduction: 'Bonsoir', transcription: 'i ni wula' },
              { mot: 'I ka kɛnɛ wa ?', traduction: 'Tu vas bien ?', transcription: 'i ka kene wa' },
              { mot: 'Tɔrɔ si', traduction: 'Pas de problème / Je vais bien', transcription: 'tɔrɔ si' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Bonjour" le matin en Dioula ?', choix: ['I ni wula', 'I ni tile', 'I ni sɔgɔma', 'Aw ni ce'] },
            solution: { reponse: 'I ni sɔgɔma' },
            pointsXp: 10,
            explication: 'En Dioula, les salutations varient selon le moment : sɔgɔma = matin, tile = après-midi, wula = soir.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Un dialogue de salutation',
            dialogue: [
              { locuteur: 'Amara', texte: 'I ni sɔgɔma !', traduction: 'Bonjour !' },
              { locuteur: 'Vous', texte: 'I ni sɔgɔma ! I ka kɛnɛ wa ?', traduction: 'Bonjour ! Tu vas bien ?' },
              { locuteur: 'Amara', texte: 'Tɔrɔ si. I ni ce !', traduction: 'Pas de problème. Merci !' },
              { locuteur: 'Vous', texte: 'N tɔgɔ Kofi. I tɔgɔ ?', traduction: 'Mon nom est Kofi. Ton nom ?' },
              { locuteur: 'Amara', texte: 'N tɔgɔ Amara. Aw ni ce !', traduction: 'Mon nom est Amara. Merci !' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Que signifie "Tɔrɔ si" en Dioula ?', choix: ['Au revoir', 'Pas de problème', 'Bonjour', 'Merci'] },
            solution: { reponse: 'Pas de problème' },
            pointsXp: 10,
            explication: '"Tɔrɔ si" est la réponse positive à "Tu vas bien ?". Littéralement : "Il n\'y a pas de problème."',
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres en Dioula',
      description: 'Apprenez à compter de 1 à 10 en Dioula.',
      ordre: 2, niveau: 'A1', pointsXp: 40,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Compter en Dioula',
            mots: [
              { mot: 'Kelen', traduction: '1 (Un)', transcription: 'kelen' },
              { mot: 'Fila', traduction: '2 (Deux)', transcription: 'fila' },
              { mot: 'Saba', traduction: '3 (Trois)', transcription: 'saba' },
              { mot: 'Naani', traduction: '4 (Quatre)', transcription: 'naani' },
              { mot: 'Duuru', traduction: '5 (Cinq)', transcription: 'duuru' },
              { mot: 'Wɔɔrɔ', traduction: '6 (Six)', transcription: 'wɔɔrɔ' },
              { mot: 'Wolonwula', traduction: '7 (Sept)', transcription: 'wolonwula' },
              { mot: 'Segin', traduction: '8 (Huit)', transcription: 'segin' },
              { mot: 'Kɔnɔntɔn', traduction: '9 (Neuf)', transcription: 'kɔnɔntɔn' },
              { mot: 'Tan', traduction: '10 (Dix)', transcription: 'tan' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Cinq" en Dioula ?', choix: ['Naani', 'Saba', 'Duuru', 'Fila'] },
            solution: { reponse: 'Duuru' },
            pointsXp: 15,
            explication: '"Duuru" = 5 en Dioula. Notez que "Tan" (10) est aussi la base pour former les dizaines.',
          },
        },
      ],
    },
  ],
  nouchi: [
    {
      titre: 'Les Expressions de Base du Nouchi',
      description: 'Découvrez les expressions incontournables du Nouchi, l\'argot d\'Abidjan.',
      ordre: 1, niveau: 'A1', pointsXp: 60,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les expressions du quotidien',
            mots: [
              { mot: 'C\'est comment ?', traduction: 'Comment ça va ?', transcription: "c'est comment" },
              { mot: 'Impeccable !', traduction: 'Très bien ! Parfait !', transcription: 'impeccable' },
              { mot: 'On va faire comment ?', traduction: 'Comment on gère ça ?', transcription: "on va faire comment" },
              { mot: 'Dja !', traduction: 'Allons-y ! / On part !', transcription: 'dja' },
              { mot: 'Yako !', traduction: 'Désolé ! / Courage !', transcription: 'yako' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Que signifie "Yako" en Nouchi ?', choix: ['Bonjour', 'Merci', 'Désolé / Courage', 'Au revoir'] },
            solution: { reponse: 'Désolé / Courage' },
            pointsXp: 10,
            explication: '"Yako" vient du Dioula et s\'utilise pour exprimer la compassion, les condoléances ou l\'encouragement.',
          },
        },
        {
          type: 'VOCABULARY', ordre: 2,
          contenu: {
            titre: 'Les personnages du Nouchi',
            mots: [
              { mot: 'Tchamba', traduction: 'Personne débrouillarde', transcription: 'tchamba' },
              { mot: 'Gaou', traduction: 'Personne naïve / Pigeon', transcription: 'gaou' },
              { mot: 'Blèff', traduction: 'Mentir / Exagérer', transcription: 'blèff' },
              { mot: 'Gou', traduction: 'Avoir peur', transcription: 'gou' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'En Nouchi, si quelqu\'un dit que tu "fais le blèff", ça veut dire quoi ?', choix: ['Tu es courageux', 'Tu exagères / Tu mens', 'Tu es intelligent', 'Tu es en retard'] },
            solution: { reponse: 'Tu exagères / Tu mens' },
            pointsXp: 10,
            explication: '"Blèff" vient de l\'anglais "bluff". En Nouchi, ça signifie mentir, exagérer ou faire le fier.',
          },
        },
      ],
    },
    {
      titre: 'La Cuisine et les Lieux en Nouchi',
      description: 'Apprenez le vocabulaire de la gastronomie et des lieux populaires d\'Abidjan.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les plats populaires',
            mots: [
              { mot: 'Attiéké', traduction: 'Semoule de manioc (plat national)', transcription: 'attiéké' },
              { mot: 'Alloco', traduction: 'Banane plantain frite', transcription: 'alloco' },
              { mot: 'Foutou', traduction: 'Pâte d\'igname ou banane pilée', transcription: 'foutou' },
              { mot: 'Maquis', traduction: 'Restaurant populaire en plein air', transcription: 'maquis' },
              { mot: 'Garba', traduction: 'Attiéké + thon frit (plat de rue)', transcription: 'garba' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Qu\'est-ce qu\'un "maquis" à Abidjan ?', choix: ['Un marché', 'Un restaurant populaire en plein air', 'Un minibus', 'Une discothèque'] },
            solution: { reponse: 'Un restaurant populaire en plein air' },
            pointsXp: 10,
            explication: 'Le maquis est une institution en Côte d\'Ivoire ! C\'est un restaurant informel en plein air où on mange des plats locaux.',
          },
        },
      ],
    },
  ],
  bete: [
    {
      titre: 'Les Salutations en Bété',
      description: 'Apprenez les salutations et expressions de base en Bété.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Dire bonjour en Bété',
            mots: [
              { mot: 'Gbahon', traduction: 'Bonjour', transcription: 'gbahon' },
              { mot: 'I ya ô', traduction: 'Bienvenue', transcription: 'i ya o' },
              { mot: 'Kpa-a', traduction: 'Merci', transcription: 'kpa-a' },
              { mot: 'Ao', traduction: 'Oui', transcription: 'ao' },
              { mot: 'Wê', traduction: 'Non', transcription: 'wê' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Merci" en Bété ?', choix: ['Gbahon', 'I ya ô', 'Kpa-a', 'Ao'] },
            solution: { reponse: 'Kpa-a' },
            pointsXp: 15,
            explication: '"Kpa-a" est l\'expression de remerciement en Bété.',
          },
        },
      ],
    },
  ],
  senoufo: [
    {
      titre: 'Les Salutations en Senoufo',
      description: 'Apprenez à saluer et à vous présenter en Senoufo (dialecte Tyébara de Korhogo).',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les salutations Senoufo',
            mots: [
              { mot: 'Kawelé', traduction: 'Bonjour / Comment ça va ?', transcription: 'kawelé' },
              { mot: 'Nanga', traduction: 'Merci', transcription: 'nanga' },
              { mot: 'A nawan', traduction: 'Bienvenue', transcription: 'a nawan' },
              { mot: 'Yɛɛ', traduction: 'Oui', transcription: 'yɛɛ' },
              { mot: 'Nayi', traduction: 'Non', transcription: 'nayi' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Bienvenue" en Senoufo ?', choix: ['Nanga', 'Kawelé', 'A nawan', 'Yɛɛ'] },
            solution: { reponse: 'A nawan' },
            pointsXp: 15,
            explication: '"A nawan" signifie Bienvenue en Senoufo. "Kawelé" est la salutation générale.',
          },
        },
      ],
    },
  ],
  agni: [
    {
      titre: 'Les Salutations en Agni',
      description: 'Découvrez les salutations de la langue Agni, proche du Baoulé.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Saluer en Agni',
            mots: [
              { mot: 'Mô ô', traduction: 'Bonjour (singulier)', transcription: 'mɔ ɔ' },
              { mot: 'Akwaba', traduction: 'Bienvenue', transcription: 'akwaba' },
              { mot: 'Yɛbɛkɔ', traduction: 'Au revoir', transcription: 'yɛbɛkɔ' },
              { mot: 'Aane', traduction: 'Oui', transcription: 'aane' },
              { mot: 'Dabi', traduction: 'Non', transcription: 'dabi' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Au revoir" en Agni ?', choix: ['Akwaba', 'Mô ô', 'Dabi', 'Yɛbɛkɔ'] },
            solution: { reponse: 'Yɛbɛkɔ' },
            pointsXp: 15,
            explication: '"Yɛbɛkɔ" signifie "Au revoir" en Agni. "Akwaba" = Bienvenue, comme en Baoulé.',
          },
        },
      ],
    },
  ],
  gouro: [
    {
      titre: 'Les Salutations en Gouro',
      description: 'Apprenez les bases de la langue Gouro du Centre-Ouest ivoirien.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les salutations Gouro',
            mots: [
              { mot: 'Wa ka', traduction: 'Bonjour', transcription: 'wa ka' },
              { mot: 'Wala', traduction: 'Bienvenue', transcription: 'wala' },
              { mot: 'Wa wo', traduction: 'Merci', transcription: 'wa wo' },
              { mot: 'Ɔɔ', traduction: 'Oui', transcription: 'ɔɔ' },
              { mot: 'Ayi', traduction: 'Non', transcription: 'ayi' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Merci" en Gouro ?', choix: ['Wa ka', 'Wala', 'Wa wo', 'Ayi'] },
            solution: { reponse: 'Wa wo' },
            pointsXp: 15,
            explication: '"Wa wo" exprime la gratitude en Gouro.',
          },
        },
      ],
    },
  ],
  guere: [
    {
      titre: 'Les Salutations en Guéré',
      description: 'Découvrez les salutations de la langue Guéré de l\'Ouest ivoirien.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Saluer en Guéré',
            mots: [
              { mot: 'Gbɔɔ', traduction: 'Bonjour', transcription: 'gbɔɔ' },
              { mot: 'Ida', traduction: 'Bienvenue', transcription: 'ida' },
              { mot: 'Gblo', traduction: 'Merci', transcription: 'gblo' },
              { mot: 'Ɔɔ', traduction: 'Oui', transcription: 'ɔɔ' },
              { mot: 'Ayo', traduction: 'Non', transcription: 'ayo' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Bonjour" en Guéré ?', choix: ['Ida', 'Gblo', 'Gbɔɔ', 'Ayo'] },
            solution: { reponse: 'Gbɔɔ' },
            pointsXp: 15,
            explication: '"Gbɔɔ" est la salutation principale en Guéré.',
          },
        },
      ],
    },
  ],
};

// ============================================================
// CONTENU CULTUREL ENRICHI
// ============================================================
const CULTURAL = [
  // Baoulé
  { type: 'PROVERB', code: 'baoule', contenu: "Sran bi w'a di mma, ɔ di ne ho.", traduction: "L'homme qui ne mange pas avec les enfants mange seul.", sourceEthnique: 'Baoulé' },
  { type: 'PROVERB', code: 'baoule', contenu: "Bian w'a klo sran, ɔ klo ne ho.", traduction: "Celui qui ne soigne pas les autres ne se soigne pas lui-même.", sourceEthnique: 'Baoulé' },
  { type: 'TRADITION', code: 'baoule', contenu: 'Le Kita baoulé', traduction: 'Tissu traditionnel tissé, transmis de génération en génération. Chaque motif géométrique raconte une histoire.', sourceEthnique: 'Baoulé' },
  // Dioula
  { type: 'PROVERB', code: 'dioula', contenu: 'Denmɔgɔ bɛ kalan, a bɛ se ka baara kɛ.', traduction: "L'enfant qui apprend sera capable de travailler.", sourceEthnique: 'Dioula' },
  { type: 'PROVERB', code: 'dioula', contenu: 'Mɔgɔ dɔ tɛ bɔ ka taga ni mɔgɔ tɔw tɛ da a la.', traduction: 'Personne ne peut partir sans que les autres ne comptent sur elle.', sourceEthnique: 'Dioula' },
  { type: 'TRADITION', code: 'dioula', contenu: 'Le commerce Dioula', traduction: "Les Dioulas ont développé un réseau commercial couvrant toute l'Afrique de l'Ouest. Leur langue est devenue une lingua franca commerciale.", sourceEthnique: 'Dioula' },
  // Bété
  { type: 'PROVERB', code: 'bete', contenu: 'Klô gbo wê, kpôa gbo wê.', traduction: "L'eau de la forêt est froide, l'eau du marigot est froide aussi.", sourceEthnique: 'Bété' },
  { type: 'TRADITION', code: 'bete', contenu: 'Le Gbagba', traduction: "Danse guerrière traditionnelle Bété, pratiquée lors de cérémonies importantes. Elle symbolise la bravoure et l'honneur des guerriers.", sourceEthnique: 'Bété' },
  // Senoufo
  { type: 'PROVERB', code: 'senoufo', contenu: 'Kafɔ tɛ kɛ ni mɔgɔ kelen ye.', traduction: "L'association ne se fait pas avec une seule personne.", sourceEthnique: 'Senoufo' },
  { type: 'TRADITION', code: 'senoufo', contenu: 'Le Poro', traduction: "Institution initiatique sacrée chez les Senoufo. École de la vie qui enseigne les valeurs et les responsabilités aux jeunes hommes.", sourceEthnique: 'Senoufo' },
  // Agni
  { type: 'PROVERB', code: 'agni', contenu: 'Onipa na hu ne ho a ma ahunu ne ho.', traduction: 'Connais-toi toi-même avant de connaître les autres.', sourceEthnique: 'Agni' },
  { type: 'TRADITION', code: 'agni', contenu: 'La Royauté Agni', traduction: "Le peuple Agni est organisé en royaumes actifs avec des cérémonies d'intronisation élaborées et des chefs traditionnels.", sourceEthnique: 'Agni' },
  // Gouro
  { type: 'PROVERB', code: 'gouro', contenu: 'Gba klɛ tɛ tɔ, gba gbɛ tɔ.', traduction: 'La forêt ne voit pas le soleil, la forêt voit le masque.', sourceEthnique: 'Gouro' },
  { type: 'TRADITION', code: 'gouro', contenu: 'Les Masques Gouro', traduction: "Les masques Gouro (Zamblé, Gu) sont parmi les plus beaux d'Afrique de l'Ouest. Utilisés lors de cérémonies funéraires et fêtes de récolte.", sourceEthnique: 'Gouro' },
  // Guéré
  { type: 'PROVERB', code: 'guere', contenu: 'Gbla wê a kpô dɔ, a da yɔ.', traduction: 'Le guerrier qui protège sa maison protège sa mère.', sourceEthnique: 'Guéré' },
  { type: 'TRADITION', code: 'guere', contenu: 'Le Masque Gbè Guéré', traduction: "Masque de guerre sacré porté par les guerriers Guéré. Aujourd'hui utilisé lors des cérémonies rituelles et fêtes traditionnelles.", sourceEthnique: 'Guéré' },
  // Nouchi
  { type: 'TRADITION', code: 'nouchi', contenu: 'Le Zouglou', traduction: "Genre musical né dans les universités d'Abidjan dans les années 90. Mélange de rythmes traditionnels et de paroles en Nouchi dénonçant les problèmes sociaux.", sourceEthnique: 'Abidjan' },
  { type: 'PROVERB', code: 'nouchi', contenu: "Abidjan c'est Abidjan.", traduction: 'Abidjan est unique en son genre. Expression de fierté des habitants pour leur ville cosmopolite.', sourceEthnique: 'Nouchi / Abidjanais' },
];

// ============================================================
// SCRIPT PRINCIPAL
// ============================================================
async function main() {
  console.log('🚀 Démarrage du seed de contenu enrichi...\n');

  // Récupérer les IDs des langues
  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) langMap[l.code] = l.id;

  // ── DICTIONNAIRE ──
  console.log('📖 Ajout du vocabulaire...');
  let totalWords = 0;
  for (const [code, words] of Object.entries(DICTIONARY)) {
    const langId = langMap[code];
    if (!langId) { console.log(`  ⚠️  Langue "${code}" non trouvée`); continue; }
    let added = 0;
    for (const word of words) {
      const exists = await prisma.dictionaryEntry.findFirst({
        where: { languageId: langId, mot: word.mot },
      });
      if (!exists) {
        await prisma.dictionaryEntry.create({
          data: { ...word, languageId: langId, status: 'PUBLISHED' },
        });
        added++;
      }
    }
    console.log(`  ✅ ${code.toUpperCase()}: ${added} nouveaux mots ajoutés`);
    totalWords += added;
  }
  console.log(`  📊 Total : ${totalWords} mots ajoutés\n`);

  // ── LEÇONS ──
  console.log('📚 Ajout des leçons...');
  let totalLessons = 0;
  for (const [code, lessons] of Object.entries(LESSONS)) {
    const langId = langMap[code];
    if (!langId) continue;
    for (const lessonData of lessons) {
      const exists = await prisma.lesson.findFirst({
        where: { languageId: langId, titre: lessonData.titre },
      });
      if (exists) { console.log(`  ⏭️  "${lessonData.titre}" existe déjà`); continue; }

      const lesson = await prisma.lesson.create({
        data: {
          languageId: langId,
          titre: lessonData.titre,
          description: lessonData.description,
          ordre: lessonData.ordre,
          pointsXp: lessonData.pointsXp,
          niveau: lessonData.niveau,
          isActive: true,
        },
      });

      for (const stepData of lessonData.steps) {
        const step = await prisma.lessonStep.create({
          data: {
            lessonId: lesson.id,
            type: stepData.type,
            ordre: stepData.ordre,
            contenu: stepData.contenu,
          },
        });
        if (stepData.exercise) {
          await prisma.exercise.create({
            data: {
              stepId: step.id,
              type: stepData.exercise.type,
              donnees: stepData.exercise.donnees,
              solution: stepData.exercise.solution,
              pointsXp: stepData.exercise.pointsXp,
              explication: stepData.exercise.explication,
            },
          });
        }
      }
      console.log(`  ✅ Leçon "${lessonData.titre}" créée`);
      totalLessons++;
    }
  }
  console.log(`  📊 Total : ${totalLessons} leçons créées\n`);

  // ── CONTENU CULTUREL ──
  console.log('🏛️  Ajout du contenu culturel...');
  let totalCultural = 0;
  for (const item of CULTURAL) {
    const langId = langMap[item.code];
    if (!langId) continue;
    const exists = await prisma.culturalItem.findFirst({
      where: { languageId: langId, contenu: item.contenu },
    });
    if (!exists) {
      const { code, ...rest } = item;
      await prisma.culturalItem.create({
        data: { ...rest, languageId: langId, isActive: true },
      });
      totalCultural++;
    }
  }
  console.log(`  ✅ ${totalCultural} éléments culturels ajoutés\n`);

  console.log('🎉 ═══════════════════════════════════════');
  console.log('   Seed de contenu terminé avec succès !');
  console.log('═══════════════════════════════════════════');
  console.log(`   📖 Vocabulaire : ${totalWords} mots`);
  console.log(`   📚 Leçons      : ${totalLessons} leçons`);
  console.log(`   🏛️  Culture     : ${totalCultural} éléments`);
  console.log('═══════════════════════════════════════════\n');
}

main()
  .catch(e => { console.error('❌ Erreur:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
