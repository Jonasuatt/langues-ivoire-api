const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// LEÇONS STRUCTURÉES V2 — 4 nouvelles leçons par langue
// Niveaux A1 (compléments), A2, B1
// Types : VOCABULARY, DIALOGUE, GRAMMAR + exercices VOCABULARY, TRANSLATION, LISTENING
// ============================================================

const LESSONS_V2 = {
  baoule: [
    {
      titre: 'Le Corps Humain en Baoulé',
      description: 'Apprenez les parties du corps en Baoulé.',
      ordre: 4, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les parties du corps',
            mots: [
              { mot: 'Ti', traduction: 'Tête', transcription: 'ti' },
              { mot: 'Nyin', traduction: 'Œil', transcription: 'nyin' },
              { mot: 'Suɛ', traduction: 'Oreille', transcription: 'suɛ' },
              { mot: 'Nuɛn', traduction: 'Nez', transcription: 'nuɛn' },
              { mot: 'Bua', traduction: 'Bouche', transcription: 'bua' },
              { mot: 'Sa', traduction: 'Main', transcription: 'sa' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Tête" en Baoulé ?', choix: ['Nyin', 'Ti', 'Bua', 'Sa'] },
            solution: { reponse: 'Ti' },
            pointsXp: 10,
            explication: '"Ti" signifie Tête en Baoulé.',
          },
        },
        {
          type: 'VOCABULARY', ordre: 2,
          contenu: {
            titre: 'Le corps (suite)',
            mots: [
              { mot: 'Ja', traduction: 'Pied', transcription: 'ja' },
              { mot: 'Awlɛn', traduction: 'Cœur', transcription: 'awlɛn' },
              { mot: 'Kɔn', traduction: 'Cou', transcription: 'kɔn' },
              { mot: 'Konmin', traduction: 'Dos', transcription: 'konmin' },
              { mot: 'Kplo', traduction: 'Ventre', transcription: 'kplo' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Traduisez en français : "Awlɛn"', choix: ['Pied', 'Dos', 'Cœur', 'Ventre'] },
            solution: { reponse: 'Cœur' },
            pointsXp: 10,
            explication: '"Awlɛn" signifie Cœur en Baoulé.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Baoulé',
      description: 'Apprenez à vous présenter et poser des questions simples.',
      ordre: 5, niveau: 'A2', pointsXp: 60,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Expressions pour se présenter',
            mots: [
              { mot: 'Min dunman yɛ...', traduction: 'Mon nom est...', transcription: 'min dunman yɛ' },
              { mot: 'A dunman yɛ ?', traduction: 'Quel est ton nom ?', transcription: 'a dunman yɛ' },
              { mot: 'N fin...', traduction: 'Je viens de...', transcription: 'n fin' },
              { mot: 'A fin nin ?', traduction: 'Tu viens d\'où ?', transcription: 'a fin nin' },
              { mot: 'N ti...', traduction: 'Je suis... (métier)', transcription: 'n ti' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dire "Mon nom est..." en Baoulé ?', choix: ['A dunman yɛ ?', 'Min dunman yɛ...', 'N fin...', 'N ti...'] },
            solution: { reponse: 'Min dunman yɛ...' },
            pointsXp: 10,
            explication: '"Min dunman yɛ..." permet de se présenter en Baoulé.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Dialogue : Se présenter',
            dialogue: [
              { locuteur: 'Aya', texte: 'Mô ô ! A dunman yɛ ?', traduction: 'Bonjour ! Quel est ton nom ?' },
              { locuteur: 'Vous', texte: 'Min dunman yɛ Kofi. A dunman yɛ ?', traduction: 'Mon nom est Kofi. Quel est ton nom ?' },
              { locuteur: 'Aya', texte: 'Min dunman yɛ Aya. N fin Yamoussoukro.', traduction: 'Mon nom est Aya. Je viens de Yamoussoukro.' },
              { locuteur: 'Vous', texte: 'N fin Abidjan. A yako !', traduction: 'Je viens d\'Abidjan. Au revoir !' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "A fin nin ?" en Baoulé ?', choix: ['Quel âge as-tu ?', 'Tu viens d\'où ?', 'Comment vas-tu ?', 'Quel est ton métier ?'] },
            solution: { reponse: 'Tu viens d\'où ?' },
            pointsXp: 15,
            explication: '"A fin nin ?" signifie "Tu viens d\'où ?" en Baoulé.',
          },
        },
      ],
    },
    {
      titre: 'Le Marché en Baoulé',
      description: 'Vocabulaire et expressions pour acheter au marché.',
      ordre: 6, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Au marché',
            mots: [
              { mot: 'Gua', traduction: 'Marché', transcription: 'gua' },
              { mot: 'Finfin', traduction: 'Argent', transcription: 'finfin' },
              { mot: 'Tɔ', traduction: 'Acheter', transcription: 'tɔ' },
              { mot: 'Yɔ', traduction: 'Vendre', transcription: 'yɔ' },
              { mot: 'Nɛn yɛ ?', traduction: 'Combien ça coûte ?', transcription: 'nɛn yɛ' },
              { mot: 'Atie', traduction: 'C\'est cher', transcription: 'atie' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment demander le prix en Baoulé ?', choix: ['Atie', 'Nɛn yɛ ?', 'Tɔ', 'Gua'] },
            solution: { reponse: 'Nɛn yɛ ?' },
            pointsXp: 10,
            explication: '"Nɛn yɛ ?" signifie "Combien ça coûte ?" en Baoulé.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Dialogue : Acheter au marché',
            dialogue: [
              { locuteur: 'Vous', texte: 'Mô ô ! Yam ni nɛn yɛ ?', traduction: 'Bonjour ! L\'igname coûte combien ?' },
              { locuteur: 'Vendeuse', texte: 'Finfin nnu.', traduction: 'Cinq cents francs.' },
              { locuteur: 'Vous', texte: 'Atie ! Finfin sa ?', traduction: 'C\'est cher ! Trois cents ?' },
              { locuteur: 'Vendeuse', texte: 'Ewɔ, finfin nnan.', traduction: 'D\'accord, quatre cents.' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Atie" en Baoulé ?', choix: ['C\'est bon', 'C\'est cher', 'C\'est beau', 'C\'est loin'] },
            solution: { reponse: 'C\'est cher' },
            pointsXp: 10,
            explication: '"Atie" signifie "C\'est cher" en Baoulé.',
          },
        },
      ],
    },
    {
      titre: 'Parler du Temps en Baoulé',
      description: 'Le temps qu\'il fait et les saisons en Baoulé.',
      ordre: 7, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La météo et les saisons',
            mots: [
              { mot: 'Wia', traduction: 'Soleil', transcription: 'wia' },
              { mot: 'Nzuɛ', traduction: 'Pluie / Eau', transcription: 'nzuɛ' },
              { mot: 'Aunmian', traduction: 'Vent', transcription: 'aunmian' },
              { mot: 'Ble su wia', traduction: 'Saison sèche', transcription: 'blé su wia' },
              { mot: 'Ble su nzuɛ', traduction: 'Saison des pluies', transcription: 'blé su nzuɛ' },
              { mot: 'Lɔ ti kpa', traduction: 'Il fait beau', transcription: 'lɔ ti kpa' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Saison des pluies" en Baoulé ?', choix: ['Ble su wia', 'Ble su nzuɛ', 'Aunmian', 'Lɔ ti kpa'] },
            solution: { reponse: 'Ble su nzuɛ' },
            pointsXp: 15,
            explication: '"Ble su nzuɛ" = saison des pluies, "Ble su wia" = saison sèche.',
          },
        },
        {
          type: 'GRAMMAR', ordre: 2,
          contenu: {
            titre: 'La négation en Baoulé',
            explication: 'En Baoulé, la négation se forme avec "man" placé après le verbe. Exemple : "N kwla" (je peux) → "N kwla man" (je ne peux pas).',
            exemples: [
              { phrase: 'N si', traduction: 'Je sais', transcription: 'n si' },
              { phrase: 'N si man', traduction: 'Je ne sais pas', transcription: 'n si man' },
              { phrase: 'N klo', traduction: 'J\'aime', transcription: 'n klo' },
              { phrase: 'N klo man', traduction: 'Je n\'aime pas', transcription: 'n klo man' },
            ],
          },
          exercise: {
            type: 'GRAMMAR',
            donnees: { question: 'Comment dire "Je ne sais pas" en Baoulé ?', choix: ['N si', 'N si man', 'N klo man', 'N kwla man'] },
            solution: { reponse: 'N si man' },
            pointsXp: 15,
            explication: 'La négation en Baoulé se fait avec "man" après le verbe : "N si" → "N si man".',
          },
        },
      ],
    },
  ],

  dioula: [
    {
      titre: 'La Nourriture en Dioula',
      description: 'Le vocabulaire de la nourriture et des repas.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les aliments',
            mots: [
              { mot: 'Dɛgɛ', traduction: 'Riz', transcription: 'dɛgɛ' },
              { mot: 'Nɔgɔ', traduction: 'Sauce', transcription: 'nɔgɔ' },
              { mot: 'Sogo', traduction: 'Viande', transcription: 'sogo' },
              { mot: 'Jɛgɛ', traduction: 'Poisson', transcription: 'jɛgɛ' },
              { mot: 'Banan', traduction: 'Banane', transcription: 'banan' },
              { mot: 'Mango', traduction: 'Mangue', transcription: 'mango' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Riz" en Dioula ?', choix: ['Sogo', 'Dɛgɛ', 'Nɔgɔ', 'Jɛgɛ'] },
            solution: { reponse: 'Dɛgɛ' },
            pointsXp: 10,
            explication: '"Dɛgɛ" signifie Riz en Dioula.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Commander un repas',
            dialogue: [
              { locuteur: 'Vous', texte: 'I ni tile ! Dɛgɛ bɛ ?', traduction: 'Bonjour ! Il y a du riz ?' },
              { locuteur: 'Serveur', texte: 'Ɔwɔ, dɛgɛ ni nɔgɔ bɛ.', traduction: 'Oui, il y a du riz avec sauce.' },
              { locuteur: 'Vous', texte: 'Sogo dɔ fana k\'a fɔ.', traduction: 'Avec de la viande aussi s\'il vous plaît.' },
              { locuteur: 'Serveur', texte: 'A bɛ kɛ ! Wari kɛmɛ fila.', traduction: 'C\'est fait ! Deux cents francs.' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Dɛgɛ ni nɔgɔ bɛ" ?', choix: ['Le riz est fini', 'Il y a du riz avec sauce', 'Le riz est cher', 'Je veux du riz'] },
            solution: { reponse: 'Il y a du riz avec sauce' },
            pointsXp: 10,
            explication: '"bɛ" signifie "il y a", "ni" signifie "avec" en Dioula.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Dioula',
      description: 'Les phrases pour se présenter et parler de soi.',
      ordre: 4, niveau: 'A2', pointsXp: 60,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se présenter',
            mots: [
              { mot: 'N tɔgɔ...', traduction: 'Mon nom est...', transcription: 'n tɔgɔ' },
              { mot: 'I tɔgɔ ?', traduction: 'Quel est ton nom ?', transcription: 'i tɔgɔ' },
              { mot: 'N bɔra...', traduction: 'Je viens de...', transcription: 'n bɔra' },
              { mot: 'I bɔra min ?', traduction: 'Tu viens d\'où ?', transcription: 'i bɔra min' },
              { mot: 'N ye... ye', traduction: 'Je suis... (métier)', transcription: 'n yé... yé' },
              { mot: 'San joli', traduction: 'Quel âge ?', transcription: 'san joli' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment demander "Tu viens d\'où ?" en Dioula ?', choix: ['N bɔra...', 'I bɔra min ?', 'I tɔgɔ ?', 'San joli'] },
            solution: { reponse: 'I bɔra min ?' },
            pointsXp: 10,
            explication: '"I bɔra min ?" signifie "Tu viens d\'où ?" en Dioula.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Faire connaissance',
            dialogue: [
              { locuteur: 'Moussa', texte: 'I ni sɔgɔma ! I tɔgɔ ?', traduction: 'Bonjour ! Quel est ton nom ?' },
              { locuteur: 'Vous', texte: 'N tɔgɔ Awa. I tɔgɔ ?', traduction: 'Mon nom est Awa. Ton nom ?' },
              { locuteur: 'Moussa', texte: 'N tɔgɔ Moussa. N bɔra Korhogo.', traduction: 'Mon nom est Moussa. Je viens de Korhogo.' },
              { locuteur: 'Vous', texte: 'N bɔra Bouaké. N ye karamɔgɔ ye.', traduction: 'Je viens de Bouaké. Je suis enseignant(e).' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "N ye karamɔgɔ ye" ?', choix: ['Je suis étudiant', 'Je suis enseignant', 'Je suis commerçant', 'Je suis médecin'] },
            solution: { reponse: 'Je suis enseignant' },
            pointsXp: 15,
            explication: '"Karamɔgɔ" signifie enseignant/maître en Dioula.',
          },
        },
      ],
    },
    {
      titre: 'Les Directions en Dioula',
      description: 'Demander et donner des directions en Dioula.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les directions',
            mots: [
              { mot: 'Kinin', traduction: 'Droite', transcription: 'kinin' },
              { mot: 'Numan', traduction: 'Gauche', transcription: 'numan' },
              { mot: 'Kɔfɛ', traduction: 'Derrière', transcription: 'kɔfɛ' },
              { mot: 'Nyɛfɛ', traduction: 'Devant', transcription: 'nyɛfɛ' },
              { mot: 'Sira', traduction: 'Chemin / Route', transcription: 'sira' },
              { mot: '...bɛ min ?', traduction: 'Où est... ?', transcription: 'bɛ min' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dire "Gauche" en Dioula ?', choix: ['Kinin', 'Nyɛfɛ', 'Numan', 'Kɔfɛ'] },
            solution: { reponse: 'Numan' },
            pointsXp: 10,
            explication: '"Numan" = gauche, "Kinin" = droite en Dioula.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Demander son chemin',
            dialogue: [
              { locuteur: 'Vous', texte: 'Dugu bɛ min ?', traduction: 'Où est le village ?' },
              { locuteur: 'Passant', texte: 'Sira nin ta, kinin fan fɛ.', traduction: 'Prends ce chemin, du côté droit.' },
              { locuteur: 'Vous', texte: 'A ka jan wa ?', traduction: 'C\'est loin ?' },
              { locuteur: 'Passant', texte: 'Ayi, a man jan.', traduction: 'Non, ce n\'est pas loin.' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "A ka jan wa ?" ?', choix: ['C\'est beau ?', 'C\'est cher ?', 'C\'est loin ?', 'C\'est à droite ?'] },
            solution: { reponse: 'C\'est loin ?' },
            pointsXp: 10,
            explication: '"Jan" signifie "loin" en Dioula.',
          },
        },
      ],
    },
    {
      titre: 'La Grammaire du Dioula',
      description: 'Les bases grammaticales : conjugaison et négation.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'GRAMMAR', ordre: 1,
          contenu: {
            titre: 'Le verbe et la négation',
            explication: 'En Dioula, la conjugaison utilise des marqueurs de temps. Le présent : "bɛ" (affirmatif) / "tɛ" (négatif). Exemple : "N bɛ taa" (je vais) → "N tɛ taa" (je ne vais pas).',
            exemples: [
              { phrase: 'N bɛ dɛgɛ dun', traduction: 'Je mange du riz', transcription: 'n bɛ dɛgɛ dun' },
              { phrase: 'N tɛ dɛgɛ dun', traduction: 'Je ne mange pas de riz', transcription: 'n tɛ dɛgɛ dun' },
              { phrase: 'A bɛ taa', traduction: 'Il/elle va', transcription: 'a bɛ taa' },
              { phrase: 'A tɛ taa', traduction: 'Il/elle ne va pas', transcription: 'a tɛ taa' },
            ],
          },
          exercise: {
            type: 'GRAMMAR',
            donnees: { question: 'Comment dire "Je ne mange pas" en Dioula ?', choix: ['N bɛ dun', 'N tɛ dun', 'N bɛ dɛgɛ', 'N ka dun'] },
            solution: { reponse: 'N tɛ dun' },
            pointsXp: 15,
            explication: 'La négation au présent en Dioula remplace "bɛ" par "tɛ".',
          },
        },
        {
          type: 'GRAMMAR', ordre: 2,
          contenu: {
            titre: 'Le passé en Dioula',
            explication: 'Le passé se forme avec "ye" (affirmatif) et "ma" (négatif). Exemple : "N ye a kɛ" (je l\'ai fait) → "N ma a kɛ" (je ne l\'ai pas fait).',
            exemples: [
              { phrase: 'N ye nasi dun', traduction: 'J\'ai mangé du riz', transcription: 'n yé nasi dun' },
              { phrase: 'N ma nasi dun', traduction: 'Je n\'ai pas mangé de riz', transcription: 'n ma nasi dun' },
              { phrase: 'A ye taa', traduction: 'Il/elle est parti(e)', transcription: 'a yé taa' },
              { phrase: 'A ma taa', traduction: 'Il/elle n\'est pas parti(e)', transcription: 'a ma taa' },
            ],
          },
          exercise: {
            type: 'GRAMMAR',
            donnees: { question: 'Comment dire "Il est parti" en Dioula ?', choix: ['A bɛ taa', 'A ye taa', 'A tɛ taa', 'A ma taa'] },
            solution: { reponse: 'A ye taa' },
            pointsXp: 15,
            explication: '"ye" marque le passé affirmatif en Dioula.',
          },
        },
      ],
    },
  ],

  bete: [
    {
      titre: 'La Nourriture en Bété',
      description: 'Le vocabulaire des aliments et repas en Bété.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les aliments',
            mots: [
              { mot: 'Yên', traduction: 'Igname', transcription: 'yên' },
              { mot: 'Glô', traduction: 'Poisson', transcription: 'glô' },
              { mot: 'Blo', traduction: 'Riz', transcription: 'blo' },
              { mot: 'Kpakpa', traduction: 'Banane plantain', transcription: 'kpakpa' },
              { mot: 'Nyu', traduction: 'Manger', transcription: 'nyu' },
              { mot: 'Gbo', traduction: 'Eau / Boire', transcription: 'gbo' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Poisson" en Bété ?', choix: ['Yên', 'Glô', 'Blo', 'Kpakpa'] },
            solution: { reponse: 'Glô' },
            pointsXp: 10,
            explication: '"Glô" signifie Poisson en Bété.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Bété',
      description: 'Apprenez à vous présenter en Bété.',
      ordre: 4, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se présenter',
            mots: [
              { mot: 'Na dɔ yɛ...', traduction: 'Mon nom est...', transcription: 'na dɔ yɛ' },
              { mot: 'Wa dɔ yɛ ?', traduction: 'Quel est ton nom ?', transcription: 'wa dɔ yɛ' },
              { mot: 'Na glé yɛ...', traduction: 'Mon village est...', transcription: 'na glé yɛ' },
              { mot: 'Na yè yɛ...', traduction: 'Ma mère est...', transcription: 'na yè yɛ' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Wa dɔ yɛ ?" en Bété ?', choix: ['Comment vas-tu ?', 'Quel est ton nom ?', 'D\'où viens-tu ?', 'Quel âge as-tu ?'] },
            solution: { reponse: 'Quel est ton nom ?' },
            pointsXp: 10,
            explication: '"Wa dɔ yɛ ?" signifie "Quel est ton nom ?" en Bété.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Dialogue : Faire connaissance',
            dialogue: [
              { locuteur: 'Inconnu', texte: 'Gbahon ! Wa dɔ yɛ ?', traduction: 'Bonjour ! Quel est ton nom ?' },
              { locuteur: 'Vous', texte: 'Na dɔ yɛ Zadi. Na glé yɛ Gagnoa.', traduction: 'Mon nom est Zadi. Mon village est Gagnoa.' },
              { locuteur: 'Inconnu', texte: 'I ya ô ! Na dɔ yɛ Bléou.', traduction: 'Bienvenue ! Mon nom est Bléou.' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Mon village" en Bété ?', choix: ['Na dɔ', 'Na glé', 'Na yè', 'Wa dɔ'] },
            solution: { reponse: 'Na glé' },
            pointsXp: 10,
            explication: '"Na glé" signifie "Mon village" en Bété. "Glé" = village/champ.',
          },
        },
      ],
    },
    {
      titre: 'Le Marché et le Commerce en Bété',
      description: 'Négocier et acheter au marché en Bété.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Au marché',
            mots: [
              { mot: 'Zran', traduction: 'Argent', transcription: 'zran' },
              { mot: 'Dé', traduction: 'Donner', transcription: 'dé' },
              { mot: 'Plɛ', traduction: 'Combien ?', transcription: 'plɛ' },
              { mot: 'Tia', traduction: 'Grand / Beaucoup', transcription: 'tia' },
              { mot: 'Kla', traduction: 'Petit / Peu', transcription: 'kla' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dire "Combien ?" en Bété ?', choix: ['Zran', 'Plɛ', 'Dé', 'Tia'] },
            solution: { reponse: 'Plɛ' },
            pointsXp: 10,
            explication: '"Plɛ" signifie "Combien ?" en Bété.',
          },
        },
      ],
    },
    {
      titre: 'La Grammaire Bété',
      description: 'Structure de la phrase et tonalité en Bété.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'GRAMMAR', ordre: 1,
          contenu: {
            titre: 'L\'ordre des mots en Bété',
            explication: 'Le Bété suit l\'ordre Sujet-Objet-Verbe (SOV). Exemple : "Na glô nyu" (Je poisson mange = Je mange du poisson). Les tons (haut/bas) changent le sens des mots.',
            exemples: [
              { phrase: 'Na glô nyu', traduction: 'Je mange du poisson', transcription: 'na glô nyu' },
              { phrase: 'Na gbo gbo', traduction: 'Je bois de l\'eau', transcription: 'na gbo gbo' },
              { phrase: 'Wa gnon ya', traduction: 'Tu vas à la maison', transcription: 'wa gnon ya' },
            ],
          },
          exercise: {
            type: 'GRAMMAR',
            donnees: { question: 'Quel est l\'ordre des mots en Bété ?', choix: ['Sujet-Verbe-Objet', 'Verbe-Sujet-Objet', 'Sujet-Objet-Verbe', 'Objet-Verbe-Sujet'] },
            solution: { reponse: 'Sujet-Objet-Verbe' },
            pointsXp: 15,
            explication: 'Le Bété utilise l\'ordre SOV : le verbe vient en dernier.',
          },
        },
      ],
    },
  ],

  senoufo: [
    {
      titre: 'La Famille en Senoufo',
      description: 'Le vocabulaire de la famille élargie Senoufo.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La famille',
            mots: [
              { mot: 'Tyen', traduction: 'Père', transcription: 'tyen' },
              { mot: 'Ngo', traduction: 'Mère', transcription: 'ngo' },
              { mot: 'Tyɛlɛ', traduction: 'Enfant', transcription: 'tyɛlɛ' },
              { mot: 'Cɛ', traduction: 'Homme / Mari', transcription: 'cɛ' },
              { mot: 'Nyɔ', traduction: 'Femme / Épouse', transcription: 'nyɔ' },
              { mot: 'Kɔlɔ', traduction: 'Vieux / Ancien', transcription: 'kɔlɔ' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Mère" en Senoufo ?', choix: ['Tyen', 'Cɛ', 'Ngo', 'Nyɔ'] },
            solution: { reponse: 'Ngo' },
            pointsXp: 10,
            explication: '"Ngo" signifie Mère en Senoufo.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Senoufo',
      description: 'Les expressions pour se présenter en Senoufo.',
      ordre: 4, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se présenter',
            mots: [
              { mot: 'Na tɔgɔ...', traduction: 'Mon nom est...', transcription: 'na tɔgɔ' },
              { mot: 'I tɔgɔ di ?', traduction: 'Quel est ton nom ?', transcription: 'i tɔgɔ di' },
              { mot: 'Na kɔn...', traduction: 'Je viens de...', transcription: 'na kɔn' },
              { mot: 'I kɔn min ?', traduction: 'D\'où viens-tu ?', transcription: 'i kɔn min' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "I tɔgɔ di ?" en Senoufo ?', choix: ['Comment vas-tu ?', 'Quel est ton nom ?', 'Où vas-tu ?', 'Quel âge as-tu ?'] },
            solution: { reponse: 'Quel est ton nom ?' },
            pointsXp: 10,
            explication: '"I tɔgɔ di ?" = "Quel est ton nom ?" en Senoufo.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Dialogue : À la rencontre',
            dialogue: [
              { locuteur: 'Yéo', texte: 'Kawelé ! I tɔgɔ di ?', traduction: 'Bonjour ! Quel est ton nom ?' },
              { locuteur: 'Vous', texte: 'Na tɔgɔ Soro. Na kɔn Korhogo.', traduction: 'Mon nom est Soro. Je viens de Korhogo.' },
              { locuteur: 'Yéo', texte: 'Nanga ! Na tɔgɔ Yéo.', traduction: 'Merci ! Mon nom est Yéo.' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Je viens de..." en Senoufo ?', choix: ['Na tɔgɔ', 'Na kɔn', 'I kɔn min', 'I tɔgɔ di'] },
            solution: { reponse: 'Na kɔn' },
            pointsXp: 10,
            explication: '"Na kɔn..." signifie "Je viens de..." en Senoufo.',
          },
        },
      ],
    },
    {
      titre: 'Le Village et la Nature en Senoufo',
      description: 'Le vocabulaire de la nature et de la vie au village.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La nature',
            mots: [
              { mot: 'Folon', traduction: 'Soleil', transcription: 'folon' },
              { mot: 'Mogo', traduction: 'Eau', transcription: 'mogo' },
              { mot: 'Katyo', traduction: 'Terre', transcription: 'katyo' },
              { mot: 'Gbɔn', traduction: 'Feu', transcription: 'gbɔn' },
              { mot: 'Tiga', traduction: 'Arbre', transcription: 'tiga' },
              { mot: 'Kpɔ', traduction: 'Champ', transcription: 'kpɔ' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Terre" en Senoufo ?', choix: ['Mogo', 'Folon', 'Katyo', 'Gbɔn'] },
            solution: { reponse: 'Katyo' },
            pointsXp: 10,
            explication: '"Katyo" signifie Terre/Sol en Senoufo.',
          },
        },
      ],
    },
    {
      titre: 'Le Poro et les Traditions Senoufo',
      description: 'Comprendre les traditions initiatiques Senoufo.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Le vocabulaire sacré',
            mots: [
              { mot: 'Poro', traduction: 'Société d\'initiation', transcription: 'poro' },
              { mot: 'Sando', traduction: 'Devin / Voyant', transcription: 'sando' },
              { mot: 'Bois sacré', traduction: 'Sinzang', transcription: 'sinzang' },
              { mot: 'Kolo', traduction: 'Tambour sacré', transcription: 'kolo' },
              { mot: 'Balafon', traduction: 'Instrument musical', transcription: 'balafon' },
              { mot: 'Kafɔ', traduction: 'Association / Groupe', transcription: 'kafɔ' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Qu\'est-ce que le "Poro" chez les Senoufo ?', choix: ['Un plat traditionnel', 'Une société d\'initiation', 'Un instrument de musique', 'Un animal sacré'] },
            solution: { reponse: 'Une société d\'initiation' },
            pointsXp: 15,
            explication: 'Le Poro est la société d\'initiation traditionnelle des Senoufo, fondamentale dans leur culture.',
          },
        },
        {
          type: 'GRAMMAR', ordre: 2,
          contenu: {
            titre: 'Les classes nominales en Senoufo',
            explication: 'Le Senoufo utilise un système de classes nominales qui détermine les accords. Les noms sont classés en catégories (humains, animaux, objets, abstraits) et les déterminants changent selon la classe.',
            exemples: [
              { phrase: 'Cɛ wɔ', traduction: 'Cet homme', transcription: 'cɛ wɔ' },
              { phrase: 'Nyɔ wɔ', traduction: 'Cette femme', transcription: 'nyɔ wɔ' },
              { phrase: 'Sogoyon kɔ', traduction: 'Cet animal', transcription: 'sogoyon kɔ' },
              { phrase: 'Cogo kɔ', traduction: 'Cette maison', transcription: 'cogo kɔ' },
            ],
          },
          exercise: {
            type: 'GRAMMAR',
            donnees: { question: 'Comment dit-on "Cette femme" en Senoufo ?', choix: ['Cɛ wɔ', 'Nyɔ wɔ', 'Nyɔ kɔ', 'Cɛ kɔ'] },
            solution: { reponse: 'Nyɔ wɔ' },
            pointsXp: 15,
            explication: '"Wɔ" est le déterminant pour les humains en Senoufo.',
          },
        },
      ],
    },
  ],

  agni: [
    {
      titre: 'La Nourriture en Agni',
      description: 'Les aliments et la cuisine en Agni.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les aliments',
            mots: [
              { mot: 'Ɛdi', traduction: 'Nourriture', transcription: 'ɛdi' },
              { mot: 'Nsuo', traduction: 'Eau', transcription: 'nsuo' },
              { mot: 'Bayerɛ', traduction: 'Igname', transcription: 'bayerɛ' },
              { mot: 'Ɛnam', traduction: 'Viande', transcription: 'ɛnam' },
              { mot: 'Nkwan', traduction: 'Sauce / Soupe', transcription: 'nkwan' },
              { mot: 'Abɔdwɛ', traduction: 'Banane plantain', transcription: 'abɔdwɛ' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Igname" en Agni ?', choix: ['Ɛdi', 'Bayerɛ', 'Ɛnam', 'Nkwan'] },
            solution: { reponse: 'Bayerɛ' },
            pointsXp: 10,
            explication: '"Bayerɛ" signifie Igname en Agni.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Agni',
      description: 'Les phrases de présentation en Agni.',
      ordre: 4, niveau: 'A2', pointsXp: 60,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se présenter',
            mots: [
              { mot: 'Me din de...', traduction: 'Mon nom est...', transcription: 'mé din dé' },
              { mot: 'Wo din de sɛn ?', traduction: 'Quel est ton nom ?', transcription: 'wo din dé sɛn' },
              { mot: 'Me fi...', traduction: 'Je viens de...', transcription: 'mé fi' },
              { mot: 'Wo fi he ?', traduction: 'D\'où viens-tu ?', transcription: 'wo fi hé' },
              { mot: 'Me yɛ...', traduction: 'Je suis... (métier)', transcription: 'mé yɛ' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Wo din de sɛn ?" en Agni ?', choix: ['Comment vas-tu ?', 'Quel est ton nom ?', 'Où habites-tu ?', 'Quel âge as-tu ?'] },
            solution: { reponse: 'Quel est ton nom ?' },
            pointsXp: 10,
            explication: '"Wo din de sɛn ?" signifie "Quel est ton nom ?" en Agni.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Dialogue : Rencontre',
            dialogue: [
              { locuteur: 'Koffi', texte: 'Mô ô ! Wo din de sɛn ?', traduction: 'Bonjour ! Quel est ton nom ?' },
              { locuteur: 'Vous', texte: 'Me din de Ahou. Wo din de sɛn ?', traduction: 'Mon nom est Ahou. Quel est ton nom ?' },
              { locuteur: 'Koffi', texte: 'Me din de Koffi. Me fi Abengourou.', traduction: 'Mon nom est Koffi. Je viens d\'Abengourou.' },
              { locuteur: 'Vous', texte: 'Me fi Abidjan. Yɛbɛkɔ !', traduction: 'Je viens d\'Abidjan. Au revoir !' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dire "Au revoir" en Agni ?', choix: ['Mô ô', 'Akwaba', 'Yɛbɛkɔ', 'Aane'] },
            solution: { reponse: 'Yɛbɛkɔ' },
            pointsXp: 10,
            explication: '"Yɛbɛkɔ" signifie "Au revoir" en Agni.',
          },
        },
      ],
    },
    {
      titre: 'Le Marché en Agni',
      description: 'Acheter et négocier au marché en Agni.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Au marché',
            mots: [
              { mot: 'Sika', traduction: 'Argent', transcription: 'sika' },
              { mot: 'Ɛyɛ sɛn ?', traduction: 'C\'est combien ?', transcription: 'ɛyɛ sɛn' },
              { mot: 'Ɛso', traduction: 'C\'est cher', transcription: 'ɛso' },
              { mot: 'Tɔ', traduction: 'Acheter', transcription: 'tɔ' },
              { mot: 'Ma mé...', traduction: 'Donne-moi...', transcription: 'ma mé' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment demander "C\'est combien ?" en Agni ?', choix: ['Ɛso', 'Ma mé', 'Ɛyɛ sɛn ?', 'Sika'] },
            solution: { reponse: 'Ɛyɛ sɛn ?' },
            pointsXp: 10,
            explication: '"Ɛyɛ sɛn ?" signifie "C\'est combien ?" en Agni.',
          },
        },
      ],
    },
    {
      titre: 'La Royauté Agni',
      description: 'Le vocabulaire de la royauté et du pouvoir traditionnel Agni.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La cour royale',
            mots: [
              { mot: 'Nana', traduction: 'Roi / Chef suprême', transcription: 'nana' },
              { mot: 'Ahemfie', traduction: 'Palais royal', transcription: 'ahemfie' },
              { mot: 'Nkɔnhyɛ', traduction: 'Trône', transcription: 'nkɔnhyɛ' },
              { mot: 'Abirempon', traduction: 'Dignitaire / Notable', transcription: 'abirempon' },
              { mot: 'Ohemaa', traduction: 'Reine-mère', transcription: 'ohemaa' },
              { mot: 'Ahenemma', traduction: 'Princes / Princesses', transcription: 'ahenemma' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Qu\'est-ce que "Ohemaa" en Agni ?', choix: ['Princesse', 'Reine-mère', 'Servante', 'Prêtresse'] },
            solution: { reponse: 'Reine-mère' },
            pointsXp: 15,
            explication: '"Ohemaa" désigne la Reine-mère, figure centrale du pouvoir matrilinéaire Agni.',
          },
        },
      ],
    },
  ],

  gouro: [
    {
      titre: 'Le Corps en Gouro',
      description: 'Les parties du corps en Gouro.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Le corps',
            mots: [
              { mot: 'Zu', traduction: 'Tête', transcription: 'zu' },
              { mot: 'Yia', traduction: 'Œil', transcription: 'yia' },
              { mot: 'Nuo', traduction: 'Bouche', transcription: 'nuo' },
              { mot: 'Kɛ', traduction: 'Main', transcription: 'kɛ' },
              { mot: 'Gba', traduction: 'Pied', transcription: 'gba' },
              { mot: 'Gblɛ', traduction: 'Ventre', transcription: 'gblɛ' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Main" en Gouro ?', choix: ['Zu', 'Gba', 'Kɛ', 'Nuo'] },
            solution: { reponse: 'Kɛ' },
            pointsXp: 10,
            explication: '"Kɛ" signifie Main en Gouro.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Gouro',
      description: 'Les expressions de présentation en Gouro.',
      ordre: 4, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se présenter',
            mots: [
              { mot: 'Na dɔ lɛ...', traduction: 'Mon nom est...', transcription: 'na dɔ lɛ' },
              { mot: 'Wa dɔ lɛ ?', traduction: 'Quel est ton nom ?', transcription: 'wa dɔ lɛ' },
              { mot: 'Na gla lɛ...', traduction: 'Mon village est...', transcription: 'na gla lɛ' },
              { mot: 'Wa gla lɛ ?', traduction: 'D\'où viens-tu ?', transcription: 'wa gla lɛ' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Wa dɔ lɛ ?" en Gouro ?', choix: ['Où vas-tu ?', 'Quel est ton nom ?', 'Comment vas-tu ?', 'D\'où viens-tu ?'] },
            solution: { reponse: 'Quel est ton nom ?' },
            pointsXp: 10,
            explication: '"Wa dɔ lɛ ?" = "Quel est ton nom ?" en Gouro.',
          },
        },
      ],
    },
    {
      titre: 'La Nature et l\'Agriculture en Gouro',
      description: 'Le vocabulaire agricole et naturel Gouro.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Agriculture et nature',
            mots: [
              { mot: 'Nnua', traduction: 'Arbre', transcription: 'nnua' },
              { mot: 'Kpli', traduction: 'Champ', transcription: 'kpli' },
              { mot: 'Za', traduction: 'Pluie', transcription: 'za' },
              { mot: 'Wla', traduction: 'Soleil', transcription: 'wla' },
              { mot: 'Blé', traduction: 'Terre / Sol', transcription: 'blé' },
              { mot: 'Gla', traduction: 'Village', transcription: 'gla' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Champ" en Gouro ?', choix: ['Nnua', 'Kpli', 'Blé', 'Gla'] },
            solution: { reponse: 'Kpli' },
            pointsXp: 10,
            explication: '"Kpli" signifie Champ en Gouro.',
          },
        },
      ],
    },
    {
      titre: 'Traditions et Masques Gouro',
      description: 'Le vocabulaire des masques et traditions Gouro.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les masques et traditions',
            mots: [
              { mot: 'Glu', traduction: 'Masque', transcription: 'glu' },
              { mot: 'Zamblé', traduction: 'Masque antilope (danse)', transcription: 'zamblé' },
              { mot: 'Djé', traduction: 'Esprit / Ancêtre', transcription: 'djé' },
              { mot: 'Fla', traduction: 'Tisser / Tissu', transcription: 'fla' },
              { mot: 'Goli', traduction: 'Cérémonie / Fête', transcription: 'goli' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Qu\'est-ce que le "Zamblé" chez les Gouro ?', choix: ['Un plat', 'Un masque antilope', 'Un instrument', 'Un chef'] },
            solution: { reponse: 'Un masque antilope' },
            pointsXp: 15,
            explication: 'Le Zamblé est un masque représentant une antilope, utilisé dans les danses rituelles Gouro.',
          },
        },
      ],
    },
  ],

  guere: [
    {
      titre: 'Le Corps en Guéré',
      description: 'Les parties du corps en Guéré.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Le corps',
            mots: [
              { mot: 'Zu', traduction: 'Tête', transcription: 'zu' },
              { mot: 'Nyo', traduction: 'Œil', transcription: 'nyo' },
              { mot: 'Nuo', traduction: 'Bouche', transcription: 'nuo' },
              { mot: 'Kɛ', traduction: 'Main', transcription: 'kɛ' },
              { mot: 'Gbè', traduction: 'Pied', transcription: 'gbè' },
              { mot: 'Wle', traduction: 'Cœur', transcription: 'wle' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Cœur" en Guéré ?', choix: ['Zu', 'Wle', 'Kɛ', 'Gbè'] },
            solution: { reponse: 'Wle' },
            pointsXp: 10,
            explication: '"Wle" signifie Cœur en Guéré.',
          },
        },
      ],
    },
    {
      titre: 'Se Présenter en Guéré',
      description: 'Les expressions de présentation en Guéré.',
      ordre: 4, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se présenter',
            mots: [
              { mot: 'Na dɔ nɛ...', traduction: 'Mon nom est...', transcription: 'na dɔ nɛ' },
              { mot: 'Wa dɔ nɛ ?', traduction: 'Quel est ton nom ?', transcription: 'wa dɔ nɛ' },
              { mot: 'Na blo yɛ...', traduction: 'Mon village est...', transcription: 'na blo yɛ' },
              { mot: 'Wa blo yɛ ?', traduction: 'D\'où viens-tu ?', transcription: 'wa blo yɛ' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Wa blo yɛ ?" en Guéré ?', choix: ['Quel est ton nom ?', 'D\'où viens-tu ?', 'Comment vas-tu ?', 'Où vas-tu ?'] },
            solution: { reponse: 'D\'où viens-tu ?' },
            pointsXp: 10,
            explication: '"Wa blo yɛ ?" = "D\'où viens-tu ?" en Guéré. "Blo" = village.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Faire connaissance',
            dialogue: [
              { locuteur: 'Gueu', texte: 'I ya ô ! Wa dɔ nɛ ?', traduction: 'Bienvenue ! Quel est ton nom ?' },
              { locuteur: 'Vous', texte: 'Na dɔ nɛ Tia. Na blo yɛ Man.', traduction: 'Mon nom est Tia. Mon village est Man.' },
              { locuteur: 'Gueu', texte: 'Gblo nyo ! Na dɔ nɛ Gueu.', traduction: 'Merci beaucoup ! Mon nom est Gueu.' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Merci beaucoup" en Guéré ?', choix: ['I ya ô', 'Kpa-a', 'Gblo nyo', 'Na dɔ nɛ'] },
            solution: { reponse: 'Gblo nyo' },
            pointsXp: 10,
            explication: '"Gblo nyo" signifie "Merci beaucoup" en Guéré.',
          },
        },
      ],
    },
    {
      titre: 'La Chasse et la Forêt en Guéré',
      description: 'Le vocabulaire de la forêt et des activités traditionnelles.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La forêt et la chasse',
            mots: [
              { mot: 'Gba', traduction: 'Forêt', transcription: 'gba' },
              { mot: 'Win', traduction: 'Animal', transcription: 'win' },
              { mot: 'Glou', traduction: 'Rivière', transcription: 'glou' },
              { mot: 'Zia', traduction: 'Chasser', transcription: 'zia' },
              { mot: 'Diu', traduction: 'Oiseau', transcription: 'diu' },
              { mot: 'Gblo', traduction: 'Éléphant', transcription: 'gblo' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Forêt" en Guéré ?', choix: ['Glou', 'Gba', 'Win', 'Diu'] },
            solution: { reponse: 'Gba' },
            pointsXp: 10,
            explication: '"Gba" signifie Forêt en Guéré.',
          },
        },
      ],
    },
    {
      titre: 'Les Masques Guéré',
      description: 'Les masques sacrés et leur rôle dans la culture Guéré.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les masques et cérémonies',
            mots: [
              { mot: 'Gla', traduction: 'Masque', transcription: 'gla' },
              { mot: 'Wê', traduction: 'Peuple Wê (auto-désignation)', transcription: 'wê' },
              { mot: 'Gué', traduction: 'Esprit / Force spirituelle', transcription: 'gué' },
              { mot: 'Tɔ', traduction: 'Danse rituelle', transcription: 'tɔ' },
              { mot: 'Kla', traduction: 'Lignage / Clan', transcription: 'kla' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Quel est le vrai nom du peuple "Guéré" ?', choix: ['Gla', 'Wê', 'Gué', 'Kla'] },
            solution: { reponse: 'Wê' },
            pointsXp: 15,
            explication: 'Les Guéré s\'auto-désignent "Wê". "Guéré" est le nom donné par les colonisateurs.',
          },
        },
      ],
    },
  ],

  nouchi: [
    {
      titre: 'Le Transport en Nouchi',
      description: 'Le vocabulaire du transport urbain à Abidjan.',
      ordre: 3, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Se déplacer à Abidjan',
            mots: [
              { mot: 'Gbaka', traduction: 'Minibus de transport en commun', transcription: 'gbaka' },
              { mot: 'Wôrô-wôrô', traduction: 'Taxi communal', transcription: 'wôrô-wôrô' },
              { mot: 'Toutou', traduction: 'Voiture', transcription: 'toutou' },
              { mot: 'Djôssi', traduction: 'Descendre (du bus)', transcription: 'djôssi' },
              { mot: 'Monter corps', traduction: 'Monter à bord', transcription: 'monté cor' },
              { mot: 'Y\'a place', traduction: 'Il y a de la place', transcription: 'ya plas' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment s\'appelle le minibus de transport en commun à Abidjan ?', choix: ['Wôrô-wôrô', 'Toutou', 'Gbaka', 'Djôssi'] },
            solution: { reponse: 'Gbaka' },
            pointsXp: 10,
            explication: 'Le "Gbaka" est le minibus emblématique du transport à Abidjan.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Prendre un gbaka',
            dialogue: [
              { locuteur: 'Apprenti', texte: 'Adjamé ! Adjamé ! Y\'a place !', traduction: 'Direction Adjamé ! Il y a de la place !' },
              { locuteur: 'Vous', texte: 'C\'est combien pour Adjamé ?', traduction: 'C\'est combien pour Adjamé ?' },
              { locuteur: 'Apprenti', texte: 'C\'est 200 francs.', traduction: 'C\'est 200 francs.' },
              { locuteur: 'Vous', texte: 'Djôssi ! Djôssi là-bas !', traduction: 'Je descends ! Arrêtez-vous !' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Djôssi" en Nouchi ?', choix: ['Monter', 'Descendre', 'Payer', 'Attendre'] },
            solution: { reponse: 'Descendre' },
            pointsXp: 10,
            explication: '"Djôssi" signifie descendre du véhicule en Nouchi.',
          },
        },
      ],
    },
    {
      titre: 'Les Relations Sociales en Nouchi',
      description: 'Le vocabulaire des relations et de la vie sociale.',
      ordre: 4, niveau: 'A2', pointsXp: 60,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les relations',
            mots: [
              { mot: 'Go', traduction: 'Fille / Copine', transcription: 'go' },
              { mot: 'Môgô', traduction: 'Gars / Mec', transcription: 'môgô' },
              { mot: 'Bro', traduction: 'Frère / Ami proche', transcription: 'bro' },
              { mot: 'Dja', traduction: 'Famille', transcription: 'dja' },
              { mot: 'Gaou', traduction: 'Naïf / Quelqu\'un qu\'on trompe', transcription: 'gaou' },
              { mot: 'Enjailler', traduction: 'S\'amuser / Profiter', transcription: 'enjaillé' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Comment dit-on "Ami proche / Frère" en Nouchi ?', choix: ['Go', 'Môgô', 'Bro', 'Gaou'] },
            solution: { reponse: 'Bro' },
            pointsXp: 10,
            explication: '"Bro" (de l\'anglais brother) signifie ami proche en Nouchi.',
          },
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Entre amis',
            dialogue: [
              { locuteur: 'Ami', texte: 'Wesh bro ! Ça va ou bien ?', traduction: 'Salut mon pote ! Ça va ?' },
              { locuteur: 'Vous', texte: 'Ça va dêh ! On est ensemble !', traduction: 'Ça va ! On est solidaires !' },
              { locuteur: 'Ami', texte: 'On va s\'enjailler ce soir au maquis ?', traduction: 'On va s\'amuser ce soir au restaurant ?' },
              { locuteur: 'Vous', texte: 'Vrai-vrai ! On fonce !', traduction: 'Vraiment ! Allons-y !' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "On est ensemble" en Nouchi ?', choix: ['On habite ensemble', 'On est solidaires', 'On travaille ensemble', 'On mange ensemble'] },
            solution: { reponse: 'On est solidaires' },
            pointsXp: 10,
            explication: '"On est ensemble" est l\'expression de solidarité emblématique du Nouchi.',
          },
        },
      ],
    },
    {
      titre: 'La Nourriture Ivoirienne en Nouchi',
      description: 'Le vocabulaire culinaire ivoirien version Nouchi.',
      ordre: 5, niveau: 'A2', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La cuisine de rue',
            mots: [
              { mot: 'Garba', traduction: 'Attiéké avec thon frit', transcription: 'garba' },
              { mot: 'Alloco', traduction: 'Bananes plantain frites', transcription: 'alloco' },
              { mot: 'Maquis', traduction: 'Restaurant populaire en plein air', transcription: 'maki' },
              { mot: 'Choukouya', traduction: 'Viande braisée', transcription: 'choukouya' },
              { mot: 'Koutoukou', traduction: 'Alcool artisanal local', transcription: 'koutoukou' },
              { mot: 'Dèguè', traduction: 'Dessert au yaourt et couscous de mil', transcription: 'dèguè' },
            ],
          },
          exercise: {
            type: 'VOCABULARY',
            donnees: { question: 'Qu\'est-ce que le "Garba" en Côte d\'Ivoire ?', choix: ['Du riz au gras', 'De l\'attiéké avec thon frit', 'De la viande braisée', 'Des bananes frites'] },
            solution: { reponse: 'De l\'attiéké avec thon frit' },
            pointsXp: 10,
            explication: 'Le Garba est un plat populaire à base d\'attiéké (semoule de manioc) et thon frit.',
          },
        },
      ],
    },
    {
      titre: 'L\'Argot Avancé du Nouchi',
      description: 'Les expressions avancées et l\'évolution du Nouchi.',
      ordre: 6, niveau: 'B1', pointsXp: 70,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Expressions avancées',
            mots: [
              { mot: 'Gbè', traduction: 'Mort / Fini / C\'est terminé', transcription: 'gbè' },
              { mot: 'Yako', traduction: 'Condoléances / Courage', transcription: 'yako' },
              { mot: 'Daba', traduction: 'Travailler dur', transcription: 'daba' },
              { mot: 'Enjaillement', traduction: 'La fête / L\'ambiance', transcription: 'enjaillement' },
              { mot: 'Faire le mec', traduction: 'Frimer / Se vanter', transcription: 'fèr le mec' },
              { mot: 'C\'est gâté', traduction: 'C\'est foutu / Problème grave', transcription: 'cé gâté' },
            ],
          },
          exercise: {
            type: 'TRANSLATION',
            donnees: { question: 'Que signifie "Daba" en Nouchi ?', choix: ['Danser', 'Manger', 'Travailler dur', 'Dormir'] },
            solution: { reponse: 'Travailler dur' },
            pointsXp: 10,
            explication: '"Daba" signifie travailler dur en Nouchi, dérivé du nom de l\'outil agricole.',
          },
        },
        {
          type: 'GRAMMAR', ordre: 2,
          contenu: {
            titre: 'La construction du Nouchi',
            explication: 'Le Nouchi mélange le français avec des mots issus du Dioula, du Baoulé, de l\'anglais et d\'autres langues ivoiriennes. La grammaire simplifie le français : suppression des articles, verbes à l\'infinitif, inversion des sens.',
            exemples: [
              { phrase: 'Il a géré', traduction: 'Il a bien fait / Il a réussi', transcription: 'il a jéré' },
              { phrase: 'C\'est chaud', traduction: 'C\'est difficile / dangereux', transcription: 'cé cho' },
              { phrase: 'Il est dedans', traduction: 'Il est impliqué / Il maîtrise', transcription: 'il è dedan' },
              { phrase: 'Ça va aller dêh', traduction: 'Tout ira bien (avec conviction)', transcription: 'sa va alé dê' },
            ],
          },
          exercise: {
            type: 'GRAMMAR',
            donnees: { question: 'En Nouchi, "C\'est chaud" signifie :', choix: ['Il fait chaud', 'C\'est difficile', 'C\'est brûlant', 'C\'est rapide'] },
            solution: { reponse: 'C\'est difficile' },
            pointsXp: 15,
            explication: 'En Nouchi, les mots français changent souvent de sens. "Chaud" = difficile/dangereux.',
          },
        },
      ],
    },
  ],
};

// ============================================================
// SCRIPT D'INSERTION
// ============================================================

async function main() {
  console.log('📚 Insertion des leçons structurées V2...\n');

  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) langMap[l.code] = l.id;

  let totalLessons = 0;
  let totalSteps = 0;
  let totalExercises = 0;
  let skipped = 0;

  for (const [langCode, lessons] of Object.entries(LESSONS_V2)) {
    const languageId = langMap[langCode];
    if (!languageId) {
      console.log(`⚠️  Langue "${langCode}" non trouvée, ignorée.`);
      continue;
    }

    console.log(`📖 ${langCode.toUpperCase()} — ${lessons.length} leçons...`);

    for (const lessonData of lessons) {
      // Vérifier si la leçon existe déjà
      const existing = await prisma.lesson.findFirst({
        where: { languageId, titre: lessonData.titre },
      });
      if (existing) {
        skipped++;
        continue;
      }

      const lesson = await prisma.lesson.create({
        data: {
          languageId,
          titre: lessonData.titre,
          description: lessonData.description,
          ordre: lessonData.ordre,
          niveau: lessonData.niveau,
          pointsXp: lessonData.pointsXp,
          isActive: true,
        },
      });
      totalLessons++;

      for (const stepData of lessonData.steps) {
        const step = await prisma.lessonStep.create({
          data: {
            lessonId: lesson.id,
            type: stepData.type,
            contenu: stepData.contenu,
            ordre: stepData.ordre,
            audioUrl: stepData.audioUrl || null,
            imageUrl: stepData.imageUrl || null,
          },
        });
        totalSteps++;

        if (stepData.exercise) {
          await prisma.exercise.create({
            data: {
              stepId: step.id,
              type: stepData.exercise.type,
              donnees: stepData.exercise.donnees,
              solution: stepData.exercise.solution,
              pointsXp: stepData.exercise.pointsXp || 10,
              explication: stepData.exercise.explication || null,
            },
          });
          totalExercises++;
        }
      }
    }
  }

  console.log(`\n✅ Terminé !`);
  console.log(`   ${totalLessons} leçons créées`);
  console.log(`   ${totalSteps} étapes créées`);
  console.log(`   ${totalExercises} exercices créés`);
  console.log(`   ${skipped} doublons ignorés`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
