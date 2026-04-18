const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// LEÇONS V4 — 3 leçons par langue pour 6 langues :
// Bété, Sénoufo, Agni, Gouro, Guéré, Nouchi
// Thèmes : Salutations de base / La famille / Au marché
// Chaque leçon : 3 steps (VOCABULARY × 1, DIALOGUE × 1, GRAMMAR × 1)
// Chaque step : 1 exercice MULTIPLE_CHOICE
// ============================================================

const LESSONS_BETE = [
  // ===== LEÇON 1 : Salutations de base =====
  {
    titre: 'Salutations de base en Bété',
    description: 'Les premières salutations du quotidien en Bété de Gagnoa, pour se présenter et saluer du matin au soir.',
    ordre: 20, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'Mbè', traduction: 'Bonjour (matin)', transcription: 'mbè' },
            { mot: 'Wé', traduction: 'Bonjour (après-midi)', transcription: 'wé' },
            { mot: 'Gbahoun', traduction: 'Bonsoir', transcription: 'gbahoun' },
            { mot: 'Kpé', traduction: 'Merci', transcription: 'kpé' },
            { mot: 'Ié', traduction: 'Oui', transcription: 'ié' },
            { mot: 'Hên', traduction: 'Non', transcription: 'hên' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonsoir" en Bété ?', choix: ['Mbè', 'Wé', 'Gbahoun', 'Kpé'] },
          solution: { reponse: 'Gbahoun' },
          pointsXp: 10,
          explication: '"Gbahoun" est la salutation du soir en Bété de Gagnoa.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Rencontre au quartier',
          dialogue: [
            { locuteur: 'Konan', texte: 'Mbè !', traduction: 'Bonjour !' },
            { locuteur: 'Adjoua', texte: 'Mbè ! I wé ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Konan', texte: 'Ié, kpé !', traduction: 'Oui, merci !' },
            { locuteur: 'Adjoua', texte: 'Gbahoun.', traduction: 'Bonsoir.' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Merci" en Bété ?', choix: ['Ié', 'Hên', 'Kpé', 'Mbè'] },
          solution: { reponse: 'Kpé' },
          pointsXp: 10,
          explication: '"Kpé" signifie Merci en Bété. C\'est la formule de politesse incontournable.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Oui et Non en Bété',
          explication: 'En Bété, répondre poliment est essentiel. "Ié" (oui) et "Hên" (non) sont les réponses de base. On peut renforcer une réponse positive en disant "Ié, kpé !" (Oui, merci !).',
          exemples: [
            { phrase: 'Ié', traduction: 'Oui', transcription: 'ié' },
            { phrase: 'Hên', traduction: 'Non', transcription: 'hên' },
            { phrase: 'Ié, kpé !', traduction: 'Oui, merci !', transcription: 'ié, kpé' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Non" en Bété ?', choix: ['Ié', 'Kpé', 'Mbè', 'Hên'] },
          solution: { reponse: 'Hên' },
          pointsXp: 10,
          explication: '"Hên" signifie Non en Bété. La tonalité descendante est importante.',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Bété',
    description: 'Les membres de la famille en Bété de Gagnoa : les liens de parenté essentiels dans la culture Bété.',
    ordre: 21, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Nyu', traduction: 'Mère', transcription: 'nyu' },
            { mot: 'Toun', traduction: 'Père', transcription: 'toun' },
            { mot: 'Gbain', traduction: 'Frère', transcription: 'gbain' },
            { mot: 'Yari', traduction: 'Sœur', transcription: 'yari' },
            { mot: 'Bè', traduction: 'Enfant', transcription: 'bè' },
            { mot: 'Lé', traduction: 'Grand-mère', transcription: 'lé' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mère" en Bété ?', choix: ['Toun', 'Nyu', 'Lé', 'Bè'] },
          solution: { reponse: 'Nyu' },
          pointsXp: 10,
          explication: '"Nyu" désigne la Mère en Bété. La mère est au cœur de la famille Bété.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Parler de sa famille',
          dialogue: [
            { locuteur: 'Konan', texte: 'I nyu wé ?', traduction: 'Ta mère va bien ?' },
            { locuteur: 'Adjoua', texte: 'Ié, kpé. I toun wé ?', traduction: 'Oui, merci. Ton père va bien ?' },
            { locuteur: 'Konan', texte: 'Ié. Min gbain nin min yari be wé.', traduction: 'Oui. Mon frère et ma sœur vont bien.' },
            { locuteur: 'Adjoua', texte: 'Kpé ! Min lé wé sɛ.', traduction: 'Merci ! Ma grand-mère va très bien.' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Frère" en Bété ?', choix: ['Yari', 'Bè', 'Gbain', 'Nyu'] },
          solution: { reponse: 'Gbain' },
          pointsXp: 10,
          explication: '"Gbain" signifie Frère en Bété.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Bété',
          explication: 'En Bété, on exprime la possession en plaçant le pronom possessif AVANT le nom de parenté. "Min" = mon/ma, "I" = ton/ta.',
          exemples: [
            { phrase: 'Min nyu', traduction: 'Ma mère', transcription: 'min nyu' },
            { phrase: 'I toun', traduction: 'Ton père', transcription: 'i toun' },
            { phrase: 'Min bè', traduction: 'Mon enfant', transcription: 'min bè' },
            { phrase: 'I lé', traduction: 'Ta grand-mère', transcription: 'i lé' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Ma mère" en Bété ?', choix: ['I nyu', 'Nyu min', 'Min nyu', 'Min toun'] },
          solution: { reponse: 'Min nyu' },
          pointsXp: 15,
          explication: '"Min" = mon/ma se place avant le nom : "Min nyu" = Ma mère.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché en Bété',
    description: 'Vocabulaire essentiel pour acheter, vendre et négocier au marché en Bété.',
    ordre: 22, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Acheter et vendre',
          mots: [
            { mot: 'Hɔ', traduction: 'Acheter', transcription: 'hɔ' },
            { mot: 'Di', traduction: 'Vendre', transcription: 'di' },
            { mot: 'Gbɔ', traduction: 'Argent', transcription: 'gbɔ' },
            { mot: 'Gba', traduction: 'Beaucoup', transcription: 'gba' },
            { mot: 'Dé', traduction: 'Peu', transcription: 'dé' },
            { mot: 'Kou', traduction: 'Donner', transcription: 'kou' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Argent" en Bété ?', choix: ['Gba', 'Kou', 'Gbɔ', 'Dé'] },
          solution: { reponse: 'Gbɔ' },
          pointsXp: 10,
          explication: '"Gbɔ" signifie Argent en Bété. Mot indispensable au marché !',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Négocier au marché de Gagnoa',
          dialogue: [
            { locuteur: 'Konan', texte: 'Wé ! I di gbɔ gba !', traduction: 'Bonjour ! Tu vends trop cher !' },
            { locuteur: 'Adjoua', texte: 'Hên, gbɔ dé !', traduction: 'Non, c\'est peu !' },
            { locuteur: 'Konan', texte: 'Kou min dé !', traduction: 'Donne-moi un peu !' },
            { locuteur: 'Adjoua', texte: 'Ié, kpé !', traduction: 'D\'accord, merci !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Beaucoup" en Bété ?', choix: ['Dé', 'Kou', 'Hɔ', 'Gba'] },
          solution: { reponse: 'Gba' },
          pointsXp: 10,
          explication: '"Gba" signifie Beaucoup en Bété. "Di gbɔ gba" = vendre trop cher.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Exprimer la quantité en Bété',
          explication: 'En Bété, "Gba" (beaucoup) et "Dé" (peu) se placent après le nom ou le verbe pour indiquer la quantité. C\'est une structure simple et directe.',
          exemples: [
            { phrase: 'Gbɔ gba', traduction: 'Beaucoup d\'argent', transcription: 'gbɔ gba' },
            { phrase: 'Gbɔ dé', traduction: 'Peu d\'argent', transcription: 'gbɔ dé' },
            { phrase: 'Kou min gba', traduction: 'Donne-moi beaucoup', transcription: 'kou min gba' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Que signifie "Gbɔ dé" en Bété ?', choix: ['Beaucoup d\'argent', 'Pas d\'argent', 'Peu d\'argent', 'Donner l\'argent'] },
          solution: { reponse: 'Peu d\'argent' },
          pointsXp: 10,
          explication: '"Gbɔ" = argent, "Dé" = peu. "Gbɔ dé" = Peu d\'argent.',
        },
      },
    ],
  },
];

// ============================================================

const LESSONS_SENOUFO = [
  // ===== LEÇON 1 : Salutations de base =====
  {
    titre: 'Salutations de base en Sénoufo',
    description: 'Les salutations fondamentales du Sénoufo du nord de la Côte d\'Ivoire.',
    ordre: 20, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'N\'goloma', traduction: 'Bonjour', transcription: 'n\'goloma' },
            { mot: 'N\'go', traduction: 'Bonsoir', transcription: 'n\'go' },
            { mot: 'Ke', traduction: 'Merci', transcription: 'ke' },
            { mot: 'Wi', traduction: 'Oui', transcription: 'wi' },
            { mot: 'Ayi', traduction: 'Non', transcription: 'ayi' },
            { mot: 'Kpèlè', traduction: 'Au revoir', transcription: 'kpèlè' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonjour" en Sénoufo ?', choix: ['N\'go', 'Ke', 'N\'goloma', 'Kpèlè'] },
          solution: { reponse: 'N\'goloma' },
          pointsXp: 10,
          explication: '"N\'goloma" est la salutation principale du jour en Sénoufo.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Salutation au village',
          dialogue: [
            { locuteur: 'Soro', texte: 'N\'goloma !', traduction: 'Bonjour !' },
            { locuteur: 'Coulibaly', texte: 'N\'goloma ! I kɛnɛ ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Soro', texte: 'Wi, ke !', traduction: 'Oui, merci !' },
            { locuteur: 'Coulibaly', texte: 'Kpèlè !', traduction: 'Au revoir !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Au revoir" en Sénoufo ?', choix: ['Ke', 'N\'go', 'Ayi', 'Kpèlè'] },
          solution: { reponse: 'Kpèlè' },
          pointsXp: 10,
          explication: '"Kpèlè" signifie Au revoir en Sénoufo.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Affirmer et nier en Sénoufo',
          explication: 'En Sénoufo, "Wi" (oui) et "Ayi" (non) sont les réponses de base. Pour exprimer sa gratitude, on ajoute "Ke" (merci) : "Wi, ke !" = Oui, merci !',
          exemples: [
            { phrase: 'Wi', traduction: 'Oui', transcription: 'wi' },
            { phrase: 'Ayi', traduction: 'Non', transcription: 'ayi' },
            { phrase: 'Wi, ke !', traduction: 'Oui, merci !', transcription: 'wi, ke' },
            { phrase: 'Ayi, ke', traduction: 'Non, merci', transcription: 'ayi, ke' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Non" en Sénoufo ?', choix: ['Wi', 'Ke', 'Kpèlè', 'Ayi'] },
          solution: { reponse: 'Ayi' },
          pointsXp: 10,
          explication: '"Ayi" signifie Non en Sénoufo.',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Sénoufo',
    description: 'Les membres de la famille dans la culture Sénoufo du nord de la Côte d\'Ivoire.',
    ordre: 21, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Mɛ', traduction: 'Mère', transcription: 'mɛ' },
            { mot: 'Ba', traduction: 'Père', transcription: 'ba' },
            { mot: 'Dogo', traduction: 'Frère aîné', transcription: 'dogo' },
            { mot: 'Wolo', traduction: 'Sœur', transcription: 'wolo' },
            { mot: 'Den', traduction: 'Enfant', transcription: 'den' },
            { mot: 'Kɔrɔ', traduction: 'Grand-père', transcription: 'kɔrɔ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Père" en Sénoufo ?', choix: ['Mɛ', 'Den', 'Kɔrɔ', 'Ba'] },
          solution: { reponse: 'Ba' },
          pointsXp: 10,
          explication: '"Ba" désigne le Père en Sénoufo.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Présenter sa famille',
          dialogue: [
            { locuteur: 'Soro', texte: 'I mɛ kɛnɛ ?', traduction: 'Ta mère va bien ?' },
            { locuteur: 'Coulibaly', texte: 'Wi, ke. I ba ?', traduction: 'Oui, merci. Ton père ?' },
            { locuteur: 'Soro', texte: 'Wi. Min dogo nin min wolo be wé.', traduction: 'Oui. Mon grand frère et ma sœur vont bien.' },
            { locuteur: 'Coulibaly', texte: 'Min kɔrɔ wé sɛ !', traduction: 'Mon grand-père va très bien !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Enfant" en Sénoufo ?', choix: ['Dogo', 'Wolo', 'Den', 'Kɔrɔ'] },
          solution: { reponse: 'Den' },
          pointsXp: 10,
          explication: '"Den" signifie Enfant en Sénoufo.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Sénoufo',
          explication: 'En Sénoufo, le possessif se place AVANT le nom de parenté. "Min" = mon/ma, "I" = ton/ta.',
          exemples: [
            { phrase: 'Min mɛ', traduction: 'Ma mère', transcription: 'min mɛ' },
            { phrase: 'I ba', traduction: 'Ton père', transcription: 'i ba' },
            { phrase: 'Min den', traduction: 'Mon enfant', transcription: 'min den' },
            { phrase: 'I kɔrɔ', traduction: 'Ton grand-père', transcription: 'i kɔrɔ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mon enfant" en Sénoufo ?', choix: ['I den', 'Den min', 'Min mɛ', 'Min den'] },
          solution: { reponse: 'Min den' },
          pointsXp: 15,
          explication: '"Min" = mon/ma se place avant le nom : "Min den" = Mon enfant.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché en Sénoufo',
    description: 'Le vocabulaire du commerce et de la négociation au marché en Sénoufo.',
    ordre: 22, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Commerce et argent',
          mots: [
            { mot: 'Segi', traduction: 'Acheter', transcription: 'segi' },
            { mot: 'Tɔn', traduction: 'Vendre', transcription: 'tɔn' },
            { mot: 'Fɛn', traduction: 'Argent', transcription: 'fɛn' },
            { mot: 'Caman', traduction: 'Beaucoup', transcription: 'caman' },
            { mot: 'Do', traduction: 'Peu', transcription: 'do' },
            { mot: 'Ba', traduction: 'Donner', transcription: 'ba' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Acheter" en Sénoufo ?', choix: ['Tɔn', 'Fɛn', 'Ba', 'Segi'] },
          solution: { reponse: 'Segi' },
          pointsXp: 10,
          explication: '"Segi" signifie Acheter en Sénoufo.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Acheter au marché',
          dialogue: [
            { locuteur: 'Soro', texte: 'N\'goloma ! Fɛn caman !', traduction: 'Bonjour ! C\'est trop cher !' },
            { locuteur: 'Coulibaly', texte: 'Ayi, fɛn do !', traduction: 'Non, c\'est peu !' },
            { locuteur: 'Soro', texte: 'Ba min do !', traduction: 'Donne-moi un peu !' },
            { locuteur: 'Coulibaly', texte: 'Wi, ke !', traduction: 'D\'accord, merci !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Beaucoup" en Sénoufo ?', choix: ['Do', 'Ba', 'Segi', 'Caman'] },
          solution: { reponse: 'Caman' },
          pointsXp: 10,
          explication: '"Caman" signifie Beaucoup en Sénoufo. "Fɛn caman" = beaucoup d\'argent (trop cher).',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Exprimer la quantité en Sénoufo',
          explication: 'En Sénoufo, les quantificateurs "Caman" (beaucoup) et "Do" (peu) se placent après le nom pour qualifier la quantité. Ils sont très utiles pour négocier au marché.',
          exemples: [
            { phrase: 'Fɛn caman', traduction: 'Beaucoup d\'argent / C\'est cher', transcription: 'fɛn caman' },
            { phrase: 'Fɛn do', traduction: 'Peu d\'argent / C\'est pas cher', transcription: 'fɛn do' },
            { phrase: 'Ba min caman', traduction: 'Donne-moi beaucoup', transcription: 'ba min caman' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Vendre" en Sénoufo ?', choix: ['Segi', 'Ba', 'Fɛn', 'Tɔn'] },
          solution: { reponse: 'Tɔn' },
          pointsXp: 10,
          explication: '"Tɔn" signifie Vendre en Sénoufo. Le commerçant "tɔn" sa marchandise.',
        },
      },
    ],
  },
];

// ============================================================

const LESSONS_AGNI = [
  // ===== LEÇON 1 : Salutations de base =====
  {
    titre: 'Salutations de base en Agni',
    description: 'Les salutations essentielles de l\'Agni, langue Akan de l\'est de la Côte d\'Ivoire.',
    ordre: 20, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'Morow', traduction: 'Bonjour', transcription: 'morow' },
            { mot: 'Assobi', traduction: 'Bonsoir', transcription: 'assobi' },
            { mot: 'Meda', traduction: 'Merci', transcription: 'meda' },
            { mot: 'Ɛɛ', traduction: 'Oui', transcription: 'ɛɛ' },
            { mot: 'Daabi', traduction: 'Non', transcription: 'daabi' },
            { mot: 'Yiwa', traduction: 'Au revoir', transcription: 'yiwa' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Merci" en Agni ?', choix: ['Morow', 'Daabi', 'Yiwa', 'Meda'] },
          solution: { reponse: 'Meda' },
          pointsXp: 10,
          explication: '"Meda" signifie Merci en Agni. Langue proche du Baoulé et de l\'Akan.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Se saluer en Agni',
          dialogue: [
            { locuteur: 'Akissi', texte: 'Morow !', traduction: 'Bonjour !' },
            { locuteur: 'Koffi', texte: 'Morow ! Wo ho te sɛn ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Akissi', texte: 'Ɛɛ, meda !', traduction: 'Oui, merci !' },
            { locuteur: 'Koffi', texte: 'Yiwa !', traduction: 'Au revoir !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonsoir" en Agni ?', choix: ['Morow', 'Meda', 'Daabi', 'Assobi'] },
          solution: { reponse: 'Assobi' },
          pointsXp: 10,
          explication: '"Assobi" est la salutation du soir en Agni.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Oui et Non en Agni',
          explication: 'En Agni, "Ɛɛ" (oui) et "Daabi" (non) sont les réponses fondamentales. L\'Agni partage de nombreux traits avec le Baoulé, toutes deux langues de la famille Akan.',
          exemples: [
            { phrase: 'Ɛɛ', traduction: 'Oui', transcription: 'ɛɛ' },
            { phrase: 'Daabi', traduction: 'Non', transcription: 'daabi' },
            { phrase: 'Ɛɛ, meda !', traduction: 'Oui, merci !', transcription: 'ɛɛ, meda' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Non" en Agni ?', choix: ['Ɛɛ', 'Meda', 'Daabi', 'Yiwa'] },
          solution: { reponse: 'Daabi' },
          pointsXp: 10,
          explication: '"Daabi" signifie Non en Agni. Terme partagé avec plusieurs langues Akan.',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Agni',
    description: 'Les membres de la famille en Agni, langue Akan de l\'est ivoirien.',
    ordre: 21, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Nana', traduction: 'Mère', transcription: 'nana' },
            { mot: 'Oba', traduction: 'Père', transcription: 'oba' },
            { mot: 'Onua', traduction: 'Frère', transcription: 'onua' },
            { mot: 'Onua baa', traduction: 'Sœur', transcription: 'onua baa' },
            { mot: 'Ba', traduction: 'Enfant', transcription: 'ba' },
            { mot: 'Nana panyin', traduction: 'Grand-mère', transcription: 'nana panyin' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Père" en Agni ?', choix: ['Nana', 'Ba', 'Onua', 'Oba'] },
          solution: { reponse: 'Oba' },
          pointsXp: 10,
          explication: '"Oba" désigne le Père en Agni.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'La famille Agni',
          dialogue: [
            { locuteur: 'Akissi', texte: 'Wo nana ho te sɛn ?', traduction: 'Ta mère va bien ?' },
            { locuteur: 'Koffi', texte: 'Ɛɛ, meda. Wo oba ?', traduction: 'Oui, merci. Ton père ?' },
            { locuteur: 'Akissi', texte: 'Ɛɛ. Min onua nin min onua baa be ho.', traduction: 'Oui. Mon frère et ma sœur vont bien.' },
            { locuteur: 'Koffi', texte: 'Min nana panyin wé sɛ !', traduction: 'Ma grand-mère va très bien !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Enfant" en Agni ?', choix: ['Onua', 'Oba', 'Nana', 'Ba'] },
          solution: { reponse: 'Ba' },
          pointsXp: 10,
          explication: '"Ba" signifie Enfant en Agni, comme en Baoulé.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Agni',
          explication: 'En Agni, comme dans les autres langues Akan, le possessif "Min" (mon/ma) se place avant le nom pour exprimer l\'appartenance.',
          exemples: [
            { phrase: 'Min nana', traduction: 'Ma mère', transcription: 'min nana' },
            { phrase: 'Min oba', traduction: 'Mon père', transcription: 'min oba' },
            { phrase: 'Min ba', traduction: 'Mon enfant', transcription: 'min ba' },
            { phrase: 'Min onua', traduction: 'Mon frère', transcription: 'min onua' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Ma mère" en Agni ?', choix: ['Nana min', 'I nana', 'Min oba', 'Min nana'] },
          solution: { reponse: 'Min nana' },
          pointsXp: 15,
          explication: '"Min nana" = Ma mère. "Min" (mon/ma) précède toujours le nom en Agni.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché en Agni',
    description: 'Le vocabulaire du commerce en Agni pour acheter, vendre et négocier au marché.',
    ordre: 22, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Acheter et vendre',
          mots: [
            { mot: 'Tɔ', traduction: 'Acheter', transcription: 'tɔ' },
            { mot: 'Dɔ', traduction: 'Vendre', transcription: 'dɔ' },
            { mot: 'Sika', traduction: 'Argent', transcription: 'sika' },
            { mot: 'Pii', traduction: 'Beaucoup', transcription: 'pii' },
            { mot: 'Kakra', traduction: 'Peu', transcription: 'kakra' },
            { mot: 'Ma', traduction: 'Donner', transcription: 'ma' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Argent" en Agni ?', choix: ['Pii', 'Ma', 'Kakra', 'Sika'] },
          solution: { reponse: 'Sika' },
          pointsXp: 10,
          explication: '"Sika" signifie Argent en Agni, terme partagé avec le Baoulé.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Négocier au marché Agni',
          dialogue: [
            { locuteur: 'Akissi', texte: 'Morow ! Sika pii !', traduction: 'Bonjour ! C\'est trop cher !' },
            { locuteur: 'Koffi', texte: 'Daabi, sika kakra !', traduction: 'Non, c\'est peu !' },
            { locuteur: 'Akissi', texte: 'Ma min kakra !', traduction: 'Donne-moi un peu moins !' },
            { locuteur: 'Koffi', texte: 'Ɛɛ ! Meda !', traduction: 'D\'accord ! Merci !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Peu" en Agni ?', choix: ['Sika', 'Pii', 'Ma', 'Kakra'] },
          solution: { reponse: 'Kakra' },
          pointsXp: 10,
          explication: '"Kakra" signifie Peu en Agni. "Sika kakra" = peu d\'argent.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Quantité et négociation en Agni',
          explication: 'Les quantificateurs "Pii" (beaucoup) et "Kakra" (peu) sont essentiels pour négocier au marché. Ils se placent après le nom qu\'ils qualifient.',
          exemples: [
            { phrase: 'Sika pii', traduction: 'Beaucoup d\'argent / C\'est cher', transcription: 'sika pii' },
            { phrase: 'Sika kakra', traduction: 'Peu d\'argent / C\'est pas cher', transcription: 'sika kakra' },
            { phrase: 'Ma min pii', traduction: 'Donne-moi beaucoup', transcription: 'ma min pii' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Vendre" en Agni ?', choix: ['Tɔ', 'Sika', 'Ma', 'Dɔ'] },
          solution: { reponse: 'Dɔ' },
          pointsXp: 10,
          explication: '"Dɔ" signifie Vendre en Agni.',
        },
      },
    ],
  },
];

// ============================================================

const LESSONS_GOURO = [
  // ===== LEÇON 1 : Salutations de base =====
  {
    titre: 'Salutations de base en Gouro',
    description: 'Les salutations du Gouro, langue du centre de la Côte d\'Ivoire, région de Zuénoula et Daloa.',
    ordre: 20, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'Wɔ', traduction: 'Bonjour', transcription: 'wɔ' },
            { mot: 'Zaou', traduction: 'Bonsoir', transcription: 'zaou' },
            { mot: 'Kè', traduction: 'Merci', transcription: 'kè' },
            { mot: 'Ɛɛ', traduction: 'Oui', transcription: 'ɛɛ' },
            { mot: 'Ayi', traduction: 'Non', transcription: 'ayi' },
            { mot: 'Lo', traduction: 'Au revoir', transcription: 'lo' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonjour" en Gouro ?', choix: ['Zaou', 'Kè', 'Lo', 'Wɔ'] },
          solution: { reponse: 'Wɔ' },
          pointsXp: 10,
          explication: '"Wɔ" est la salutation du jour en Gouro.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Salutation Gouro',
          dialogue: [
            { locuteur: 'Gnahore', texte: 'Wɔ !', traduction: 'Bonjour !' },
            { locuteur: 'Bi', texte: 'Wɔ ! I kɛ ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Gnahore', texte: 'Ɛɛ, kè !', traduction: 'Oui, merci !' },
            { locuteur: 'Bi', texte: 'Lo !', traduction: 'Au revoir !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Au revoir" en Gouro ?', choix: ['Wɔ', 'Kè', 'Zaou', 'Lo'] },
          solution: { reponse: 'Lo' },
          pointsXp: 10,
          explication: '"Lo" signifie Au revoir en Gouro.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Saluer selon le moment en Gouro',
          explication: 'En Gouro, la salutation varie selon le moment de la journée. "Wɔ" est utilisé le matin et l\'après-midi, tandis que "Zaou" est réservé au soir. "Kè" (merci) conclut souvent un échange de politesse.',
          exemples: [
            { phrase: 'Wɔ', traduction: 'Bonjour (journée)', transcription: 'wɔ' },
            { phrase: 'Zaou', traduction: 'Bonsoir', transcription: 'zaou' },
            { phrase: 'Kè', traduction: 'Merci', transcription: 'kè' },
            { phrase: 'Lo', traduction: 'Au revoir', transcription: 'lo' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonsoir" en Gouro ?', choix: ['Wɔ', 'Lo', 'Kè', 'Zaou'] },
          solution: { reponse: 'Zaou' },
          pointsXp: 10,
          explication: '"Zaou" est la salutation du soir en Gouro.',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Gouro',
    description: 'Les membres de la famille dans la culture Gouro du centre ivoirien.',
    ordre: 21, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Nyo', traduction: 'Mère', transcription: 'nyo' },
            { mot: 'To', traduction: 'Père', transcription: 'to' },
            { mot: 'Kla', traduction: 'Frère', transcription: 'kla' },
            { mot: 'Na', traduction: 'Sœur', transcription: 'na' },
            { mot: 'Bi', traduction: 'Enfant', transcription: 'bi' },
            { mot: 'Nyo kɔrɔ', traduction: 'Grand-mère', transcription: 'nyo kɔrɔ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mère" en Gouro ?', choix: ['To', 'Kla', 'Bi', 'Nyo'] },
          solution: { reponse: 'Nyo' },
          pointsXp: 10,
          explication: '"Nyo" désigne la Mère en Gouro.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Présenter sa famille',
          dialogue: [
            { locuteur: 'Gnahore', texte: 'I nyo kɛ ?', traduction: 'Ta mère va bien ?' },
            { locuteur: 'Bi', texte: 'Ɛɛ, kè. I to ?', traduction: 'Oui, merci. Ton père ?' },
            { locuteur: 'Gnahore', texte: 'Ɛɛ. Min kla nin min na be wé.', traduction: 'Oui. Mon frère et ma sœur vont bien.' },
            { locuteur: 'Bi', texte: 'Min nyo kɔrɔ wé sɛ !', traduction: 'Ma grand-mère va très bien !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Sœur" en Gouro ?', choix: ['Kla', 'Bi', 'To', 'Na'] },
          solution: { reponse: 'Na' },
          pointsXp: 10,
          explication: '"Na" signifie Sœur en Gouro.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Gouro',
          explication: 'En Gouro, le possessif "Min" (mon/ma) se place avant le nom. Pour la grand-mère, on utilise "Nyo kɔrɔ" (littéralement : mère ancienne), ce qui montre comment le Gouro forme des mots composés.',
          exemples: [
            { phrase: 'Min nyo', traduction: 'Ma mère', transcription: 'min nyo' },
            { phrase: 'Min to', traduction: 'Mon père', transcription: 'min to' },
            { phrase: 'Min bi', traduction: 'Mon enfant', transcription: 'min bi' },
            { phrase: 'Min nyo kɔrɔ', traduction: 'Ma grand-mère', transcription: 'min nyo kɔrɔ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mon père" en Gouro ?', choix: ['Min nyo', 'I to', 'Min bi', 'Min to'] },
          solution: { reponse: 'Min to' },
          pointsXp: 15,
          explication: '"Min to" = Mon père. "To" = père, "Min" = mon.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché en Gouro',
    description: 'Vocabulaire du marché en Gouro pour acheter, vendre et négocier dans la région de Zuénoula.',
    ordre: 22, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Commerce au marché',
          mots: [
            { mot: 'Yɛ', traduction: 'Acheter', transcription: 'yɛ' },
            { mot: 'Zi', traduction: 'Vendre', transcription: 'zi' },
            { mot: 'Wari', traduction: 'Argent', transcription: 'wari' },
            { mot: 'Ka', traduction: 'Beaucoup', transcription: 'ka' },
            { mot: 'Di', traduction: 'Peu', transcription: 'di' },
            { mot: 'Bon', traduction: 'Donner', transcription: 'bon' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Argent" en Gouro ?', choix: ['Ka', 'Bon', 'Di', 'Wari'] },
          solution: { reponse: 'Wari' },
          pointsXp: 10,
          explication: '"Wari" signifie Argent en Gouro. Terme répandu dans plusieurs langues ivoiriennes.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Marchander en Gouro',
          dialogue: [
            { locuteur: 'Gnahore', texte: 'Wɔ ! Wari ka !', traduction: 'Bonjour ! C\'est trop cher !' },
            { locuteur: 'Bi', texte: 'Ayi, wari di !', traduction: 'Non, c\'est peu !' },
            { locuteur: 'Gnahore', texte: 'Bon min di !', traduction: 'Donne-moi pour moins !' },
            { locuteur: 'Bi', texte: 'Ɛɛ, kè !', traduction: 'D\'accord, merci !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Beaucoup" en Gouro ?', choix: ['Di', 'Bon', 'Wari', 'Ka'] },
          solution: { reponse: 'Ka' },
          pointsXp: 10,
          explication: '"Ka" signifie Beaucoup en Gouro. "Wari ka" = trop d\'argent (trop cher).',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Négocier au marché en Gouro',
          explication: 'La négociation est une pratique sociale importante en Gouro. "Ka" (beaucoup) et "Di" (peu) permettent d\'exprimer si un prix est élevé ou raisonnable. "Bon" (donner) est le verbe central des échanges commerciaux.',
          exemples: [
            { phrase: 'Wari ka', traduction: 'Beaucoup d\'argent / Trop cher', transcription: 'wari ka' },
            { phrase: 'Wari di', traduction: 'Peu d\'argent / Pas cher', transcription: 'wari di' },
            { phrase: 'Bon min di', traduction: 'Donne-moi pour moins', transcription: 'bon min di' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Acheter" en Gouro ?', choix: ['Zi', 'Bon', 'Wari', 'Yɛ'] },
          solution: { reponse: 'Yɛ' },
          pointsXp: 10,
          explication: '"Yɛ" signifie Acheter en Gouro.',
        },
      },
    ],
  },
];

// ============================================================

const LESSONS_GUERE = [
  // ===== LEÇON 1 : Salutations de base =====
  {
    titre: 'Salutations de base en Guéré',
    description: 'Les salutations fondamentales du Guéré, langue de l\'ouest ivoirien, région de Man et Guiglo.',
    ordre: 20, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'Ku', traduction: 'Bonjour', transcription: 'ku' },
            { mot: 'Gbè', traduction: 'Bonsoir', transcription: 'gbè' },
            { mot: 'Mɛ', traduction: 'Merci', transcription: 'mɛ' },
            { mot: 'Ɛɛ', traduction: 'Oui', transcription: 'ɛɛ' },
            { mot: 'Ayi', traduction: 'Non', transcription: 'ayi' },
            { mot: 'Gba', traduction: 'Au revoir', transcription: 'gba' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonjour" en Guéré ?', choix: ['Gbè', 'Mɛ', 'Gba', 'Ku'] },
          solution: { reponse: 'Ku' },
          pointsXp: 10,
          explication: '"Ku" est la salutation du jour en Guéré, langue de l\'ouest ivoirien.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Salutation Guéré',
          dialogue: [
            { locuteur: 'Gbe', texte: 'Ku !', traduction: 'Bonjour !' },
            { locuteur: 'Tia', texte: 'Ku ! I du ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Gbe', texte: 'Ɛɛ, mɛ !', traduction: 'Oui, merci !' },
            { locuteur: 'Tia', texte: 'Gba !', traduction: 'Au revoir !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Merci" en Guéré ?', choix: ['Ku', 'Gba', 'Ayi', 'Mɛ'] },
          solution: { reponse: 'Mɛ' },
          pointsXp: 10,
          explication: '"Mɛ" signifie Merci en Guéré.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les salutations selon l\'heure en Guéré',
          explication: 'Le Guéré distingue clairement les moments de la journée dans ses salutations. "Ku" (bonjour) s\'utilise le matin et l\'après-midi. "Gbè" (bonsoir) est réservé au soir. "Gba" (au revoir) conclut toute rencontre.',
          exemples: [
            { phrase: 'Ku', traduction: 'Bonjour', transcription: 'ku' },
            { phrase: 'Gbè', traduction: 'Bonsoir', transcription: 'gbè' },
            { phrase: 'Gba', traduction: 'Au revoir', transcription: 'gba' },
            { phrase: 'Mɛ', traduction: 'Merci', transcription: 'mɛ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonsoir" en Guéré ?', choix: ['Ku', 'Mɛ', 'Gba', 'Gbè'] },
          solution: { reponse: 'Gbè' },
          pointsXp: 10,
          explication: '"Gbè" est la salutation du soir en Guéré.',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Guéré',
    description: 'Les membres de la famille dans la culture Guéré, peuple de l\'ouest de la Côte d\'Ivoire.',
    ordre: 21, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Nyo', traduction: 'Mère', transcription: 'nyo' },
            { mot: 'To', traduction: 'Père', transcription: 'to' },
            { mot: 'Blo', traduction: 'Frère', transcription: 'blo' },
            { mot: 'Yé', traduction: 'Sœur', transcription: 'yé' },
            { mot: 'Du', traduction: 'Enfant', transcription: 'du' },
            { mot: 'Nyo tèè', traduction: 'Grand-mère', transcription: 'nyo tèè' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Père" en Guéré ?', choix: ['Nyo', 'Blo', 'Du', 'To'] },
          solution: { reponse: 'To' },
          pointsXp: 10,
          explication: '"To" désigne le Père en Guéré.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'La famille Guéré',
          dialogue: [
            { locuteur: 'Gbe', texte: 'I nyo du ?', traduction: 'Ta mère va bien ?' },
            { locuteur: 'Tia', texte: 'Ɛɛ, mɛ. I to ?', traduction: 'Oui, merci. Ton père ?' },
            { locuteur: 'Gbe', texte: 'Ɛɛ. Min blo nin min yé be wé.', traduction: 'Oui. Mon frère et ma sœur vont bien.' },
            { locuteur: 'Tia', texte: 'Min nyo tèè wé sɛ !', traduction: 'Ma grand-mère va très bien !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Enfant" en Guéré ?', choix: ['Blo', 'To', 'Yé', 'Du'] },
          solution: { reponse: 'Du' },
          pointsXp: 10,
          explication: '"Du" signifie Enfant en Guéré.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Guéré',
          explication: 'En Guéré, le possessif "Min" (mon/ma) se place avant le nom de parenté. "Nyo tèè" (grand-mère) est un mot composé : "Nyo" (mère) + "Tèè" (ancienne/vieille).',
          exemples: [
            { phrase: 'Min nyo', traduction: 'Ma mère', transcription: 'min nyo' },
            { phrase: 'Min to', traduction: 'Mon père', transcription: 'min to' },
            { phrase: 'Min du', traduction: 'Mon enfant', transcription: 'min du' },
            { phrase: 'Min nyo tèè', traduction: 'Ma grand-mère', transcription: 'min nyo tèè' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Ma mère" en Guéré ?', choix: ['Min to', 'I nyo', 'Nyo min', 'Min nyo'] },
          solution: { reponse: 'Min nyo' },
          pointsXp: 15,
          explication: '"Min nyo" = Ma mère. "Min" = mon/ma se place toujours avant le nom.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché en Guéré',
    description: 'Le vocabulaire du commerce en Guéré pour acheter, vendre et négocier dans l\'ouest ivoirien.',
    ordre: 22, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Acheter et vendre',
          mots: [
            { mot: 'Lɔ', traduction: 'Acheter', transcription: 'lɔ' },
            { mot: 'Zɔ', traduction: 'Vendre', transcription: 'zɔ' },
            { mot: 'Wari', traduction: 'Argent', transcription: 'wari' },
            { mot: 'Tɛ', traduction: 'Beaucoup', transcription: 'tɛ' },
            { mot: 'La', traduction: 'Peu', transcription: 'la' },
            { mot: 'Ni', traduction: 'Donner', transcription: 'ni' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Acheter" en Guéré ?', choix: ['Zɔ', 'Ni', 'Wari', 'Lɔ'] },
          solution: { reponse: 'Lɔ' },
          pointsXp: 10,
          explication: '"Lɔ" signifie Acheter en Guéré.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Marchander en Guéré',
          dialogue: [
            { locuteur: 'Gbe', texte: 'Ku ! Wari tɛ !', traduction: 'Bonjour ! C\'est trop cher !' },
            { locuteur: 'Tia', texte: 'Ayi, wari la !', traduction: 'Non, c\'est peu !' },
            { locuteur: 'Gbe', texte: 'Ni min la !', traduction: 'Donne-moi pour moins !' },
            { locuteur: 'Tia', texte: 'Ɛɛ, mɛ !', traduction: 'D\'accord, merci !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Beaucoup" en Guéré ?', choix: ['La', 'Ni', 'Wari', 'Tɛ'] },
          solution: { reponse: 'Tɛ' },
          pointsXp: 10,
          explication: '"Tɛ" signifie Beaucoup en Guéré. "Wari tɛ" = beaucoup d\'argent (trop cher).',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Commerce et quantité en Guéré',
          explication: 'En Guéré, "Tɛ" (beaucoup) et "La" (peu) qualifient la quantité d\'argent lors des échanges au marché. "Ni" (donner) est le verbe central du commerce.',
          exemples: [
            { phrase: 'Wari tɛ', traduction: 'Beaucoup d\'argent / C\'est cher', transcription: 'wari tɛ' },
            { phrase: 'Wari la', traduction: 'Peu d\'argent / C\'est pas cher', transcription: 'wari la' },
            { phrase: 'Ni min la', traduction: 'Donne-moi pour moins', transcription: 'ni min la' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Vendre" en Guéré ?', choix: ['Lɔ', 'Wari', 'Ni', 'Zɔ'] },
          solution: { reponse: 'Zɔ' },
          pointsXp: 10,
          explication: '"Zɔ" signifie Vendre en Guéré.',
        },
      },
    ],
  },
];

// ============================================================

const LESSONS_NOUCHI = [
  // ===== LEÇON 1 : Salutations de base =====
  {
    titre: 'Salutations de base en Nouchi',
    description: 'Le Nouchi, argot ivoirien né à Abidjan, mélange de français, dioula et langues locales. Apprenez à saluer comme les jeunes Ivoiriens !',
    ordre: 20, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les expressions de salutation',
          mots: [
            { mot: 'Wesh', traduction: 'Salut / Ça va ?', transcription: 'wesh' },
            { mot: 'Ça gaze', traduction: 'Ça va bien', transcription: 'ça gaze' },
            { mot: 'On est ensemble', traduction: 'On est d\'accord / On est solidaires', transcription: 'on est ensemble' },
            { mot: 'Walaï', traduction: 'Vraiment / Je te jure', transcription: 'walaï' },
            { mot: 'Dêh', traduction: 'Voilà / Exactement / C\'est ça', transcription: 'dêh' },
            { mot: 'Gbôkô', traduction: 'Partir / S\'en aller', transcription: 'gbôkô' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Ça va bien" en Nouchi ?', choix: ['Wesh', 'Gbôkô', 'Walaï', 'Ça gaze'] },
          solution: { reponse: 'Ça gaze' },
          pointsXp: 10,
          explication: '"Ça gaze" signifie que tout va bien en Nouchi. La réponse typique à "Wesh ?".',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Conversation de rue à Abidjan',
          dialogue: [
            { locuteur: 'Moussa', texte: 'Wesh frère !', traduction: 'Salut mec !' },
            { locuteur: 'Kader', texte: 'Ça gaze ! On est ensemble !', traduction: 'Ça va bien ! On est solidaires !' },
            { locuteur: 'Moussa', texte: 'Walaï, dêh !', traduction: 'Vraiment, c\'est ça !' },
            { locuteur: 'Kader', texte: 'Mon gars, je dois gbôkô. Hein !', traduction: 'Mon ami, je dois partir. Salut !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Que signifie "Gbôkô" en Nouchi ?', choix: ['Rester', 'Manger', 'Partir', 'Danser'] },
          solution: { reponse: 'Partir' },
          pointsXp: 10,
          explication: '"Gbôkô" signifie Partir en Nouchi. "Je dois gbôkô" = Je dois partir.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Le Nouchi : un argot vivant',
          explication: 'Le Nouchi n\'est pas une langue traditionnelle — c\'est un argot créé par les jeunes d\'Abidjan depuis les années 1980. Il mélange le français avec des emprunts au Dioula, Baoulé, anglais et d\'autres langues. Il évolue constamment et représente l\'identité urbaine ivoirienne.',
          exemples: [
            { phrase: 'Wesh !', traduction: 'Salut ! (de l\'arabe "wesh" via les cités françaises)', transcription: 'wesh' },
            { phrase: 'Dêh', traduction: 'Voilà / Exactement (exclamation d\'approbation)', transcription: 'dêh' },
            { phrase: 'On est ensemble', traduction: 'Solidarité / On est du même côté', transcription: 'on est ensemble' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Que signifie "Walaï" en Nouchi ?', choix: ['Au revoir', 'Vraiment / Je te jure', 'Non merci', 'Viens ici'] },
          solution: { reponse: 'Vraiment / Je te jure' },
          pointsXp: 10,
          explication: '"Walaï" vient de l\'arabe "wallahi" (par Dieu) et exprime la sincérité ou l\'étonnement.',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Nouchi',
    description: 'Comment les jeunes Ivoiriens parlent de leur famille en Nouchi, l\'argot d\'Abidjan.',
    ordre: 21, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les membres de la famille en Nouchi',
          mots: [
            { mot: 'Vieux', traduction: 'Père (familier)', transcription: 'vieux' },
            { mot: 'Vieille', traduction: 'Mère (familier)', transcription: 'vieille' },
            { mot: 'Frangin', traduction: 'Frère (familier)', transcription: 'frangin' },
            { mot: 'Frangine', traduction: 'Sœur (familier)', transcription: 'frangine' },
            { mot: 'Gnata', traduction: 'Enfant', transcription: 'gnata' },
            { mot: 'Doya', traduction: 'Grand-père', transcription: 'doya' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mère" (familier) en Nouchi ?', choix: ['Vieux', 'Frangin', 'Doya', 'Vieille'] },
          solution: { reponse: 'Vieille' },
          pointsXp: 10,
          explication: '"Vieille" désigne la mère de façon familière en Nouchi. "Mon vieux" = mon père.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Parler de sa famille en Nouchi',
          dialogue: [
            { locuteur: 'Moussa', texte: 'Ton vieux va bien ?', traduction: 'Ton père va bien ?' },
            { locuteur: 'Kader', texte: 'Ça gaze, dêh. Ma vieille aussi.', traduction: 'Ça va, exactement. Ma mère aussi.' },
            { locuteur: 'Moussa', texte: 'Ton frangin est là ?', traduction: 'Ton frère est là ?' },
            { locuteur: 'Kader', texte: 'Walaï, il a gbôkô avec les gnatas.', traduction: 'Vraiment, il est parti avec les enfants.' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Frère" (familier) en Nouchi ?', choix: ['Doya', 'Gnata', 'Vieux', 'Frangin'] },
          solution: { reponse: 'Frangin' },
          pointsXp: 10,
          explication: '"Frangin" signifie Frère (familier) en Nouchi, emprunté du français argotique.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Le Nouchi intègre le français',
          explication: 'Le Nouchi utilise la grammaire du français mais transforme le vocabulaire. Les mots familiers français ("vieux", "frangin") côtoient des créations locales ("gnata", "doya"). On peut mélanger librement : "Mon vieux il a gbôkô" = Mon père est parti.',
          exemples: [
            { phrase: 'Mon vieux', traduction: 'Mon père', transcription: 'mon vieux' },
            { phrase: 'Ma vieille', traduction: 'Ma mère', transcription: 'ma vieille' },
            { phrase: 'Mon frangin', traduction: 'Mon frère', transcription: 'mon frangin' },
            { phrase: 'Les gnatas', traduction: 'Les enfants', transcription: 'les gnatas' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Que signifie "Gnata" en Nouchi ?', choix: ['Ami', 'Grand-père', 'Enfant', 'Père'] },
          solution: { reponse: 'Enfant' },
          pointsXp: 10,
          explication: '"Gnata" signifie Enfant en Nouchi. "Les gnatas jouent" = Les enfants jouent.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché en Nouchi',
    description: 'Le vocabulaire du commerce et de l\'argent en Nouchi, pour marchander à l\'ivoirienne au marché d\'Adjamé ou de Cocody.',
    ordre: 22, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'L\'argent et le commerce en Nouchi',
          mots: [
            { mot: 'Gbagba', traduction: 'Argent', transcription: 'gbagba' },
            { mot: 'Tchoukeur', traduction: 'Négocier / Marchander', transcription: 'tchoukeur' },
            { mot: 'Manger l\'argent', traduction: 'Profiter / Détourner de l\'argent', transcription: 'manger l\'argent' },
            { mot: 'Dèh', traduction: 'Wow ! / C\'est incroyable !', transcription: 'dèh' },
            { mot: 'C\'est fini', traduction: 'C\'est terminé / Plus rien', transcription: 'c\'est fini' },
            { mot: 'Akwaba', traduction: 'Bienvenue (mot Akan intégré au Nouchi)', transcription: 'akwaba' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Argent" en Nouchi ?', choix: ['Akwaba', 'Dèh', 'Tchoukeur', 'Gbagba'] },
          solution: { reponse: 'Gbagba' },
          pointsXp: 10,
          explication: '"Gbagba" signifie Argent en Nouchi. "T\'as le gbagba ?" = T\'as l\'argent ?',
        },
      },
      {
        type: 'DIALOGUE', ordre: 2,
        contenu: {
          titre: 'Marchander au marché d\'Adjamé',
          dialogue: [
            { locuteur: 'Moussa', texte: 'Akwaba ! Gbagba là, c\'est trop !', traduction: 'Bienvenue ! Le prix là, c\'est trop !' },
            { locuteur: 'Kader', texte: 'Dêh, tu peux tchoukeur !', traduction: 'Voilà, tu peux négocier !' },
            { locuteur: 'Moussa', texte: 'Dèh ! Ça gaze comme ça ?', traduction: 'Wow ! C\'est bon comme ça ?' },
            { locuteur: 'Kader', texte: 'Ɛɛ ! On est ensemble !', traduction: 'Oui ! On est d\'accord !' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Que signifie "Tchoukeur" en Nouchi ?', choix: ['Payer cash', 'Négocier', 'Voler', 'Acheter beaucoup'] },
          solution: { reponse: 'Négocier' },
          pointsXp: 10,
          explication: '"Tchoukeur" signifie Négocier / Marchander en Nouchi. Indispensable au marché ivoirien !',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les expressions économiques du Nouchi',
          explication: 'Le Nouchi est riche en expressions liées à l\'argent, reflet de la vie économique abidjanaise. "Manger l\'argent" (profiter/détourner), "Gbagba" (argent), "Tchoukeur" (négocier) sont des piliers du vocabulaire économique Nouchi.',
          exemples: [
            { phrase: 'Il a mangé l\'argent', traduction: 'Il a détourné l\'argent / Il a profité', transcription: 'il a mangé l\'argent' },
            { phrase: 'T\'as le gbagba ?', traduction: 'T\'as l\'argent ?', transcription: 't\'as le gbagba' },
            { phrase: 'Viens tchoukeur', traduction: 'Viens négocier', transcription: 'viens tchoukeur' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Que signifie "Akwaba" en Nouchi ?', choix: ['Au revoir', 'Merci beaucoup', 'Bienvenue', 'C\'est cher'] },
          solution: { reponse: 'Bienvenue' },
          pointsXp: 10,
          explication: '"Akwaba" signifie Bienvenue, emprunté de l\'Akan (Baoulé/Agni). Très utilisé en Nouchi pour accueillir quelqu\'un.',
        },
      },
    ],
  },
];

// ============================================================
// SEED FUNCTION
// ============================================================
async function main() {
  const languages = await prisma.language.findMany();
  const langMap = {};
  languages.forEach(l => { langMap[l.code] = l.id; });

  const allLessons = [
    { code: 'bete',    lessons: LESSONS_BETE    },
    { code: 'senoufo', lessons: LESSONS_SENOUFO },
    { code: 'agni',    lessons: LESSONS_AGNI    },
    { code: 'gouro',   lessons: LESSONS_GOURO   },
    { code: 'guere',   lessons: LESSONS_GUERE   },
    { code: 'nouchi',  lessons: LESSONS_NOUCHI  },
  ];

  let totalLessons = 0;
  let totalSteps = 0;
  let totalExercises = 0;

  for (const { code, lessons } of allLessons) {
    const languageId = langMap[code];
    if (!languageId) {
      console.log(`⚠ Langue "${code}" non trouvée, skipping...`);
      continue;
    }

    console.log(`\n📚 ${code.toUpperCase()} (${lessons.length} leçons)`);

    for (const lessonData of lessons) {
      // Vérifier si la leçon existe déjà
      const exists = await prisma.lesson.findFirst({
        where: { languageId, titre: lessonData.titre },
      });
      if (exists) {
        console.log(`  ⏭ "${lessonData.titre}" existe déjà`);
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
      console.log(`  ✅ Leçon: ${lessonData.titre}`);

      for (const stepData of lessonData.steps) {
        const step = await prisma.lessonStep.create({
          data: {
            lessonId: lesson.id,
            type: stepData.type,
            contenu: stepData.contenu,
            ordre: stepData.ordre,
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

  console.log(`\n✨ RÉSUMÉ :`);
  console.log(`   ${totalLessons} leçons créées`);
  console.log(`   ${totalSteps} étapes (vocabulaire, dialogues, grammaire)`);
  console.log(`   ${totalExercises} exercices interactifs`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
