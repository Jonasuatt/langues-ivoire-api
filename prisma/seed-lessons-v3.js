const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// LEÇONS V3 — 5 leçons Baoulé + 5 leçons Dioula
// Contenu linguistique riche : vocabulaire, dialogues, grammaire, exercices
// Progression : A1 → A2 → B1
// ============================================================

const LESSONS_BAOULE = [
  // ===== LEÇON 1 : Salutations complètes =====
  {
    titre: 'Salutations et Formules de Politesse',
    description: 'Maîtrisez toutes les salutations du matin au soir en Baoulé, avec les réponses appropriées.',
    ordre: 10, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'Mɔ', traduction: 'Bonjour (réponse)', transcription: 'mɔ' },
            { mot: 'N dja', traduction: 'Bonjour (matin)', transcription: 'n dja' },
            { mot: 'Ɛnnɛ', traduction: 'Bonjour (midi)', transcription: 'ɛnnɛ' },
            { mot: 'Anwuhlɛ', traduction: 'Bonsoir', transcription: 'anwuhlɛ' },
            { mot: 'Kwa', traduction: 'Bonne nuit', transcription: 'kwa' },
            { mot: 'Yako', traduction: 'Désolé / Condoléances', transcription: 'yako' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonsoir" en Baoulé ?', choix: ['N dja', 'Anwuhlɛ', 'Kwa', 'Ɛnnɛ'] },
          solution: { reponse: 'Anwuhlɛ' },
          pointsXp: 10,
          explication: '"Anwuhlɛ" est la salutation du soir en Baoulé.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Formules de politesse',
          mots: [
            { mot: 'Aniannian', traduction: 'Merci', transcription: 'aniannian' },
            { mot: 'Yaci', traduction: 'Pardon / Excuse-moi', transcription: 'yaci' },
            { mot: 'Ɛɛ', traduction: 'Oui', transcription: 'ɛɛ' },
            { mot: 'Cɛcɛ', traduction: 'Non', transcription: 'cɛcɛ' },
            { mot: 'A klo ?', traduction: 'Tu vas bien ?', transcription: 'a klo' },
            { mot: 'N klo', traduction: 'Je vais bien', transcription: 'n klo' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Aniannian" en français ?', choix: ['Bonjour', 'Au revoir', 'Merci', 'Pardon'] },
          solution: { reponse: 'Merci' },
          pointsXp: 10,
          explication: '"Aniannian" signifie Merci en Baoulé. C\'est un mot essentiel de la politesse.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 3,
        contenu: {
          titre: 'Rencontre au village',
          dialogue: [
            { locuteur: 'Kouadio', texte: 'N dja !', traduction: 'Bonjour !' },
            { locuteur: 'Amara', texte: 'Mɔ ! A klo ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Kouadio', texte: 'N klo. Wɔ nin ?', traduction: 'Je vais bien. Et toi ?' },
            { locuteur: 'Amara', texte: 'N klo sɛ. Aniannian.', traduction: 'Je vais très bien. Merci.' },
            { locuteur: 'Kouadio', texte: 'Anwuhlɛ !', traduction: 'Bonsoir !' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que répond-on à "A klo ?" ?', choix: ['Aniannian', 'N klo', 'Yako', 'Cɛcɛ'] },
          solution: { reponse: 'N klo' },
          pointsXp: 10,
          explication: '"N klo" signifie "Je vais bien", c\'est la réponse naturelle à "A klo ?" (Tu vas bien ?).',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Baoulé',
    description: 'Les membres de la famille et les liens de parenté, essentiels dans la culture Akan.',
    ordre: 11, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Niɛn', traduction: 'Mère / Maman', transcription: 'niɛn' },
            { mot: 'Si', traduction: 'Père / Papa', transcription: 'si' },
            { mot: 'Niaan', traduction: 'Frère / Sœur', transcription: 'niaan' },
            { mot: 'Ba', traduction: 'Enfant', transcription: 'ba' },
            { mot: 'Nannan', traduction: 'Grand-parent / Ancien', transcription: 'nannan' },
            { mot: 'Yi', traduction: 'Épouse', transcription: 'yi' },
            { mot: 'Bian', traduction: 'Époux / Homme', transcription: 'bian' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mère" en Baoulé ?', choix: ['Si', 'Niɛn', 'Ba', 'Yi'] },
          solution: { reponse: 'Niɛn' },
          pointsXp: 10,
          explication: '"Niɛn" désigne la Mère en Baoulé. La mère a un rôle central dans la société matrilinéaire Akan.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'La famille élargie',
          mots: [
            { mot: 'Siwa', traduction: 'Oncle (frère du père)', transcription: 'siwa' },
            { mot: 'Niɛnwa', traduction: 'Tante (sœur de la mère)', transcription: 'niɛnwa' },
            { mot: 'Anunman', traduction: 'Cousin / Cousine', transcription: 'anunman' },
            { mot: 'Awlofuɛ', traduction: 'Famille / Parenté', transcription: 'awlofuɛ' },
            { mot: 'Sua', traduction: 'Maison / Foyer', transcription: 'sua' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Awlofuɛ" ?', choix: ['Village', 'Famille', 'Maison', 'Ami'] },
          solution: { reponse: 'Famille' },
          pointsXp: 10,
          explication: '"Awlofuɛ" désigne la famille, la parenté au sens large en Baoulé.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Baoulé',
          explication: 'En Baoulé, le possessif se place AVANT le nom. "Min" = mon/ma, "A" = ton/ta, "I" = son/sa.\nExemple : "Min niɛn" = Ma mère, "A si" = Ton père.',
          exemples: [
            { phrase: 'Min niɛn', traduction: 'Ma mère', transcription: 'min niɛn' },
            { phrase: 'A si', traduction: 'Ton père', transcription: 'a si' },
            { phrase: 'I ba', traduction: 'Son enfant', transcription: 'i ba' },
            { phrase: 'E sua', traduction: 'Notre maison', transcription: 'e sua' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: 'Comment dit-on "Ma mère" en Baoulé ?', choix: ['A niɛn', 'Min niɛn', 'I niɛn', 'Niɛn min'] },
          solution: { reponse: 'Min niɛn' },
          pointsXp: 15,
          explication: 'Le possessif "Min" (mon/ma) se place AVANT le nom : "Min niɛn" = Ma mère.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 4,
        contenu: {
          titre: 'Présenter sa famille',
          dialogue: [
            { locuteur: 'Amara', texte: 'A awlofuɛ\'n ti sɛ ?', traduction: 'Comment va ta famille ?' },
            { locuteur: 'Kouadio', texte: 'Be klo. Min niɛn nin min si be o lɛ.', traduction: 'Ils vont bien. Ma mère et mon père sont là.' },
            { locuteur: 'Amara', texte: 'A niaan\'m be ti nnyɛ ?', traduction: 'Tes frères et sœurs sont combien ?' },
            { locuteur: 'Kouadio', texte: 'E ti nnan. Yasua nɲɔn nin bla nɲɔn.', traduction: 'Nous sommes quatre. Deux garçons et deux filles.' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment demander "Comment va ta famille ?" en Baoulé ?', choix: ['A klo ?', 'A awlofuɛ\'n ti sɛ ?', 'A niɛn klo ?', 'Min awlofuɛ'] },
          solution: { reponse: 'A awlofuɛ\'n ti sɛ ?' },
          pointsXp: 10,
          explication: '"A awlofuɛ\'n ti sɛ ?" est la façon de demander des nouvelles de la famille.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché — Acheter et Vendre',
    description: 'Le vocabulaire essentiel pour faire ses courses au marché en Baoulé.',
    ordre: 12, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les aliments de base',
          mots: [
            { mot: 'Aliɛ', traduction: 'Nourriture / Plat', transcription: 'aliɛ' },
            { mot: 'Loto', traduction: 'Riz', transcription: 'loto' },
            { mot: 'Akpɛssɛ', traduction: 'Attiéké', transcription: 'akpɛssɛ' },
            { mot: 'Nzuɛn', traduction: 'Eau', transcription: 'nzuɛn' },
            { mot: 'Nannin', traduction: 'Viande (bœuf)', transcription: 'nannin' },
            { mot: 'Jɛ', traduction: 'Poisson', transcription: 'jɛ' },
            { mot: 'Banan', traduction: 'Banane', transcription: 'banan' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Eau" en Baoulé ?', choix: ['Loto', 'Aliɛ', 'Nzuɛn', 'Jɛ'] },
          solution: { reponse: 'Nzuɛn' },
          pointsXp: 10,
          explication: '"Nzuɛn" signifie Eau en Baoulé.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Acheter et négocier',
          mots: [
            { mot: 'To', traduction: 'Acheter', transcription: 'to' },
            { mot: 'Yo', traduction: 'Vendre', transcription: 'yo' },
            { mot: 'Sika', traduction: 'Argent', transcription: 'sika' },
            { mot: 'I ti sɛ ?', traduction: 'C\'est combien ?', transcription: 'i ti sɛ' },
            { mot: 'A ti gbɛ', traduction: 'C\'est cher', transcription: 'a ti gbɛ' },
            { mot: 'Kpɛ su', traduction: 'Diminue le prix', transcription: 'kpɛ su' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "I ti sɛ ?" ?', choix: ['C\'est bon', 'C\'est combien ?', 'C\'est cher', 'C\'est fini'] },
          solution: { reponse: 'C\'est combien ?' },
          pointsXp: 10,
          explication: '"I ti sɛ ?" est la question pour demander le prix au marché.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 3,
        contenu: {
          titre: 'Négocier au marché',
          dialogue: [
            { locuteur: 'Kouadio', texte: 'Mɔ tanninfuɛ ! Loto\'n i ti sɛ ?', traduction: 'Bonjour la vendeuse ! Le riz c\'est combien ?' },
            { locuteur: 'Amara', texte: 'Talua kun ti sika ya nnun.', traduction: 'Un tas coûte cinq cents francs.' },
            { locuteur: 'Kouadio', texte: 'A ti gbɛ ! Kpɛ su !', traduction: 'C\'est cher ! Diminue le prix !' },
            { locuteur: 'Amara', texte: 'Sika ya nnan. I ti klɛ.', traduction: 'Quatre cents francs. C\'est le dernier prix.' },
            { locuteur: 'Kouadio', texte: 'Ɛɛ, n to. Aniannian !', traduction: 'D\'accord, j\'achète. Merci !' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: 'Pour demander une réduction, on dit :', choix: ['Aniannian', 'I ti sɛ ?', 'Kpɛ su', 'N to'] },
          solution: { reponse: 'Kpɛ su' },
          pointsXp: 10,
          explication: '"Kpɛ su" signifie "Diminue le prix", expression indispensable pour négocier au marché ivoirien !',
        },
      },
      {
        type: 'GRAMMAR', ordre: 4,
        contenu: {
          titre: 'Les nombres pour le marché',
          explication: 'Les nombres sont essentiels pour comprendre les prix. En Baoulé :\n"Kun" = 1, "Nɲɔn" = 2, "Nsan" = 3, "Nnan" = 4, "Nnun" = 5.',
          exemples: [
            { phrase: 'Sika ya kun', traduction: 'Cent francs', transcription: 'sika ya kun' },
            { phrase: 'Sika ya nɲɔn', traduction: 'Deux cents francs', transcription: 'sika ya nɲɔn' },
            { phrase: 'Sika wka', traduction: 'Mille francs', transcription: 'sika wka' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mille francs" en Baoulé ?', choix: ['Sika ya nnun', 'Sika ya nnan', 'Sika wka', 'Sika ya nsan'] },
          solution: { reponse: 'Sika wka' },
          pointsXp: 15,
          explication: '"Sika wka" = Mille francs. "Wka" signifie mille.',
        },
      },
    ],
  },

  // ===== LEÇON 4 : Les verbes du quotidien =====
  {
    titre: 'Verbes et Actions du Quotidien',
    description: 'Les verbes essentiels pour décrire vos activités de tous les jours en Baoulé.',
    ordre: 13, niveau: 'A2', pointsXp: 65,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Actions fondamentales',
          mots: [
            { mot: 'Di', traduction: 'Manger', transcription: 'di' },
            { mot: 'Nɔn', traduction: 'Boire', transcription: 'nɔn' },
            { mot: 'Kɔ', traduction: 'Aller / Partir', transcription: 'kɔ' },
            { mot: 'Ba', traduction: 'Venir', transcription: 'ba' },
            { mot: 'La', traduction: 'Dormir', transcription: 'la' },
            { mot: 'Si', traduction: 'Savoir / Connaître', transcription: 'si' },
            { mot: 'Kan', traduction: 'Parler / Dire', transcription: 'kan' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Manger" en Baoulé ?', choix: ['Nɔn', 'Di', 'Kɔ', 'La'] },
          solution: { reponse: 'Di' },
          pointsXp: 10,
          explication: '"Di" signifie Manger. Ex: "N su di aliɛ" = Je mange.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Actions de la journée',
          mots: [
            { mot: 'Di junman', traduction: 'Travailler', transcription: 'di junman' },
            { mot: 'Suɛn', traduction: 'Apprendre / Étudier', transcription: 'suɛn' },
            { mot: 'Klɛ', traduction: 'Écrire', transcription: 'klɛ' },
            { mot: 'Kanngan', traduction: 'Lire', transcription: 'kanngan' },
            { mot: 'Sran', traduction: 'Chanter', transcription: 'sran' },
            { mot: 'Bo', traduction: 'Frapper / Jouer (instrument)', transcription: 'bo' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Suɛn" ?', choix: ['Chanter', 'Travailler', 'Apprendre', 'Écrire'] },
          solution: { reponse: 'Apprendre' },
          pointsXp: 10,
          explication: '"Suɛn" signifie Apprendre/Étudier. Vous êtes en train de "suɛn" le Baoulé !',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'La conjugaison de base',
          explication: 'En Baoulé, le verbe ne se conjugue pas comme en français. On utilise des particules :\n- "Su" = en train de (présent continu)\n- "Wá" = futur\n- "Man" = négation\n\nStructure : SUJET + PARTICULE + VERBE',
          exemples: [
            { phrase: 'N su di', traduction: 'Je mange (en train de)', transcription: 'n su di' },
            { phrase: 'N wá kɔ', traduction: 'J\'irai / Je vais aller', transcription: 'n wá kɔ' },
            { phrase: 'N di man', traduction: 'Je ne mange pas', transcription: 'n di man' },
            { phrase: 'A su suɛn', traduction: 'Tu apprends (en ce moment)', transcription: 'a su suɛn' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: 'Comment dit-on "Je ne mange pas" en Baoulé ?', choix: ['N su di', 'N di man', 'N wá di', 'N di'] },
          solution: { reponse: 'N di man' },
          pointsXp: 15,
          explication: 'La négation se fait avec "man" après le verbe : "N di man" = Je ne mange pas.',
        },
      },
    ],
  },

  // ===== LEÇON 5 : Culture et traditions =====
  {
    titre: 'Culture et Traditions Baoulé',
    description: 'Découvrez les expressions culturelles, les fêtes et les valeurs du peuple Baoulé.',
    ordre: 14, niveau: 'B1', pointsXp: 70,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'La vie au village',
          mots: [
            { mot: 'Klɔ', traduction: 'Village', transcription: 'klɔ' },
            { mot: 'Aɲia', traduction: 'Réunion / Assemblée', transcription: 'aɲia' },
            { mot: 'Kpɛngbɛn', traduction: 'Chef / Roi', transcription: 'kpɛngbɛn' },
            { mot: 'Aja', traduction: 'Fête / Célébration', transcription: 'aja' },
            { mot: 'Amuin', traduction: 'Esprit / Génie', transcription: 'amuin' },
            { mot: 'Alɛ', traduction: 'Guerre / Conflit', transcription: 'alɛ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Chef / Roi" en Baoulé ?', choix: ['Amuin', 'Kpɛngbɛn', 'Klɔ', 'Aja'] },
          solution: { reponse: 'Kpɛngbɛn' },
          pointsXp: 10,
          explication: '"Kpɛngbɛn" désigne le Chef ou le Roi chez les Baoulé.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Proverbes et sagesse',
          mots: [
            { mot: 'Bɔlɛ', traduction: 'Proverbe / Parole de sagesse', transcription: 'bɔlɛ' },
            { mot: 'Si yɛ si anuannzɛ', traduction: 'L\'union fait la force', transcription: 'si yɛ si anuannzɛ' },
            { mot: 'Sran kun kwla man', traduction: 'Un seul doigt ne peut pas', transcription: 'sran kun kwla man' },
            { mot: 'Klɔ nin i nuan', traduction: 'Chaque village a ses coutumes', transcription: 'klɔ nin i nuan' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie le proverbe "Si yɛ si anuannzɛ" ?', choix: ['Le savoir est une richesse', 'L\'union fait la force', 'La patience paie', 'Le temps guérit'] },
          solution: { reponse: 'L\'union fait la force' },
          pointsXp: 15,
          explication: 'Ce proverbe Baoulé exprime l\'importance de la solidarité et de l\'entraide communautaire.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Expressions idiomatiques',
          explication: 'Le Baoulé est riche en expressions imagées qui reflètent la sagesse Akan. Ces expressions ne se traduisent pas mot à mot.',
          exemples: [
            { phrase: 'I nyin ti kpa', traduction: 'Il/Elle est généreux(se) (litt: ses yeux sont bons)', transcription: 'i nyin ti kpa' },
            { phrase: 'I awlɛn ti fuɛn', traduction: 'Il/Elle est courageux(se) (litt: son cœur est dur)', transcription: 'i awlɛn ti fuɛn' },
            { phrase: 'Kan asiɛ\'n su', traduction: 'Parler de choses sérieuses (litt: parler sur la terre)', transcription: 'kan asiɛn su' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: '"I nyin ti kpa" signifie littéralement :', choix: ['Ses yeux sont bons', 'Son cœur est grand', 'Sa tête est forte', 'Ses mains sont pleines'] },
          solution: { reponse: 'Ses yeux sont bons' },
          pointsXp: 15,
          explication: '"I nyin ti kpa" = "Ses yeux sont bons", expression utilisée pour dire que quelqu\'un est généreux.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 4,
        contenu: {
          titre: 'Invitation à une fête traditionnelle',
          dialogue: [
            { locuteur: 'Kouadio', texte: 'E klɔ\'n su aja o lɛ Simen.', traduction: 'Il y a une fête dans notre village Samedi.' },
            { locuteur: 'Amara', texte: 'Aja onin ? N klo sɛ !', traduction: 'Quelle fête ? C\'est super !' },
            { locuteur: 'Kouadio', texte: 'Igname aja. E kpɛngbɛn\'n wá fá igname klɛn\'n mán amuin\'m be.', traduction: 'La fête des ignames. Notre chef va offrir la nouvelle igname aux esprits.' },
            { locuteur: 'Amara', texte: 'N wá ba. Min awlofuɛ\'m bé ba wie.', traduction: 'Je viendrai. Ma famille viendra aussi.' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Qu\'est-ce que "Igname aja" ?', choix: ['Un plat d\'igname', 'La fête des ignames', 'Le champ d\'ignames', 'Le marché d\'ignames'] },
          solution: { reponse: 'La fête des ignames' },
          pointsXp: 15,
          explication: 'La Fête des Ignames est la plus importante célébration Baoulé, marquant la nouvelle récolte.',
        },
      },
    ],
  },
];

const LESSONS_DIOULA = [
  // ===== LEÇON 1 : Salutations =====
  {
    titre: 'Salutations et Réponses en Dioula',
    description: 'Les salutations complètes du matin au soir en Dioula, la langue commerciale de l\'Afrique de l\'Ouest.',
    ordre: 10, niveau: 'A1', pointsXp: 50,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les salutations du jour',
          mots: [
            { mot: 'I ni sɔgɔma', traduction: 'Bonjour (matin)', transcription: 'i ni sɔgɔma' },
            { mot: 'I ni tilé', traduction: 'Bonjour (après-midi)', transcription: 'i ni tilé' },
            { mot: 'I ni wula', traduction: 'Bonsoir', transcription: 'i ni wula' },
            { mot: 'N ba', traduction: 'Réponse (merci d\'être venu)', transcription: 'n ba' },
            { mot: 'I ni cɛ', traduction: 'Bravo / Félicitations', transcription: 'i ni cɛ' },
            { mot: 'Hɛrɛ sira', traduction: 'Bonne nuit', transcription: 'hɛrɛ sira' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Bonjour (matin)" en Dioula ?', choix: ['I ni tilé', 'I ni wula', 'I ni sɔgɔma', 'Hɛrɛ sira'] },
          solution: { reponse: 'I ni sɔgɔma' },
          pointsXp: 10,
          explication: '"I ni sɔgɔma" est la salutation du matin. Littéralement : "Toi avec le matin".',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Demander des nouvelles',
          mots: [
            { mot: 'I ka kɛnɛ wa ?', traduction: 'Tu vas bien ? / La santé ?', transcription: 'i ka kɛnɛ wa' },
            { mot: 'Tɔɔrɔ tɛ', traduction: 'Pas de problème / Ça va', transcription: 'tɔɔrɔ tɛ' },
            { mot: 'Aw ni cɛ', traduction: 'Bonjour (à un groupe)', transcription: 'aw ni cɛ' },
            { mot: 'Iniwé', traduction: 'Merci', transcription: 'iniwé' },
            { mot: 'Amiina', traduction: 'Amen / Ainsi soit-il', transcription: 'amiina' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Tɔɔrɔ tɛ" ?', choix: ['Bonjour', 'Au revoir', 'Pas de problème', 'Bonne nuit'] },
          solution: { reponse: 'Pas de problème' },
          pointsXp: 10,
          explication: '"Tɔɔrɔ tɛ" = "Pas de problème", la réponse standard quand on demande des nouvelles.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 3,
        contenu: {
          titre: 'Salutations au marché',
          dialogue: [
            { locuteur: 'Kouadio', texte: 'I ni sɔgɔma !', traduction: 'Bonjour !' },
            { locuteur: 'Amara', texte: 'N ba ! I ka kɛnɛ wa ?', traduction: 'Bonjour ! Tu vas bien ?' },
            { locuteur: 'Kouadio', texte: 'Tɔɔrɔ tɛ. I somɔgɔw ka kɛnɛ wa ?', traduction: 'Ça va. Ta famille va bien ?' },
            { locuteur: 'Amara', texte: 'Ɛɛ, bɛɛ ka kɛnɛ. Ala ka i hɛrɛ da.', traduction: 'Oui, tout le monde va bien. Que Dieu te bénisse.' },
            { locuteur: 'Kouadio', texte: 'Amiina ! K\'an bɛn.', traduction: 'Amen ! À bientôt.' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment demander "Ta famille va bien ?" en Dioula ?', choix: ['I ka kɛnɛ wa ?', 'I somɔgɔw ka kɛnɛ wa ?', 'Tɔɔrɔ tɛ', 'Aw ni cɛ'] },
          solution: { reponse: 'I somɔgɔw ka kɛnɛ wa ?' },
          pointsXp: 10,
          explication: '"Somɔgɔw" = famille. "I somɔgɔw ka kɛnɛ wa ?" = Ta famille va bien ?',
        },
      },
    ],
  },

  // ===== LEÇON 2 : La famille =====
  {
    titre: 'La Famille en Dioula',
    description: 'Les membres de la famille et les relations sociales dans la culture Mandingue.',
    ordre: 11, niveau: 'A1', pointsXp: 55,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les parents proches',
          mots: [
            { mot: 'Ba', traduction: 'Mère / Maman', transcription: 'ba' },
            { mot: 'Fa', traduction: 'Père / Papa', transcription: 'fa' },
            { mot: 'Balimaw', traduction: 'Frères et sœurs', transcription: 'balimaw' },
            { mot: 'Dén', traduction: 'Enfant', transcription: 'dén' },
            { mot: 'Muso', traduction: 'Femme / Épouse', transcription: 'muso' },
            { mot: 'Cɛ', traduction: 'Homme / Époux', transcription: 'cɛ' },
            { mot: 'Bɛɛmaba', traduction: 'Grand-père / Grand-mère', transcription: 'bɛɛmaba' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Mère" en Dioula ?', choix: ['Fa', 'Ba', 'Muso', 'Dén'] },
          solution: { reponse: 'Ba' },
          pointsXp: 10,
          explication: '"Ba" signifie Mère en Dioula. Le respect de la mère est fondamental dans la culture Mandingue.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'La famille élargie',
          mots: [
            { mot: 'Tériw', traduction: 'Amis', transcription: 'tériw' },
            { mot: 'Siginyɔgɔn', traduction: 'Voisin', transcription: 'siginyɔgɔn' },
            { mot: 'Dénmuso', traduction: 'Fille', transcription: 'dénmuso' },
            { mot: 'Déncɛ', traduction: 'Garçon / Fils', transcription: 'déncɛ' },
            { mot: 'So', traduction: 'Maison', transcription: 'so' },
            { mot: 'Dugu', traduction: 'Village / Ville', transcription: 'dugu' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Dugu" ?', choix: ['Maison', 'Village', 'Famille', 'Quartier'] },
          solution: { reponse: 'Village' },
          pointsXp: 10,
          explication: '"Dugu" signifie Village ou Ville en Dioula.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Les possessifs en Dioula',
          explication: 'En Dioula, le possessif se place APRÈS le nom avec un marqueur :\n"N" = mon, "I" = ton, "A" = son\nExemple : "N ba" = Ma mère, "I fa" = Ton père.',
          exemples: [
            { phrase: 'N ba', traduction: 'Ma mère', transcription: 'n ba' },
            { phrase: 'I fa', traduction: 'Ton père', transcription: 'i fa' },
            { phrase: 'A muso', traduction: 'Sa femme', transcription: 'a muso' },
            { phrase: 'An so', traduction: 'Notre maison', transcription: 'an so' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: 'Comment dit-on "Notre maison" en Dioula ?', choix: ['N so', 'I so', 'A so', 'An so'] },
          solution: { reponse: 'An so' },
          pointsXp: 15,
          explication: '"An" = notre/nos. "An so" = Notre maison.',
        },
      },
    ],
  },

  // ===== LEÇON 3 : Au marché =====
  {
    titre: 'Au Marché — Commerce en Dioula',
    description: 'Le Dioula est la langue du commerce en Afrique de l\'Ouest. Apprenez à acheter et négocier.',
    ordre: 12, niveau: 'A2', pointsXp: 60,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Les aliments courants',
          mots: [
            { mot: 'Dumuni', traduction: 'Nourriture', transcription: 'dumuni' },
            { mot: 'Malo', traduction: 'Riz', transcription: 'malo' },
            { mot: 'Jii', traduction: 'Eau', transcription: 'jii' },
            { mot: 'Sogo', traduction: 'Viande', transcription: 'sogo' },
            { mot: 'Jɛgɛ', traduction: 'Poisson', transcription: 'jɛgɛ' },
            { mot: 'Namasa', traduction: 'Banane', transcription: 'namasa' },
            { mot: 'Mangoro', traduction: 'Mangue', transcription: 'mangoro' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Riz" en Dioula ?', choix: ['Sogo', 'Malo', 'Dumuni', 'Jii'] },
          solution: { reponse: 'Malo' },
          pointsXp: 10,
          explication: '"Malo" signifie Riz en Dioula. C\'est l\'aliment de base en Côte d\'Ivoire.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Négocier et payer',
          mots: [
            { mot: 'San', traduction: 'Acheter', transcription: 'san' },
            { mot: 'Feere', traduction: 'Vendre', transcription: 'feere' },
            { mot: 'Wari', traduction: 'Argent', transcription: 'wari' },
            { mot: 'Jɔli yé ?', traduction: 'C\'est combien ?', transcription: 'jɔli yé' },
            { mot: 'A ka gɛlɛn', traduction: 'C\'est cher', transcription: 'a ka gɛlɛn' },
            { mot: 'A dɔgɔya', traduction: 'Diminue le prix', transcription: 'a dɔgɔya' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Jɔli yé ?" ?', choix: ['C\'est bon ?', 'C\'est combien ?', 'C\'est cher ?', 'C\'est fini ?'] },
          solution: { reponse: 'C\'est combien ?' },
          pointsXp: 10,
          explication: '"Jɔli yé ?" est LA question essentielle au marché en Dioula.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 3,
        contenu: {
          titre: 'Acheter au marché',
          dialogue: [
            { locuteur: 'Kouadio', texte: 'I ni tilé ! Mangoro jɔli yé ?', traduction: 'Bonjour ! Les mangues c\'est combien ?' },
            { locuteur: 'Amara', texte: 'Saba yé wari kɛmɛ duuru yé.', traduction: 'Trois pour cinq cents francs.' },
            { locuteur: 'Kouadio', texte: 'A ka gɛlɛn dɛ ! A dɔgɔya !', traduction: 'C\'est cher ! Diminue le prix !' },
            { locuteur: 'Amara', texte: 'Wari kɛmɛ naani. O ye a labɛnnen yé.', traduction: 'Quatre cents francs. C\'est le prix final.' },
            { locuteur: 'Kouadio', texte: 'Ɔ kɔni, n bɛ a san. Iniwé !', traduction: 'D\'accord, j\'achète. Merci !' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: 'Pour dire "Diminue le prix" en Dioula :', choix: ['Jɔli yé ?', 'A dɔgɔya', 'A ka gɛlɛn', 'N bɛ a san'] },
          solution: { reponse: 'A dɔgɔya' },
          pointsXp: 10,
          explication: '"A dɔgɔya" = "Diminue-le", expression incontournable pour négocier au marché !',
        },
      },
      {
        type: 'GRAMMAR', ordre: 4,
        contenu: {
          titre: 'Les nombres en Dioula',
          explication: 'Les nombres Dioula sont en base 10 :\n"Kelen" = 1, "Fila" = 2, "Saba" = 3, "Naani" = 4, "Duuru" = 5\n"Wɔɔrɔ" = 6, "Wolonfla" = 7, "Seegi" = 8, "Kɔnɔntɔn" = 9, "Tan" = 10',
          exemples: [
            { phrase: 'Wari kɛmɛ kelen', traduction: 'Cent francs', transcription: 'wari kɛmɛ kelen' },
            { phrase: 'Wari kɛmɛ duuru', traduction: 'Cinq cents francs', transcription: 'wari kɛmɛ duuru' },
            { phrase: 'Wari ba kelen', traduction: 'Mille francs', transcription: 'wari ba kelen' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "3" en Dioula ?', choix: ['Fila', 'Naani', 'Saba', 'Duuru'] },
          solution: { reponse: 'Saba' },
          pointsXp: 10,
          explication: '"Saba" = 3 en Dioula.',
        },
      },
    ],
  },

  // ===== LEÇON 4 : Verbes du quotidien =====
  {
    titre: 'Verbes et Phrases du Quotidien',
    description: 'Les verbes essentiels et la construction de phrases simples en Dioula.',
    ordre: 13, niveau: 'A2', pointsXp: 65,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Actions de base',
          mots: [
            { mot: 'Dumuni kɛ', traduction: 'Manger', transcription: 'dumuni kɛ' },
            { mot: 'Jii min', traduction: 'Boire de l\'eau', transcription: 'jii min' },
            { mot: 'Taa', traduction: 'Aller / Partir', transcription: 'taa' },
            { mot: 'Na', traduction: 'Venir', transcription: 'na' },
            { mot: 'Sigi', traduction: 'S\'asseoir', transcription: 'sigi' },
            { mot: 'Kuma', traduction: 'Parler', transcription: 'kuma' },
            { mot: 'Dɔn', traduction: 'Savoir / Connaître', transcription: 'dɔn' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment dit-on "Venir" en Dioula ?', choix: ['Taa', 'Na', 'Sigi', 'Kuma'] },
          solution: { reponse: 'Na' },
          pointsXp: 10,
          explication: '"Na" = Venir. Ex: "Na yan !" = Viens ici !',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'La vie de tous les jours',
          mots: [
            { mot: 'Baara kɛ', traduction: 'Travailler', transcription: 'baara kɛ' },
            { mot: 'Kalan kɛ', traduction: 'Étudier / Apprendre', transcription: 'kalan kɛ' },
            { mot: 'Sunɔgɔ', traduction: 'Dormir', transcription: 'sunɔgɔ' },
            { mot: 'Wuli', traduction: 'Se lever', transcription: 'wuli' },
            { mot: 'Dɔnkili la', traduction: 'Chanter', transcription: 'dɔnkili la' },
            { mot: 'Bɔ', traduction: 'Sortir', transcription: 'bɔ' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Kalan kɛ" ?', choix: ['Travailler', 'Manger', 'Étudier', 'Sortir'] },
          solution: { reponse: 'Étudier' },
          pointsXp: 10,
          explication: '"Kalan kɛ" = Étudier/Apprendre. "Kalan" = leçon, "kɛ" = faire.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Structure de la phrase Dioula',
          explication: 'L\'ordre des mots en Dioula est : SUJET + OBJET + VERBE (SOV)\nC\'est différent du français (SVO) !\n\n"Bɛ" = particule du présent\n"Tɛ" = particule de la négation\n"Bɛna" = particule du futur',
          exemples: [
            { phrase: 'N bɛ dumuni kɛ', traduction: 'Je mange', transcription: 'n bɛ dumuni kɛ' },
            { phrase: 'N tɛ Dioula dɔn', traduction: 'Je ne connais pas le Dioula', transcription: 'n tɛ dioula dɔn' },
            { phrase: 'N bɛna taa', traduction: 'Je vais partir', transcription: 'n bɛna taa' },
            { phrase: 'I bɛ kuma Dioula la ?', traduction: 'Tu parles Dioula ?', transcription: 'i bɛ kuma dioula la' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: 'Comment dit-on "Je vais partir" en Dioula ?', choix: ['N bɛ taa', 'N tɛ taa', 'N bɛna taa', 'N taa bɛ'] },
          solution: { reponse: 'N bɛna taa' },
          pointsXp: 15,
          explication: '"Bɛna" est la particule du futur : "N bɛna taa" = Je vais partir.',
        },
      },
    ],
  },

  // ===== LEÇON 5 : Culture et traditions =====
  {
    titre: 'Culture et Traditions Mandingue',
    description: 'Plongez dans la riche culture Mandingue : griots, proverbes et cérémonies.',
    ordre: 14, niveau: 'B1', pointsXp: 70,
    steps: [
      {
        type: 'VOCABULARY', ordre: 1,
        contenu: {
          titre: 'Culture et société',
          mots: [
            { mot: 'Jɛli', traduction: 'Griot (maître de la parole)', transcription: 'jɛli' },
            { mot: 'Kɔrɔ', traduction: 'Grand frère / Ancien', transcription: 'kɔrɔ' },
            { mot: 'Dɔgɔ', traduction: 'Petit frère / Cadet', transcription: 'dɔgɔ' },
            { mot: 'Kibaru', traduction: 'Nouvelle / Histoire', transcription: 'kibaru' },
            { mot: 'Seli', traduction: 'Prière', transcription: 'seli' },
            { mot: 'Seli kɛ', traduction: 'Prier', transcription: 'seli kɛ' },
          ],
        },
        exercise: {
          type: 'VOCABULARY',
          donnees: { question: 'Comment appelle-t-on le "maître de la parole" en Dioula ?', choix: ['Kɔrɔ', 'Jɛli', 'Dɔgɔ', 'Kibaru'] },
          solution: { reponse: 'Jɛli' },
          pointsXp: 10,
          explication: 'Le "Jɛli" (Griot) est le gardien de l\'histoire orale dans la culture Mandingue.',
        },
      },
      {
        type: 'VOCABULARY', ordre: 2,
        contenu: {
          titre: 'Proverbes Dioula',
          mots: [
            { mot: 'Kuma', traduction: 'Parole / Proverbe', transcription: 'kuma' },
            { mot: 'Hɛrɛ bɛ mɔgɔ ka na', traduction: 'Le bonheur vient à celui qui attend', transcription: 'hɛrɛ bɛ mɔgɔ ka na' },
            { mot: 'Bolo kelen tɛ se ka goni ta', traduction: 'Une seule main ne peut pas attraper', transcription: 'bolo kelen tɛ se ka goni ta' },
            { mot: 'Dugutigi', traduction: 'Chef de village', transcription: 'dugutigi' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Bolo kelen tɛ se ka goni ta" ?', choix: ['Le travail paie', 'Une seule main ne peut pas attraper', 'La patience est une vertu', 'Le chef décide'] },
          solution: { reponse: 'Une seule main ne peut pas attraper' },
          pointsXp: 15,
          explication: 'Ce proverbe Mandingue enseigne que l\'entraide est essentielle : seul, on ne peut rien accomplir.',
        },
      },
      {
        type: 'GRAMMAR', ordre: 3,
        contenu: {
          titre: 'Expressions de la sagesse Mandingue',
          explication: 'Les proverbes Dioula utilisent des images fortes tirées de la nature et de la vie quotidienne. Ils sont transmis de génération en génération par les Griots.',
          exemples: [
            { phrase: 'Mɔgɔ ka kan ka yɛlɛn a sɔn na', traduction: 'Il faut monter par où on est descendu (assumer ses actes)', transcription: 'mɔgɔ ka kan ka yɛlɛn a sɔn na' },
            { phrase: 'Hakilima tɛ kelen', traduction: 'L\'intelligence n\'est pas unique (écouter les autres)', transcription: 'hakilima tɛ kelen' },
            { phrase: 'Kɔnɔ bɛ ɲɔgɔn sɔrɔ', traduction: 'Les oiseaux se retrouvent (les semblables s\'attirent)', transcription: 'kɔnɔ bɛ ɲɔgɔn sɔrɔ' },
          ],
        },
        exercise: {
          type: 'GRAMMAR',
          donnees: { question: '"Hakilima tɛ kelen" enseigne qu\'il faut :', choix: ['Être courageux', 'Travailler dur', 'Écouter les autres', 'Prier souvent'] },
          solution: { reponse: 'Écouter les autres' },
          pointsXp: 15,
          explication: '"L\'intelligence n\'est pas unique" — ce proverbe valorise l\'écoute et le partage de connaissances.',
        },
      },
      {
        type: 'DIALOGUE', ordre: 4,
        contenu: {
          titre: 'Le Griot raconte',
          dialogue: [
            { locuteur: 'Kouadio', texte: 'Jɛli, an ka dugukolo kibaru fɔ an yé.', traduction: 'Griot, raconte-nous l\'histoire de notre terre.' },
            { locuteur: 'Amara', texte: 'An bɛɛmabaw tun bɛ yan. U ye dugu nin sigi.', traduction: 'Nos ancêtres étaient ici. Ils ont fondé ce village.' },
            { locuteur: 'Amara', texte: 'U ka kuma ko : "Bɛɛ ka bɛ ɲɔgɔn fɛ, o de ye fanga yé."', traduction: 'Ils disaient : "Être ensemble, c\'est ça la force."' },
            { locuteur: 'Kouadio', texte: 'Tiɲɛ dɛ ! An ka kan ka an bɛɛmabaw ka kuma mɛn.', traduction: 'C\'est vrai ! Nous devons écouter les paroles de nos ancêtres.' },
          ],
        },
        exercise: {
          type: 'TRANSLATION',
          donnees: { question: 'Que signifie "Bɛɛ ka bɛ ɲɔgɔn fɛ, o de ye fanga yé" ?', choix: ['L\'argent est le pouvoir', 'Être ensemble c\'est la force', 'Le chef commande', 'La terre est sacrée'] },
          solution: { reponse: 'Être ensemble c\'est la force' },
          pointsXp: 15,
          explication: 'Ce proverbe Mandingue résume la philosophie communautaire : la force vient de l\'unité.',
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
    { code: 'baoule', lessons: LESSONS_BAOULE },
    { code: 'dioula', lessons: LESSONS_DIOULA },
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
