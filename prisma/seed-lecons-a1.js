/**
 * Seed des leçons A1 squelettes pour les 9 langues MVP
 * 5 leçons thématiques par langue, chacune avec :
 *   - 1 step VOCABULARY (5 mots + contexte)
 *   - 1 step DIALOGUE (échange typique)
 *   - 1 exercice VOCABULARY (QCM)
 * isActive: false → dormant, activable en 1 clic depuis le CMS
 * Sécurisé : vérifie par languageId + titre avant création
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Structure des leçons par langue ─────────────────────────────────────────

const LECONS = {

  // ╔══════════════════════╗
  // ║  BAOULÉ              ║
  // ╚══════════════════════╝
  baoule: [
    {
      titre: 'Les Salutations en Baoulé',
      description: 'Apprendre à saluer et à répondre aux salutations en baoulé.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Mots de salutation',
            mots: [
              { mot: 'Akwaba', traduction: 'Bienvenue', transcription: 'a-KWA-ba' },
              { mot: 'A lo', traduction: 'Bonjour', transcription: 'a-LO' },
              { mot: 'I kié', traduction: 'Comment vas-tu ?', transcription: 'i-KIEH' },
              { mot: "N'da", traduction: 'Merci', transcription: 'n-da' },
              { mot: 'Kɔ wɛ', traduction: 'Au revoir', transcription: 'kɔ-WEH' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Bienvenue" en baoulé ?', choix: ['Akwaba', 'A lo', 'Kɔ wɛ', "N'da"] },
              solution: { reponse: 'Akwaba' },
              explication: '"Akwaba" est l\'expression d\'accueil par excellence en baoulé.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Première rencontre',
            lignes: [
              { locuteur: 'Kofi', texte: 'A lo !', traduction: 'Bonjour !' },
              { locuteur: 'Akua', texte: 'A lo ! I kié ?', traduction: 'Bonjour ! Comment vas-tu ?' },
              { locuteur: 'Kofi', texte: 'Mé kié fɛ. I kié ?', traduction: 'Je vais bien. Et toi ?' },
              { locuteur: 'Akua', texte: "Mé kié. N'da !", traduction: 'Je vais bien. Merci !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres de 1 à 10 en Baoulé',
      description: 'Compter de 1 à 10 en baoulé et reconnaître les chiffres.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les chiffres',
            mots: [
              { mot: 'Kun', traduction: '1 — Un', transcription: 'kun' },
              { mot: 'Nyo', traduction: '2 — Deux', transcription: 'nyo' },
              { mot: 'Ngbla', traduction: '3 — Trois', transcription: 'ngbla' },
              { mot: 'Nyan', traduction: '4 — Quatre', transcription: 'nyan' },
              { mot: 'Nnu', traduction: '5 — Cinq', transcription: 'nnu' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Nyo" ?', choix: ['Un', 'Deux', 'Trois', 'Cinq'] },
              solution: { reponse: 'Deux' },
              explication: '"Nyo" signifie "deux" en baoulé.' },
          ],
        },
        {
          type: 'VOCABULARY', ordre: 2,
          contenu: {
            titre: 'Les chiffres (suite)',
            mots: [
              { mot: 'Nsien', traduction: '6 — Six', transcription: 'nsien' },
              { mot: 'Nnzonle', traduction: '7 — Sept', transcription: 'nzo-lé' },
              { mot: 'Nnuanle', traduction: '8 — Huit', transcription: 'nua-lé' },
              { mot: 'Nnuonle', traduction: '9 — Neuf', transcription: 'nuo-lé' },
              { mot: 'Bue', traduction: '10 — Dix', transcription: 'bueh' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Dix" en baoulé ?', choix: ['Nsien', 'Bue', 'Nnu', 'Nnzonle'] },
              solution: { reponse: 'Bue' },
              explication: '"Bue" signifie "dix" en baoulé.' },
          ],
        },
      ],
    },
    {
      titre: 'La Famille en Baoulé',
      description: 'Le vocabulaire de la famille en baoulé.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Membres de la famille',
            mots: [
              { mot: 'Aya', traduction: 'Mère', transcription: 'a-ya' },
              { mot: 'Egna', traduction: 'Père', transcription: 'eg-na' },
              { mot: 'Owi', traduction: 'Frère aîné', transcription: 'o-wi' },
              { mot: 'Nana', traduction: 'Grand-mère', transcription: 'na-na' },
              { mot: 'Wawa', traduction: 'Enfant', transcription: 'wa-wa' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Mère" en baoulé ?', choix: ['Aya', 'Egna', 'Nana', 'Owi'] },
              solution: { reponse: 'Aya' },
              explication: '"Aya" désigne la mère en baoulé.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Parler de sa famille',
            lignes: [
              { locuteur: 'Yao', texte: 'Wié n\'aya kié ?', traduction: 'Comment va ta mère ?' },
              { locuteur: 'Ama', texte: 'N\'aya kié fɛ. N\'da !', traduction: 'Ma mère va bien. Merci !' },
              { locuteur: 'Yao', texte: 'Wié n\'egna ?', traduction: 'Et ton père ?' },
              { locuteur: 'Ama', texte: 'N\'egna kié tra.', traduction: 'Mon père va très bien.' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Au Marché en Baoulé',
      description: 'Vocabulaire pour acheter et négocier au marché.',
      ordre: 4, niveau: 'A1', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Au marché',
            mots: [
              { mot: 'Wié wié ngue ?', traduction: 'Combien coûte ?', transcription: 'wié-wié-nguê' },
              { mot: 'Yɛ lɛ gbɛ', traduction: 'C\'est trop cher', transcription: 'yeh-leh-gbeh' },
              { mot: 'Wɛ man', traduction: 'Donne-moi', transcription: 'weh-man' },
              { mot: 'Manlɛ', traduction: 'Nourriture', transcription: 'man-leh' },
              { mot: 'Mian', traduction: 'Eau', transcription: 'mian' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment demander le prix d\'un article ?', choix: ['Wié wié ngue ?', 'Wɛ man', 'Akwaba', 'Kɔ wɛ'] },
              solution: { reponse: 'Wié wié ngue ?' },
              explication: '"Wié wié ngue ?" signifie "Combien coûte ?" au marché baoulé.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Acheter au marché',
            lignes: [
              { locuteur: 'Client', texte: 'Akwaba ! Wié wié ngue ?', traduction: 'Bonjour ! Combien coûte ça ?' },
              { locuteur: 'Vendeur', texte: 'Nyo bue FCFA.', traduction: 'Deux cents francs.' },
              { locuteur: 'Client', texte: 'Yɛ lɛ gbɛ ! Kun bue ?', traduction: 'C\'est trop cher ! Cent francs ?' },
              { locuteur: 'Vendeur', texte: 'Sɛ, wɛ man !', traduction: 'D\'accord, prends-le !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Le Corps Humain en Baoulé',
      description: 'Nommer les parties du corps en baoulé.',
      ordre: 5, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Le corps',
            mots: [
              { mot: 'Ti', traduction: 'Tête', transcription: 'ti' },
              { mot: 'Nuɛ', traduction: 'Œil', transcription: 'nueh' },
              { mot: 'Blo', traduction: 'Main', transcription: 'blo' },
              { mot: 'Sa', traduction: 'Pied', transcription: 'sa' },
              { mot: 'Kpan', traduction: 'Ventre / Poitrine', transcription: 'kpan' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Tête" en baoulé ?', choix: ['Ti', 'Nuɛ', 'Blo', 'Sa'] },
              solution: { reponse: 'Ti' },
              explication: '"Ti" désigne la tête en baoulé.' },
          ],
        },
      ],
    },
  ],

  // ╔══════════════════════╗
  // ║  DIOULA              ║
  // ╚══════════════════════╝
  dioula: [
    {
      titre: 'Les Salutations en Dioula',
      description: 'Apprendre à saluer en dioula selon le moment de la journée.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations du jour',
            mots: [
              { mot: 'I ni ce', traduction: 'Bonjour (à une personne)', transcription: 'i-ni-CHÉ' },
              { mot: 'Aw ni ce', traduction: 'Bonjour (à plusieurs)', transcription: 'aw-ni-CHÉ' },
              { mot: 'I ka kɛnɛ wa ?', traduction: 'Tu vas bien ?', transcription: 'i-ka-kè-nè-wa' },
              { mot: 'Toro si ma', traduction: 'Ça va bien', transcription: 'to-ro-si-ma' },
              { mot: 'Kana to', traduction: 'Au revoir', transcription: 'ka-na-to' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment saluer une seule personne en dioula ?', choix: ['I ni ce', 'Aw ni ce', 'Kana to', 'Awo'] },
              solution: { reponse: 'I ni ce' },
              explication: '"I ni ce" s\'adresse à une seule personne. "Aw ni ce" s\'adresse à plusieurs.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Se saluer au village',
            lignes: [
              { locuteur: 'Sékou', texte: 'I ni ce !', traduction: 'Bonjour !' },
              { locuteur: 'Fatoumata', texte: 'I ni ce ! I ka kɛnɛ wa ?', traduction: 'Bonjour ! Tu vas bien ?' },
              { locuteur: 'Sékou', texte: 'Toro si ma. I ni baarɛ !', traduction: 'Ça va bien. Merci !' },
              { locuteur: 'Fatoumata', texte: 'Kana to !', traduction: 'Au revoir !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres en Dioula',
      description: 'Compter de 1 à 10 en dioula.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Chiffres 1 à 5',
            mots: [
              { mot: 'Kelen', traduction: '1 — Un', transcription: 'ké-lèn' },
              { mot: 'Fila', traduction: '2 — Deux', transcription: 'fi-la' },
              { mot: 'Saba', traduction: '3 — Trois', transcription: 'sa-ba' },
              { mot: 'Naani', traduction: '4 — Quatre', transcription: 'naa-ni' },
              { mot: 'Duuru', traduction: '5 — Cinq', transcription: 'duu-ru' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Saba" ?', choix: ['Un', 'Deux', 'Trois', 'Quatre'] },
              solution: { reponse: 'Trois' },
              explication: '"Saba" signifie "trois" en dioula.' },
          ],
        },
        {
          type: 'VOCABULARY', ordre: 2,
          contenu: {
            titre: 'Chiffres 6 à 10',
            mots: [
              { mot: 'Wɔɔrɔ', traduction: '6 — Six', transcription: 'wɔɔ-rɔ' },
              { mot: 'Wolonfila', traduction: '7 — Sept', transcription: 'wo-lon-fi-la' },
              { mot: 'Segin', traduction: '8 — Huit', transcription: 'sé-guin' },
              { mot: 'Kononton', traduction: '9 — Neuf', transcription: 'ko-no-ton' },
              { mot: 'Tan', traduction: '10 — Dix', transcription: 'tan' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Dix" en dioula ?', choix: ['Wɔɔrɔ', 'Segin', 'Tan', 'Kononton'] },
              solution: { reponse: 'Tan' },
              explication: '"Tan" signifie "dix" en dioula.' },
          ],
        },
      ],
    },
    {
      titre: 'La Famille en Dioula',
      description: 'Présenter sa famille en dioula.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La famille',
            mots: [
              { mot: 'Ba', traduction: 'Mère', transcription: 'ba' },
              { mot: 'Fa', traduction: 'Père', transcription: 'fa' },
              { mot: 'Den', traduction: 'Enfant', transcription: 'dèn' },
              { mot: 'Kɔrɔ', traduction: 'Aîné(e)', transcription: 'kɔ-rɔ' },
              { mot: 'Dɔgɔ', traduction: 'Cadet(te)', transcription: 'dɔ-gɔ' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Père" en dioula ?', choix: ['Ba', 'Fa', 'Den', 'Kɔrɔ'] },
              solution: { reponse: 'Fa' },
              explication: '"Fa" désigne le père et "Ba" la mère en dioula.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Parler de sa famille',
            lignes: [
              { locuteur: 'Moussa', texte: 'I fa tɔgɔ di ?', traduction: 'Comment s\'appelle ton père ?' },
              { locuteur: 'Aminata', texte: 'N fa tɔgɔ Oumar.', traduction: 'Mon père s\'appelle Oumar.' },
              { locuteur: 'Moussa', texte: 'Aw ye denmisɛnw saba ye wa ?', traduction: 'Vous êtes trois enfants ?' },
              { locuteur: 'Aminata', texte: 'Awo, aw ye saba ye.', traduction: 'Oui, nous sommes trois.' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Au Marché en Dioula',
      description: 'Acheter et négocier au marché en dioula.',
      ordre: 4, niveau: 'A1', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vocabulaire du marché',
            mots: [
              { mot: 'Jɔli ye a sɔrɔ ?', traduction: 'Combien ça coûte ?', transcription: 'jo-li-yé-a-sɔ-rɔ' },
              { mot: 'A gɛlɛn', traduction: 'C\'est trop cher', transcription: 'a-gè-lèn' },
              { mot: 'A di n ma', traduction: 'Donne-le moi', transcription: 'a-di-n-ma' },
              { mot: 'Ji', traduction: 'Eau', transcription: 'ji' },
              { mot: 'Dumu', traduction: 'Nourriture', transcription: 'du-mu' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment demander le prix en dioula ?', choix: ['Jɔli ye a sɔrɔ ?', 'A gɛlɛn', 'A di n ma', 'Dumu'] },
              solution: { reponse: 'Jɔli ye a sɔrɔ ?' },
              explication: '"Jɔli ye a sɔrɔ ?" est la question clé pour demander un prix au marché.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Au marché de Bouaké',
            lignes: [
              { locuteur: 'Acheteur', texte: 'I ni ce ! Jɔli ye dumu nin sɔrɔ ?', traduction: 'Bonjour ! Combien coûte cette nourriture ?' },
              { locuteur: 'Vendeur', texte: 'Tan solomasɛgɛ (1000 FCFA).', traduction: 'Mille francs.' },
              { locuteur: 'Acheteur', texte: 'A gɛlɛn ! Duuru solomasɛgɛ (500) ?', traduction: 'C\'est cher ! Cinq cents ?' },
              { locuteur: 'Vendeur', texte: 'Awo, a di i ma !', traduction: 'D\'accord, prends-le !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Couleurs en Dioula',
      description: 'Apprendre les couleurs principales en dioula.',
      ordre: 5, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les couleurs',
            mots: [
              { mot: 'Jɛ', traduction: 'Blanc', transcription: 'jeh' },
              { mot: 'Fin', traduction: 'Noir', transcription: 'fin' },
              { mot: 'Kulujɛ', traduction: 'Rouge', transcription: 'ku-lu-jeh' },
              { mot: 'Sɔ', traduction: 'Vert', transcription: 'sɔ' },
              { mot: 'Wuludala', traduction: 'Jaune', transcription: 'wu-lu-da-la' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Blanc" en dioula ?', choix: ['Fin', 'Jɛ', 'Kulujɛ', 'Sɔ'] },
              solution: { reponse: 'Jɛ' },
              explication: '"Jɛ" signifie "blanc" en dioula. "Fin" signifie "noir".' },
          ],
        },
      ],
    },
  ],

  // ╔══════════════════════╗
  // ║  AGNI               ║
  // ╚══════════════════════╝
  agni: [
    {
      titre: 'Les Salutations en Agni',
      description: 'Saluer et répondre aux salutations en agni.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Mots de salutation',
            mots: [
              { mot: 'Akwaba', traduction: 'Bienvenue', transcription: 'a-KWA-ba' },
              { mot: 'Mɔrɔ', traduction: 'Bonjour', transcription: 'mɔ-rɔ' },
              { mot: 'I kié ?', traduction: 'Comment vas-tu ?', transcription: 'i-kié' },
              { mot: 'Meda wase', traduction: 'Merci', transcription: 'mé-da-wa-sé' },
              { mot: 'Daabi', traduction: 'Non', transcription: 'daa-bi' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Merci" en agni ?', choix: ['Akwaba', 'Meda wase', 'Daabi', 'Mɔrɔ'] },
              solution: { reponse: 'Meda wase' },
              explication: '"Meda wase" est l\'expression de remerciement en agni.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Rencontre à Abengourou',
            lignes: [
              { locuteur: 'Kwaku', texte: 'Mɔrɔ ! I kié ?', traduction: 'Bonjour ! Comment vas-tu ?' },
              { locuteur: 'Akosua', texte: 'Mé kié. Meda wase !', traduction: 'Je vais bien. Merci !' },
              { locuteur: 'Kwaku', texte: 'Akwaba Abengourou !', traduction: 'Bienvenue à Abengourou !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres en Agni',
      description: 'Compter de 1 à 10 en agni.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les chiffres',
            mots: [
              { mot: 'Baakɔ', traduction: '1 — Un', transcription: 'baa-kɔ' },
              { mot: 'Abien', traduction: '2 — Deux', transcription: 'a-bièn' },
              { mot: 'Aba', traduction: '3 — Trois', transcription: 'a-ba' },
              { mot: 'Anan', traduction: '4 — Quatre', transcription: 'a-nan' },
              { mot: 'Anum', traduction: '5 — Cinq', transcription: 'a-num' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Aba" en agni ?', choix: ['Un', 'Deux', 'Trois', 'Quatre'] },
              solution: { reponse: 'Trois' },
              explication: '"Aba" signifie "trois" en agni.' },
          ],
        },
      ],
    },
    {
      titre: 'La Famille en Agni',
      description: 'Vocabulaire de la famille en agni.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'La famille agni',
            mots: [
              { mot: 'Ena', traduction: 'Mère', transcription: 'é-na' },
              { mot: 'Agya', traduction: 'Père', transcription: 'a-gya' },
              { mot: 'Onua', traduction: 'Frère / Sœur', transcription: 'o-nua' },
              { mot: 'Nana', traduction: 'Grand-mère / Chef', transcription: 'na-na' },
              { mot: 'Abofra', traduction: 'Enfant', transcription: 'a-bo-fra' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Père" en agni ?', choix: ['Ena', 'Agya', 'Nana', 'Onua'] },
              solution: { reponse: 'Agya' },
              explication: '"Agya" désigne le père en agni.' },
          ],
        },
      ],
    },
    {
      titre: 'Au Marché en Agni',
      description: 'Expressions pour faire ses courses en agni.',
      ordre: 4, niveau: 'A1', pointsXp: 55,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Au marché',
            mots: [
              { mot: 'Wié wié ngue ?', traduction: 'Combien coûte ?', transcription: 'wié-wié-nguê' },
              { mot: 'Nsuo', traduction: 'Eau', transcription: 'n-suo' },
              { mot: 'Aduane', traduction: 'Nourriture', transcription: 'a-dwa-né' },
              { mot: 'Ɛhene ?', traduction: 'Où est... ?', transcription: 'è-hé-né' },
              { mot: 'Tena', traduction: 'Assieds-toi', transcription: 'té-na' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Eau" en agni ?', choix: ['Aduane', 'Nsuo', 'Tena', 'Ɛhene'] },
              solution: { reponse: 'Nsuo' },
              explication: '"Nsuo" signifie "eau" en agni (même racine akan que le twi).' },
          ],
        },
      ],
    },
    {
      titre: 'Les Couleurs en Agni',
      description: 'Nommer les couleurs en agni.',
      ordre: 5, niveau: 'A1', pointsXp: 45,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les couleurs',
            mots: [
              { mot: 'Fita', traduction: 'Blanc', transcription: 'fi-ta' },
              { mot: 'Tuntum', traduction: 'Noir', transcription: 'tun-tum' },
              { mot: 'Kɔkɔɔ', traduction: 'Rouge', transcription: 'kɔ-kɔɔ' },
              { mot: 'Ahaban', traduction: 'Vert', transcription: 'a-ha-ban' },
              { mot: 'Akɔkɔ', traduction: 'Jaune', transcription: 'a-kɔ-kɔ' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Noir" en agni ?', choix: ['Fita', 'Tuntum', 'Kɔkɔɔ', 'Ahaban'] },
              solution: { reponse: 'Tuntum' },
              explication: '"Tuntum" signifie "noir" en agni.' },
          ],
        },
      ],
    },
  ],

  // ╔════════════════════════════════════╗
  // ║  BÉTÉ / SÉNOUFO / GOURO           ║
  // ║  GUÉRÉ / NOUCHI / YACOUBA         ║
  // ║  → 3 leçons A1 squelettes chacun  ║
  // ╚════════════════════════════════════╝

  bete: [
    {
      titre: 'Les Salutations en Bété',
      description: 'Saluer et répondre aux salutations en bété.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations bété',
            mots: [
              { mot: 'Zébéhi', traduction: 'Bienvenue / Bonjour', transcription: 'zé-bé-hi' },
              { mot: 'I kôh', traduction: 'Comment tu vas ?', transcription: 'i-koh' },
              { mot: "M'kôh bɔɔ", traduction: 'Je vais bien', transcription: 'm-koh-bɔɔ' },
              { mot: 'Déhi', traduction: 'Merci', transcription: 'dé-hi' },
              { mot: 'Kôh bɛɛ', traduction: 'Au revoir', transcription: 'koh-bèè' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Merci" en bété ?', choix: ['Zébéhi', 'Déhi', 'Kôh bɛɛ', 'Ô'] },
              solution: { reponse: 'Déhi' },
              explication: '"Déhi" signifie "merci" en bété.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Rencontre au village',
            lignes: [
              { locuteur: 'Gnalé', texte: 'Zébéhi !', traduction: 'Bonjour !' },
              { locuteur: 'Gnoto', texte: 'Zébéhi ! I kôh ?', traduction: 'Bonjour ! Comment tu vas ?' },
              { locuteur: 'Gnalé', texte: "M'kôh bɔɔ. Déhi !", traduction: 'Je vais bien. Merci !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres en Bété',
      description: 'Compter de 1 à 5 en bété.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Les chiffres bété',
            mots: [
              { mot: 'Kelen', traduction: '1 — Un', transcription: 'ké-lèn' },
              { mot: 'Flɛ', traduction: '2 — Deux', transcription: 'fleh' },
              { mot: 'Yabɔ', traduction: '3 — Trois', transcription: 'ya-bɔ' },
              { mot: 'Naŋ', traduction: '4 — Quatre', transcription: 'naŋ' },
              { mot: 'Nunu', traduction: '5 — Cinq', transcription: 'nu-nu' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Flɛ" en bété ?', choix: ['Un', 'Deux', 'Trois', 'Cinq'] },
              solution: { reponse: 'Deux' },
              explication: '"Flɛ" signifie "deux" en bété.' },
          ],
        },
      ],
    },
    {
      titre: 'La Vie Quotidienne en Bété',
      description: 'Vocabulaire de base pour la vie de tous les jours.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vie quotidienne',
            mots: [
              { mot: 'Tio', traduction: 'Eau', transcription: 'tio' },
              { mot: 'Flou', traduction: 'Nourriture', transcription: 'flou' },
              { mot: 'Dɔ sran ?', traduction: 'Où est... ?', transcription: 'dɔ-sran' },
              { mot: 'N bɛ', traduction: 'J\'ai mal', transcription: 'n-beh' },
              { mot: 'Bi wɔ !', traduction: 'Au secours !', transcription: 'bi-wɔ' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Eau" en bété ?', choix: ['Flou', 'Tio', 'Dɔ sran', 'Bi wɔ'] },
              solution: { reponse: 'Tio' },
              explication: '"Tio" signifie "eau" en bété.' },
          ],
        },
      ],
    },
  ],

  senoufo: [
    {
      titre: 'Les Salutations en Sénoufo',
      description: 'Apprendre les salutations rituelles du peuple Sénoufo.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations sénoufo',
            mots: [
              { mot: 'Nagnon', traduction: 'Bienvenue / Bonjour', transcription: 'na-gnon' },
              { mot: 'I tara wé ?', traduction: 'Tu vas bien ?', transcription: 'i-ta-ra-wé' },
              { mot: 'Tara wé', traduction: 'Je vais bien', transcription: 'ta-ra-wé' },
              { mot: 'Yalê', traduction: 'Merci', transcription: 'ya-lé' },
              { mot: 'Kà wɛ', traduction: 'Au revoir', transcription: 'kà-weh' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Merci" en sénoufo ?', choix: ['Nagnon', 'Yalê', 'Kà wɛ', 'Tara wé'] },
              solution: { reponse: 'Yalê' },
              explication: '"Yalê" est l\'expression de remerciement en sénoufo.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Salutations à Korhogo',
            lignes: [
              { locuteur: 'Nangui', texte: 'Nagnon !', traduction: 'Bonjour !' },
              { locuteur: 'Siétienin', texte: 'Nagnon ! I tara wé ?', traduction: 'Bonjour ! Tu vas bien ?' },
              { locuteur: 'Nangui', texte: 'Tara wé. Yalê !', traduction: 'Je vais bien. Merci !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres en Sénoufo',
      description: 'Compter en sénoufo.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Chiffres sénoufo',
            mots: [
              { mot: 'Kpur', traduction: '1 — Un', transcription: 'kpur' },
              { mot: 'Pi', traduction: '2 — Deux', transcription: 'pi' },
              { mot: 'Taara', traduction: '3 — Trois', transcription: 'taa-ra' },
              { mot: 'Naŋ', traduction: '4 — Quatre', transcription: 'naŋ' },
              { mot: 'Kɔɔru', traduction: '5 — Cinq', transcription: 'kɔɔ-ru' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Pi" en sénoufo ?', choix: ['Un', 'Deux', 'Trois', 'Cinq'] },
              solution: { reponse: 'Deux' },
              explication: '"Pi" signifie "deux" en sénoufo.' },
          ],
        },
      ],
    },
    {
      titre: 'La Vie Quotidienne en Sénoufo',
      description: 'Mots essentiels du quotidien en sénoufo.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vie quotidienne sénoufo',
            mots: [
              { mot: 'Ji', traduction: 'Eau', transcription: 'ji' },
              { mot: 'Dumu', traduction: 'Nourriture', transcription: 'du-mu' },
              { mot: 'Sran ka ?', traduction: 'Où est... ?', transcription: 'sran-ka' },
              { mot: 'N pɔɔ', traduction: "J'ai mal", transcription: 'n-pɔɔ' },
              { mot: 'Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dire "Au secours !" en sénoufo ?', choix: ['Ji', 'Dumu', 'Dɛmɛ !', 'N pɔɔ'] },
              solution: { reponse: 'Dɛmɛ !' },
              explication: '"Dɛmɛ" est le cri d\'appel à l\'aide en sénoufo.' },
          ],
        },
      ],
    },
  ],

  gouro: [
    {
      titre: 'Les Salutations en Gouro',
      description: 'Saluer en gouro, langue du centre-ouest ivoirien.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations gouro',
            mots: [
              { mot: 'Nouhan', traduction: 'Bienvenue / Bonjour', transcription: 'nou-han' },
              { mot: 'I yi nɔ ?', traduction: 'Tu vas bien ?', transcription: 'i-yi-nɔ' },
              { mot: 'Yi nɔ', traduction: 'Ça va bien', transcription: 'yi-nɔ' },
              { mot: 'Yalê', traduction: 'Merci', transcription: 'ya-lé' },
              { mot: 'Ôô', traduction: 'Oui', transcription: 'ôô' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Bienvenue" en gouro ?', choix: ['Yalê', 'Nouhan', 'Yi nɔ', 'Ôô'] },
              solution: { reponse: 'Nouhan' },
              explication: '"Nouhan" est le mot d\'accueil en gouro.' },
          ],
        },
      ],
    },
    {
      titre: 'Les Chiffres en Gouro',
      description: 'Compter de 1 à 5 en gouro.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Chiffres gouro',
            mots: [
              { mot: 'Kpɔ', traduction: '1 — Un', transcription: 'kpɔ' },
              { mot: 'Pɛlɛ', traduction: '2 — Deux', transcription: 'pè-lè' },
              { mot: 'Yaba', traduction: '3 — Trois', transcription: 'ya-ba' },
              { mot: 'Naŋ', traduction: '4 — Quatre', transcription: 'naŋ' },
              { mot: 'Nu', traduction: '5 — Cinq', transcription: 'nu' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Yaba" en gouro ?', choix: ['Un', 'Deux', 'Trois', 'Cinq'] },
              solution: { reponse: 'Trois' },
              explication: '"Yaba" signifie "trois" en gouro.' },
          ],
        },
      ],
    },
    {
      titre: 'La Vie Quotidienne en Gouro',
      description: 'Vocabulaire essentiel du quotidien en gouro.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vie quotidienne gouro',
            mots: [
              { mot: 'Nyi', traduction: 'Eau', transcription: 'nyi' },
              { mot: 'Manlɛ', traduction: 'Nourriture', transcription: 'man-lèh' },
              { mot: 'Dɔ sran ?', traduction: 'Où est... ?', transcription: 'dɔ-sran' },
              { mot: "N'kpli !", traduction: 'Au secours !', transcription: 'n-kpli' },
              { mot: "M'dimi", traduction: "J'ai mal", transcription: 'm-di-mi' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Eau" en gouro ?', choix: ['Manlɛ', 'Nyi', "N'kpli", "M'dimi"] },
              solution: { reponse: 'Nyi' },
              explication: '"Nyi" signifie "eau" en gouro.' },
          ],
        },
      ],
    },
  ],

  guere: [
    {
      titre: 'Les Salutations en Guéré',
      description: 'Saluer en guéré, langue du peuple Wé de l\'ouest ivoirien.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations guéré',
            mots: [
              { mot: 'Wahon', traduction: 'Bienvenue / Bonjour', transcription: 'wa-hon' },
              { mot: 'I pɔ ?', traduction: 'Comment tu vas ?', transcription: 'i-pɔ' },
              { mot: "M'pɔ bɔɔ", traduction: 'Je vais bien', transcription: 'm-pɔ-bɔɔ' },
              { mot: 'Gbagba', traduction: 'Courage / Merci', transcription: 'gba-gba' },
              { mot: 'Kôh', traduction: 'Au revoir', transcription: 'koh' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Bonjour" en guéré ?', choix: ['Gbagba', 'Kôh', 'Wahon', "M'pɔ bɔɔ"] },
              solution: { reponse: 'Wahon' },
              explication: '"Wahon" est le mot d\'accueil en guéré.' },
          ],
        },
      ],
    },
    {
      titre: 'Les Chiffres en Guéré',
      description: 'Compter de 1 à 5 en guéré.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Chiffres guéré',
            mots: [
              { mot: 'Dɔ', traduction: '1 — Un', transcription: 'dɔ' },
              { mot: 'Flɛ', traduction: '2 — Deux', transcription: 'fleh' },
              { mot: 'Gbɔ', traduction: '3 — Trois', transcription: 'gbɔ' },
              { mot: 'Nŋan', traduction: '4 — Quatre', transcription: 'nŋan' },
              { mot: 'Wlee', traduction: '5 — Cinq', transcription: 'wlee' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Trois" en guéré ?', choix: ['Dɔ', 'Flɛ', 'Gbɔ', 'Wlee'] },
              solution: { reponse: 'Gbɔ' },
              explication: '"Gbɔ" signifie "trois" en guéré.' },
          ],
        },
      ],
    },
    {
      titre: 'La Vie Quotidienne en Guéré',
      description: 'Mots du quotidien en guéré.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vie quotidienne guéré',
            mots: [
              { mot: 'Yi', traduction: 'Eau', transcription: 'yi' },
              { mot: 'Flou', traduction: 'Nourriture', transcription: 'flou' },
              { mot: 'Kua sran ?', traduction: 'Où est... ?', transcription: 'kua-sran' },
              { mot: 'N gbɔ', traduction: "J'ai mal", transcription: 'n-gbɔ' },
              { mot: 'Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Eau" en guéré ?', choix: ['Flou', 'Yi', 'N gbɔ', 'Dɛmɛ'] },
              solution: { reponse: 'Yi' },
              explication: '"Yi" signifie "eau" en guéré.' },
          ],
        },
      ],
    },
  ],

  nouchi: [
    {
      titre: 'Les Expressions Nouchi de Base',
      description: 'Les expressions incontournables du nouchi, l\'argot d\'Abidjan.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Expressions nouchi',
            mots: [
              { mot: 'Dégueu !', traduction: 'Salut ! / Quoi de neuf !', transcription: 'dé-gueu' },
              { mot: 'Tu djo ?', traduction: 'Tu vas bien ?', transcription: 'tu-djo' },
              { mot: 'Ça va sec !', traduction: 'Ça va très bien !', transcription: 'ça-va-sec' },
              { mot: 'Yako', traduction: 'Courage / Condoléances', transcription: 'ya-ko' },
              { mot: 'Frérot', traduction: 'Mon ami / Mon frère', transcription: 'fré-rot' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Yako" en nouchi ?', choix: ['Salut !', 'Tu vas bien ?', 'Courage', 'Mon ami'] },
              solution: { reponse: 'Courage' },
              explication: '"Yako" exprime la compassion, la solidarité et l\'encouragement en nouchi.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Rencontre à Adjamé',
            lignes: [
              { locuteur: 'Molo', texte: 'Dégueu frérot ! Tu djo ?', traduction: 'Salut mon ami ! Tu vas bien ?' },
              { locuteur: 'Brico', texte: "Ça va sec ! Et toi l'ambi ?", traduction: 'Je vais très bien ! Et toi mon gars ?' },
              { locuteur: 'Molo', texte: "Pas de souci ! C'est la même chose !", traduction: 'Pas de problème ! Tout va !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Le Nouchi au Marché',
      description: 'Parler argot au marché abidjanais.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Au marché en nouchi',
            mots: [
              { mot: 'Wari', traduction: 'Argent', transcription: 'wa-ri' },
              { mot: 'Alloco', traduction: 'Banane plantain frite (plat de rue)', transcription: 'a-lo-co' },
              { mot: 'Bloublou', traduction: 'Arnaquer / Tromper', transcription: 'blou-blou' },
              { mot: "C'est chaud !", traduction: "C'est compliqué / difficile", transcription: "c'est-chaud" },
              { mot: 'Sans chicotter', traduction: 'Sans hésiter / directement', transcription: 'sans-chi-co-ter' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que signifie "Wari" en nouchi ?', choix: ['Nourriture', 'Eau', 'Argent', 'Marché'] },
              solution: { reponse: 'Argent' },
              explication: '"Wari" vient du dioula et signifie "argent" — très utilisé dans tout Abidjan.' },
          ],
        },
      ],
    },
    {
      titre: 'La Vie à Abidjan en Nouchi',
      description: 'Expressions de la vie quotidienne abidjanaise.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vie abidjanaise',
            mots: [
              { mot: 'Gaou', traduction: 'Naïf / niais', transcription: 'ga-ou' },
              { mot: 'Gorogoroti', traduction: 'Personne débrouillarde', transcription: 'go-ro-go-ro-ti' },
              { mot: 'Dôh', traduction: 'Vraiment ! / C\'est vrai !', transcription: 'dôh' },
              { mot: 'Tchin-tchin', traduction: 'Petite corruption / pot-de-vin', transcription: 'tchin-tchin' },
              { mot: "C'est la même chose !", traduction: "C'est pareil / Tout va", transcription: "c'est-la-même" },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Que désigne le mot "Gaou" en nouchi ?', choix: ['Personne courageuse', 'Naïf / niais', 'Argent', 'Marché'] },
              solution: { reponse: 'Naïf / niais' },
              explication: '"Gaou" désigne quelqu\'un de naïf qui se fait facilement duper.' },
          ],
        },
      ],
    },
  ],

  yacouba: [
    {
      titre: 'Les Salutations en Yacouba (Dan)',
      description: 'Saluer en dan/yacouba, langue de la région de Man.',
      ordre: 1, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Salutations dan',
            mots: [
              { mot: 'Bii yo', traduction: 'Bonjour', transcription: 'bii-yo' },
              { mot: 'Zo kié ?', traduction: 'Tu vas bien ?', transcription: 'zo-kié' },
              { mot: 'Zo bɔɔ', traduction: 'Ça va bien', transcription: 'zo-bɔɔ' },
              { mot: 'Yèkè', traduction: 'Merci / Bien', transcription: 'yè-kè' },
              { mot: 'Kôh', traduction: 'Au revoir', transcription: 'koh' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Merci" en yacouba ?', choix: ['Bii yo', 'Zo bɔɔ', 'Yèkè', 'Kôh'] },
              solution: { reponse: 'Yèkè' },
              explication: '"Yèkè" exprime le remerciement et l\'approbation en dan/yacouba.' },
          ],
        },
        {
          type: 'DIALOGUE', ordre: 2,
          contenu: {
            titre: 'Rencontre à Man',
            lignes: [
              { locuteur: 'Droh', texte: 'Bii yo !', traduction: 'Bonjour !' },
              { locuteur: 'Zia', texte: 'Bii yo ! Zo kié ?', traduction: 'Bonjour ! Tu vas bien ?' },
              { locuteur: 'Droh', texte: 'Zo bɔɔ. Yèkè !', traduction: 'Je vais bien. Merci !' },
              { locuteur: 'Zia', texte: 'Kôh !', traduction: 'Au revoir !' },
            ],
          },
        },
      ],
    },
    {
      titre: 'Les Chiffres en Yacouba',
      description: 'Compter de 1 à 5 en dan/yacouba.',
      ordre: 2, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Chiffres dan',
            mots: [
              { mot: 'Dɔ', traduction: '1 — Un', transcription: 'dɔ' },
              { mot: 'Pɛɛ', traduction: '2 — Deux', transcription: 'pɛɛ' },
              { mot: 'Tɔ', traduction: '3 — Trois', transcription: 'tɔ' },
              { mot: 'Naŋ', traduction: '4 — Quatre', transcription: 'naŋ' },
              { mot: 'Mɛɛ', traduction: '5 — Cinq', transcription: 'mɛɛ' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Cinq" en yacouba ?', choix: ['Dɔ', 'Pɛɛ', 'Tɔ', 'Mɛɛ'] },
              solution: { reponse: 'Mɛɛ' },
              explication: '"Mɛɛ" signifie "cinq" en dan/yacouba.' },
          ],
        },
      ],
    },
    {
      titre: 'La Vie Quotidienne en Yacouba',
      description: 'Mots du quotidien en dan/yacouba.',
      ordre: 3, niveau: 'A1', pointsXp: 50,
      steps: [
        {
          type: 'VOCABULARY', ordre: 1,
          contenu: {
            titre: 'Vie quotidienne dan',
            mots: [
              { mot: 'Yi', traduction: 'Eau', transcription: 'yi' },
              { mot: 'Dumu', traduction: 'Nourriture', transcription: 'du-mu' },
              { mot: 'Sran ka ?', traduction: 'Où est... ?', transcription: 'sran-ka' },
              { mot: 'N gbɔ', traduction: "J'ai mal", transcription: 'n-gbɔ' },
              { mot: 'Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè' },
            ],
          },
          exercises: [
            { type: 'VOCABULARY', pointsXp: 10,
              donnees: { question: 'Comment dit-on "Nourriture" en yacouba ?', choix: ['Yi', 'Dumu', 'N gbɔ', 'Sran ka'] },
              solution: { reponse: 'Dumu' },
              explication: '"Dumu" signifie "nourriture" en dan/yacouba.' },
          ],
        },
      ],
    },
  ],
};

// ─── Seed principal ──────────────────────────────────────────────────────────

async function main() {
  console.log('📘 Seed des leçons A1 squelettes pour les 9 langues MVP...\n');

  let lessonsCreated = 0;
  let lessonsSkipped = 0;
  let stepsCreated   = 0;
  let exercisesCreated = 0;

  for (const [code, lecons] of Object.entries(LECONS)) {
    const lang = await prisma.language.findUnique({ where: { code } });
    if (!lang) {
      console.log(`  ⚠️  Langue introuvable : ${code}`);
      continue;
    }

    console.log(`  📘 ${lang.nom} (${lecons.length} leçons)...`);

    for (const lecon of lecons) {
      // Éviter les doublons : même titre + même langue
      const existing = await prisma.lesson.findFirst({
        where: { languageId: lang.id, titre: lecon.titre },
      });

      if (existing) {
        lessonsSkipped++;
        continue;
      }

      // Créer la leçon en dormance
      const lesson = await prisma.lesson.create({
        data: {
          languageId:  lang.id,
          titre:       lecon.titre,
          description: lecon.description,
          ordre:       lecon.ordre,
          niveau:      lecon.niveau,
          pointsXp:    lecon.pointsXp,
          isActive:    false,   // ← Dormant : activable en 1 clic CMS
        },
      });
      lessonsCreated++;

      // Créer les étapes (steps)
      for (const step of lecon.steps || []) {
        const createdStep = await prisma.lessonStep.create({
          data: {
            lessonId: lesson.id,
            type:     step.type,
            contenu:  step.contenu,
            ordre:    step.ordre,
          },
        });
        stepsCreated++;

        // Créer les exercices liés à cette étape
        for (const ex of step.exercises || []) {
          await prisma.exercise.create({
            data: {
              stepId:     createdStep.id,
              type:       ex.type,
              donnees:    ex.donnees,
              solution:   ex.solution,
              pointsXp:   ex.pointsXp,
              explication: ex.explication,
            },
          });
          exercisesCreated++;
        }
      }
    }

    console.log(`     ✅ ${lang.nom} — leçons créées`);
  }

  console.log('\n─────────────────────────────────────────────────────────');
  console.log('✅ Résumé leçons A1 squelettes :');
  console.log(`   • ${lessonsCreated} leçons créées (isActive: false)`);
  console.log(`   • ${lessonsSkipped} leçons déjà existantes (non modifiées)`);
  console.log(`   • ${stepsCreated} étapes créées`);
  console.log(`   • ${exercisesCreated} exercices créés`);
  console.log('─────────────────────────────────────────────────────────');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
