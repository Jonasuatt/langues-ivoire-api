/**
 * Seed des phrases utiles pour les 9 langues MVP
 * Catégories : salutations, chiffres, couleurs, famille, marché,
 *              urgence, temps, directions, politesse, vie_quotidienne
 * Status : PUBLISHED — directement visibles dans l'app mobile
 * Sécurisé : ne crée pas de doublons (phrase + languageId unique)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Données par langue ───────────────────────────────────────────────────────

const PHRASES = {

  // ╔══════════════════════════════╗
  // ║  BAOULÉ                      ║
  // ╚══════════════════════════════╝
  baoule: [
    // Salutations
    { phrase: 'Akwaba', traduction: 'Bienvenue / Bonjour (accueil)', transcription: 'a-KWA-ba', categorie: 'salutations' },
    { phrase: 'A lo', traduction: 'Bonjour (matin)', transcription: 'a-LO', categorie: 'salutations' },
    { phrase: 'I kié', traduction: 'Comment vas-tu ?', transcription: 'i-KIEH', categorie: 'salutations' },
    { phrase: 'Mé kié fɛ', traduction: 'Je vais bien', transcription: 'meh-KIE-feh', categorie: 'salutations' },
    { phrase: "N'da", traduction: 'Merci', transcription: 'N-da', categorie: 'salutations' },
    { phrase: 'Kɔ wɛ', traduction: 'Au revoir', transcription: 'kɔ-WEH', categorie: 'salutations' },
    { phrase: 'Oui', traduction: 'Oui', transcription: 'wî', categorie: 'salutations' },
    { phrase: 'Aïn', traduction: 'Non', transcription: 'aïN', categorie: 'salutations' },
    // Chiffres
    { phrase: 'Kun', traduction: 'Un (1)', transcription: 'kun', categorie: 'chiffres' },
    { phrase: 'Nyo', traduction: 'Deux (2)', transcription: 'nyo', categorie: 'chiffres' },
    { phrase: 'Ngbla', traduction: 'Trois (3)', transcription: 'ngbla', categorie: 'chiffres' },
    { phrase: 'Nyan', traduction: 'Quatre (4)', transcription: 'nyan', categorie: 'chiffres' },
    { phrase: 'Nnu', traduction: 'Cinq (5)', transcription: 'nnu', categorie: 'chiffres' },
    { phrase: 'Nsien', traduction: 'Six (6)', transcription: 'nsien', categorie: 'chiffres' },
    { phrase: 'Nnzonle', traduction: 'Sept (7)', transcription: 'nzo-lé', categorie: 'chiffres' },
    { phrase: 'Nnuanle', traduction: 'Huit (8)', transcription: 'nua-lé', categorie: 'chiffres' },
    { phrase: 'Nnuonle', traduction: 'Neuf (9)', transcription: 'nuo-lé', categorie: 'chiffres' },
    { phrase: 'Bue', traduction: 'Dix (10)', transcription: 'bueh', categorie: 'chiffres' },
    // Marché
    { phrase: 'Wié wié ngue ?', traduction: 'Combien ça coûte ?', transcription: 'wié-wié-nguê', categorie: 'marche' },
    { phrase: 'Yɛ lɛ gbɛ', traduction: 'C\'est trop cher', transcription: 'yeh-leh-gbeh', categorie: 'marche' },
    { phrase: "N’klo amien", traduction: 'Je veux acheter', transcription: 'n-klo-amièn', categorie: 'marche' },
    { phrase: 'Wɛ man', traduction: 'Donne-moi', transcription: 'weh-man', categorie: 'marche' },
    // Urgence
    { phrase: 'N kpli bua !', traduction: 'Au secours !', transcription: 'n-kpli-boua', categorie: 'urgence' },
    { phrase: 'N bɛ', traduction: 'J\'ai mal', transcription: 'n-beh', categorie: 'urgence' },
    { phrase: 'Kpofue wɛ', traduction: 'Appelle un médecin', transcription: 'kpo-fwé-weh', categorie: 'urgence' },
    // Vie quotidienne
    { phrase: 'Mian', traduction: 'Eau', transcription: 'mian', categorie: 'vie_quotidienne' },
    { phrase: 'Manlɛ', traduction: 'Nourriture / Repas', transcription: 'man-leh', categorie: 'vie_quotidienne' },
    { phrase: 'Sran kɔ ?', traduction: 'Où est... ?', transcription: 'sran-ko', categorie: 'vie_quotidienne' },
    { phrase: "M'bra !", traduction: 'Viens !', transcription: 'm-bra', categorie: 'vie_quotidienne' },
    { phrase: "M'kɔ", traduction: "Je pars / Je m'en vais", transcription: 'm-ko', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  DIOULA                      ║
  // ╚══════════════════════════════╝
  dioula: [
    // Salutations
    { phrase: 'I ni ce', traduction: 'Bonjour (à une personne)', transcription: 'i-ni-CHÉ', categorie: 'salutations' },
    { phrase: 'Aw ni ce', traduction: 'Bonjour (à plusieurs)', transcription: 'aw-ni-CHÉ', categorie: 'salutations' },
    { phrase: 'I ka kɛnɛ wa ?', traduction: 'Tu vas bien ?', transcription: 'i-ka-KÈ-nè-wa', categorie: 'salutations' },
    { phrase: 'Toro si ma', traduction: 'Ça va, pas de problème', transcription: 'to-ro-si-ma', categorie: 'salutations' },
    { phrase: 'I ni baarɛ', traduction: 'Merci pour le travail', transcription: 'i-ni-BA-reh', categorie: 'salutations' },
    { phrase: 'Kana to', traduction: 'Au revoir', transcription: 'ka-na-to', categorie: 'salutations' },
    { phrase: 'Awo', traduction: 'Oui', transcription: 'a-wo', categorie: 'salutations' },
    { phrase: 'Ayi', traduction: 'Non', transcription: 'a-yi', categorie: 'salutations' },
    // Chiffres
    { phrase: 'Kelen', traduction: 'Un (1)', transcription: 'ké-lèn', categorie: 'chiffres' },
    { phrase: 'Fila', traduction: 'Deux (2)', transcription: 'fi-la', categorie: 'chiffres' },
    { phrase: 'Saba', traduction: 'Trois (3)', transcription: 'sa-ba', categorie: 'chiffres' },
    { phrase: 'Naani', traduction: 'Quatre (4)', transcription: 'naa-ni', categorie: 'chiffres' },
    { phrase: 'Duuru', traduction: 'Cinq (5)', transcription: 'duu-ru', categorie: 'chiffres' },
    { phrase: 'Wɔɔrɔ', traduction: 'Six (6)', transcription: 'wɔɔ-rɔ', categorie: 'chiffres' },
    { phrase: 'Wolonfila', traduction: 'Sept (7)', transcription: 'wo-lon-fi-la', categorie: 'chiffres' },
    { phrase: 'Segin', traduction: 'Huit (8)', transcription: 'sé-guin', categorie: 'chiffres' },
    { phrase: 'Kononton', traduction: 'Neuf (9)', transcription: 'ko-no-ton', categorie: 'chiffres' },
    { phrase: 'Tan', traduction: 'Dix (10)', transcription: 'tan', categorie: 'chiffres' },
    // Marché
    { phrase: 'Jɔli ye a sɔrɔ ?', traduction: 'Combien ça coûte ?', transcription: 'jo-li-yé-a-sɔ-rɔ', categorie: 'marche' },
    { phrase: 'A gɛlɛn', traduction: 'C\'est trop cher', transcription: 'a-gè-lèn', categorie: 'marche' },
    { phrase: 'N bɛ o sɔrɔ fɛ', traduction: 'Je veux l\'acheter', transcription: 'n-bè-o-sɔ-rɔ-fè', categorie: 'marche' },
    { phrase: 'A di n ma', traduction: 'Donne-le moi', transcription: 'a-di-n-ma', categorie: 'marche' },
    // Urgence
    { phrase: 'Dɛmɛ ! Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè-dè-mè', categorie: 'urgence' },
    { phrase: 'N bɛ dimi la', traduction: 'J\'ai mal', transcription: 'n-bè-di-mi-la', categorie: 'urgence' },
    { phrase: 'Dɔgɔtɔrɔ wele', traduction: 'Appelle un médecin', transcription: 'do-go-to-ro-wé-lé', categorie: 'urgence' },
    // Vie quotidienne
    { phrase: 'Ji', traduction: 'Eau', transcription: 'ji', categorie: 'vie_quotidienne' },
    { phrase: 'Dumu', traduction: 'Nourriture / Repas', transcription: 'du-mu', categorie: 'vie_quotidienne' },
    { phrase: 'Yɔrɔ min na ?', traduction: 'Où est... ?', transcription: 'yɔ-rɔ-min-na', categorie: 'vie_quotidienne' },
    { phrase: 'Naa yan', traduction: 'Viens ici', transcription: 'naa-yan', categorie: 'vie_quotidienne' },
    { phrase: 'N bɛ taa', traduction: 'Je pars', transcription: 'n-bè-taa', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  BÉTÉ                        ║
  // ╚══════════════════════════════╝
  bete: [
    { phrase: 'Zébéhi', traduction: 'Bienvenue / Bonjour', transcription: 'zé-bé-hi', categorie: 'salutations' },
    { phrase: 'I kôh', traduction: 'Comment tu vas ?', transcription: 'i-koh', categorie: 'salutations' },
    { phrase: 'M\'kôh bɔɔ', traduction: 'Je vais bien', transcription: 'm-koh-bɔɔ', categorie: 'salutations' },
    { phrase: 'Déhi', traduction: 'Merci', transcription: 'dé-hi', categorie: 'salutations' },
    { phrase: 'Kôh bɛɛ', traduction: 'Au revoir', transcription: 'koh-bèè', categorie: 'salutations' },
    { phrase: 'Ô', traduction: 'Oui', transcription: 'ô', categorie: 'salutations' },
    { phrase: 'Aïn', traduction: 'Non', transcription: 'aïn', categorie: 'salutations' },
    { phrase: 'Kelen', traduction: 'Un (1)', transcription: 'ké-lèn', categorie: 'chiffres' },
    { phrase: 'Flɛ', traduction: 'Deux (2)', transcription: 'fleh', categorie: 'chiffres' },
    { phrase: 'Yabɔ', traduction: 'Trois (3)', transcription: 'ya-bɔ', categorie: 'chiffres' },
    { phrase: 'Naŋ', traduction: 'Quatre (4)', transcription: 'naŋ', categorie: 'chiffres' },
    { phrase: 'Nunu', traduction: 'Cinq (5)', transcription: 'nu-nu', categorie: 'chiffres' },
    { phrase: 'Gbɔ wié ?', traduction: 'Combien coûte ?', transcription: 'gbɔ-wié', categorie: 'marche' },
    { phrase: 'Bi wɔ !', traduction: 'Au secours !', transcription: 'bi-wɔ', categorie: 'urgence' },
    { phrase: 'N dimi', traduction: 'J\'ai mal', transcription: 'n-di-mi', categorie: 'urgence' },
    { phrase: 'Tio', traduction: 'Eau', transcription: 'tio', categorie: 'vie_quotidienne' },
    { phrase: 'Flou', traduction: 'Nourriture', transcription: 'flou', categorie: 'vie_quotidienne' },
    { phrase: 'Dɔ sran ?', traduction: 'Où est... ?', transcription: 'dɔ-sran', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  SÉNOUFO                     ║
  // ╚══════════════════════════════╝
  senoufo: [
    { phrase: 'Nagnon', traduction: 'Bienvenue / Bonjour', transcription: 'na-gnon', categorie: 'salutations' },
    { phrase: 'I tara wé ?', traduction: 'Tu vas bien ?', transcription: 'i-ta-ra-wé', categorie: 'salutations' },
    { phrase: 'Tara wé', traduction: 'Je vais bien', transcription: 'ta-ra-wé', categorie: 'salutations' },
    { phrase: 'Yalê', traduction: 'Merci', transcription: 'ya-lé', categorie: 'salutations' },
    { phrase: 'Kà wɛ', traduction: 'Au revoir', transcription: 'kà-weh', categorie: 'salutations' },
    { phrase: 'Ɔhɔ', traduction: 'Oui', transcription: 'ɔ-hɔ', categorie: 'salutations' },
    { phrase: 'Àyi', traduction: 'Non', transcription: 'à-yi', categorie: 'salutations' },
    { phrase: 'Kpur', traduction: 'Un (1)', transcription: 'kpur', categorie: 'chiffres' },
    { phrase: 'Pi', traduction: 'Deux (2)', transcription: 'pi', categorie: 'chiffres' },
    { phrase: 'Taara', traduction: 'Trois (3)', transcription: 'taa-ra', categorie: 'chiffres' },
    { phrase: 'Naŋ', traduction: 'Quatre (4)', transcription: 'naŋ', categorie: 'chiffres' },
    { phrase: 'Kɔɔru', traduction: 'Cinq (5)', transcription: 'kɔɔ-ru', categorie: 'chiffres' },
    { phrase: 'Lɛ yié ?', traduction: 'Combien coûte ?', transcription: 'leh-yié', categorie: 'marche' },
    { phrase: 'Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè', categorie: 'urgence' },
    { phrase: 'N pɔɔ', traduction: 'J\'ai mal', transcription: 'n-pɔɔ', categorie: 'urgence' },
    { phrase: 'Ji', traduction: 'Eau', transcription: 'ji', categorie: 'vie_quotidienne' },
    { phrase: 'Dumu', traduction: 'Nourriture', transcription: 'du-mu', categorie: 'vie_quotidienne' },
    { phrase: 'Sran ka ?', traduction: 'Où est... ?', transcription: 'sran-ka', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  AGNI                        ║
  // ╚══════════════════════════════╝
  agni: [
    { phrase: 'Akwaba', traduction: 'Bienvenue / Bonjour (accueil)', transcription: 'a-KWA-ba', categorie: 'salutations' },
    { phrase: 'Mɔrɔ', traduction: 'Bonjour', transcription: 'mɔ-rɔ', categorie: 'salutations' },
    { phrase: 'I kié ?', traduction: 'Comment tu vas ?', transcription: 'i-kié', categorie: 'salutations' },
    { phrase: 'Mé kié', traduction: 'Je vais bien', transcription: 'mé-kié', categorie: 'salutations' },
    { phrase: 'Meda wase', traduction: 'Merci', transcription: 'mé-da-wa-sé', categorie: 'salutations' },
    { phrase: 'Kɔ wɛ', traduction: 'Au revoir', transcription: 'kɔ-weh', categorie: 'salutations' },
    { phrase: 'Ɔhɔ', traduction: 'Oui', transcription: 'ɔ-hɔ', categorie: 'salutations' },
    { phrase: 'Daabi', traduction: 'Non', transcription: 'daa-bi', categorie: 'salutations' },
    { phrase: 'Baakɔ', traduction: 'Un (1)', transcription: 'baa-kɔ', categorie: 'chiffres' },
    { phrase: 'Abien', traduction: 'Deux (2)', transcription: 'a-bièn', categorie: 'chiffres' },
    { phrase: 'Aba', traduction: 'Trois (3)', transcription: 'a-ba', categorie: 'chiffres' },
    { phrase: 'Anan', traduction: 'Quatre (4)', transcription: 'a-nan', categorie: 'chiffres' },
    { phrase: 'Anum', traduction: 'Cinq (5)', transcription: 'a-num', categorie: 'chiffres' },
    { phrase: 'Wié wié ngue ?', traduction: 'Combien coûte ?', transcription: 'wié-wié-nguê', categorie: 'marche' },
    { phrase: 'Ɔsrɛ !', traduction: 'Au secours !', transcription: 'ɔ-sreh', categorie: 'urgence' },
    { phrase: 'M\'bɛ dimi', traduction: 'J\'ai mal', transcription: 'm-beh-di-mi', categorie: 'urgence' },
    { phrase: 'Nsuo', traduction: 'Eau', transcription: 'n-suo', categorie: 'vie_quotidienne' },
    { phrase: 'Aduane', traduction: 'Nourriture', transcription: 'a-dwa-né', categorie: 'vie_quotidienne' },
    { phrase: 'Ɛhene ?', traduction: 'Où est... ?', transcription: 'è-hé-né', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  GOURO                       ║
  // ╚══════════════════════════════╝
  gouro: [
    { phrase: 'Nouhan', traduction: 'Bienvenue / Bonjour', transcription: 'nou-han', categorie: 'salutations' },
    { phrase: 'I yi nɔ ?', traduction: 'Tu vas bien ?', transcription: 'i-yi-nɔ', categorie: 'salutations' },
    { phrase: 'Yi nɔ', traduction: 'Ça va bien', transcription: 'yi-nɔ', categorie: 'salutations' },
    { phrase: 'Yalê', traduction: 'Merci', transcription: 'ya-lé', categorie: 'salutations' },
    { phrase: 'Kôh bɛɛ', traduction: 'Au revoir', transcription: 'koh-bèè', categorie: 'salutations' },
    { phrase: 'Ôô', traduction: 'Oui', transcription: 'ôô', categorie: 'salutations' },
    { phrase: 'Wɔɔ', traduction: 'Non', transcription: 'wɔɔ', categorie: 'salutations' },
    { phrase: 'Kpɔ', traduction: 'Un (1)', transcription: 'kpɔ', categorie: 'chiffres' },
    { phrase: 'Pɛlɛ', traduction: 'Deux (2)', transcription: 'pè-lè', categorie: 'chiffres' },
    { phrase: 'Yaba', traduction: 'Trois (3)', transcription: 'ya-ba', categorie: 'chiffres' },
    { phrase: 'Naŋ', traduction: 'Quatre (4)', transcription: 'naŋ', categorie: 'chiffres' },
    { phrase: 'Nu', traduction: 'Cinq (5)', transcription: 'nu', categorie: 'chiffres' },
    { phrase: 'N\'gbiè ?', traduction: 'Combien coûte ?', transcription: 'n-gbié', categorie: 'marche' },
    { phrase: 'N\'kpli !', traduction: 'Au secours !', transcription: 'n-kpli', categorie: 'urgence' },
    { phrase: 'M\'dimi', traduction: 'J\'ai mal', transcription: 'm-di-mi', categorie: 'urgence' },
    { phrase: 'Nyi', traduction: 'Eau', transcription: 'nyi', categorie: 'vie_quotidienne' },
    { phrase: 'Manlɛ', traduction: 'Nourriture', transcription: 'man-lèh', categorie: 'vie_quotidienne' },
    { phrase: 'Dɔ sran ?', traduction: 'Où est... ?', transcription: 'dɔ-sran', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  GUÉRÉ                       ║
  // ╚══════════════════════════════╝
  guere: [
    { phrase: 'Wahon', traduction: 'Bienvenue / Bonjour', transcription: 'wa-hon', categorie: 'salutations' },
    { phrase: 'I pɔ ?', traduction: 'Comment tu vas ?', transcription: 'i-pɔ', categorie: 'salutations' },
    { phrase: 'M\'pɔ bɔɔ', traduction: 'Je vais bien', transcription: 'm-pɔ-bɔɔ', categorie: 'salutations' },
    { phrase: 'Gbagba', traduction: 'Courage / Merci', transcription: 'gba-gba', categorie: 'salutations' },
    { phrase: 'Kôh', traduction: 'Au revoir', transcription: 'koh', categorie: 'salutations' },
    { phrase: 'Ô', traduction: 'Oui', transcription: 'ô', categorie: 'salutations' },
    { phrase: 'Wɔɔ', traduction: 'Non', transcription: 'wɔɔ', categorie: 'salutations' },
    { phrase: 'Dɔ', traduction: 'Un (1)', transcription: 'dɔ', categorie: 'chiffres' },
    { phrase: 'Flɛ', traduction: 'Deux (2)', transcription: 'fleh', categorie: 'chiffres' },
    { phrase: 'Gbɔ', traduction: 'Trois (3)', transcription: 'gbɔ', categorie: 'chiffres' },
    { phrase: 'Nŋan', traduction: 'Quatre (4)', transcription: 'nŋan', categorie: 'chiffres' },
    { phrase: 'Wlee', traduction: 'Cinq (5)', transcription: 'wlee', categorie: 'chiffres' },
    { phrase: 'Gbɔ wié ?', traduction: 'Combien coûte ?', transcription: 'gbɔ-wié', categorie: 'marche' },
    { phrase: 'Dɛmɛ ! Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè', categorie: 'urgence' },
    { phrase: 'N gbɔ', traduction: 'J\'ai mal', transcription: 'n-gbɔ', categorie: 'urgence' },
    { phrase: 'Yi', traduction: 'Eau', transcription: 'yi', categorie: 'vie_quotidienne' },
    { phrase: 'Flou', traduction: 'Nourriture', transcription: 'flou', categorie: 'vie_quotidienne' },
    { phrase: 'Kua sran ?', traduction: 'Où est... ?', transcription: 'kua-sran', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  NOUCHI                      ║
  // ╚══════════════════════════════╝
  nouchi: [
    { phrase: 'Dégueu !', traduction: 'Salut ! / Quoi de neuf !', transcription: 'dé-gueu', categorie: 'salutations' },
    { phrase: 'Tu djo ?', traduction: 'Tu vas bien ? (fam.)', transcription: 'tu-djo', categorie: 'salutations' },
    { phrase: 'Ça va sec !', traduction: 'Ça va très bien !', transcription: 'ça-va-sec', categorie: 'salutations' },
    { phrase: 'Yako', traduction: 'Courage / Condoléances', transcription: 'ya-ko', categorie: 'salutations' },
    { phrase: 'On se voit !', traduction: 'À bientôt !', transcription: 'on-se-voit', categorie: 'salutations' },
    { phrase: 'Frérot', traduction: 'Mon frère / Mon ami', transcription: 'fré-rot', categorie: 'salutations' },
    { phrase: 'Wari', traduction: 'Argent', transcription: 'wa-ri', categorie: 'marche' },
    { phrase: 'C\'est chaud !', traduction: 'C\'est compliqué / difficile', transcription: 'c\'est-chaud', categorie: 'vie_quotidienne' },
    { phrase: 'Gorogoroti', traduction: 'Personne maligne / débrouillarde', transcription: 'go-ro-go-ro-ti', categorie: 'vie_quotidienne' },
    { phrase: 'Dôh', traduction: 'Vraiment ? / C\'est vrai !', transcription: 'dôh', categorie: 'vie_quotidienne' },
    { phrase: 'Sans chicotter', traduction: 'Sans hésiter / directement', transcription: 'sans-chi-co-ter', categorie: 'vie_quotidienne' },
    { phrase: 'Alloco', traduction: 'Banane plantain frite (plat de rue)', transcription: 'a-lo-co', categorie: 'vie_quotidienne' },
    { phrase: 'C\'est la même chose !', traduction: 'C\'est pareil', transcription: 'c\'est-la-même', categorie: 'vie_quotidienne' },
    { phrase: 'Bloublou', traduction: 'Tromper / Arnaquer', transcription: 'blou-blou', categorie: 'vie_quotidienne' },
    { phrase: 'Dieu-là !', traduction: 'Mon Dieu ! / Exclamation de surprise', transcription: 'dieu-là', categorie: 'vie_quotidienne' },
    { phrase: 'Tchatcher', traduction: 'Parler beaucoup / bavardage', transcription: 'tcha-cher', categorie: 'vie_quotidienne' },
    { phrase: 'Gaou', traduction: 'Naïf / niais', transcription: 'ga-ou', categorie: 'vie_quotidienne' },
    { phrase: 'Bra !', traduction: 'Viens ! / Allez !', transcription: 'bra', categorie: 'vie_quotidienne' },
  ],

  // ╔══════════════════════════════╗
  // ║  YACOUBA (DAN)               ║
  // ╚══════════════════════════════╝
  yacouba: [
    { phrase: 'Bii yo', traduction: 'Bonjour', transcription: 'bii-yo', categorie: 'salutations' },
    { phrase: 'Zo kié ?', traduction: 'Tu vas bien ?', transcription: 'zo-kié', categorie: 'salutations' },
    { phrase: 'Zo bɔɔ', traduction: 'Ça va bien', transcription: 'zo-bɔɔ', categorie: 'salutations' },
    { phrase: 'Yèkè', traduction: 'Merci / Bien', transcription: 'yè-kè', categorie: 'salutations' },
    { phrase: 'Kôh', traduction: 'Au revoir', transcription: 'koh', categorie: 'salutations' },
    { phrase: 'Ôô', traduction: 'Oui', transcription: 'ôô', categorie: 'salutations' },
    { phrase: 'Wɔ', traduction: 'Non', transcription: 'wɔ', categorie: 'salutations' },
    { phrase: 'Dɔ', traduction: 'Un (1)', transcription: 'dɔ', categorie: 'chiffres' },
    { phrase: 'Pɛɛ', traduction: 'Deux (2)', transcription: 'pɛɛ', categorie: 'chiffres' },
    { phrase: 'Tɔ', traduction: 'Trois (3)', transcription: 'tɔ', categorie: 'chiffres' },
    { phrase: 'Naŋ', traduction: 'Quatre (4)', transcription: 'naŋ', categorie: 'chiffres' },
    { phrase: 'Mɛɛ', traduction: 'Cinq (5)', transcription: 'mɛɛ', categorie: 'chiffres' },
    { phrase: 'Gbɔ yié ?', traduction: 'Combien coûte ?', transcription: 'gbɔ-yié', categorie: 'marche' },
    { phrase: 'Dɛmɛ ! Dɛmɛ !', traduction: 'Au secours !', transcription: 'dè-mè', categorie: 'urgence' },
    { phrase: 'N gbɔ', traduction: 'J\'ai mal', transcription: 'n-gbɔ', categorie: 'urgence' },
    { phrase: 'Yi', traduction: 'Eau', transcription: 'yi', categorie: 'vie_quotidienne' },
    { phrase: 'Dumu', traduction: 'Nourriture', transcription: 'du-mu', categorie: 'vie_quotidienne' },
    { phrase: 'Sran ka ?', traduction: 'Où est... ?', transcription: 'sran-ka', categorie: 'vie_quotidienne' },
  ],
};

// ─── Seed principal ──────────────────────────────────────────────────────────

async function main() {
  console.log('📚 Seed des phrases utiles pour les 9 langues MVP...\n');

  let created = 0;
  let skipped = 0;

  for (const [code, phrases] of Object.entries(PHRASES)) {
    const lang = await prisma.language.findUnique({ where: { code } });
    if (!lang) {
      console.log(`  ⚠️  Langue introuvable : ${code}`);
      continue;
    }

    console.log(`  📖 ${lang.nom} (${phrases.length} phrases)...`);

    for (const p of phrases) {
      // Éviter les doublons : même phrase + même langue
      const existing = await prisma.usefulPhrase.findFirst({
        where: { languageId: lang.id, phrase: p.phrase },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.usefulPhrase.create({
        data: {
          languageId:   lang.id,
          phrase:       p.phrase,
          traduction:   p.traduction,
          transcription: p.transcription || null,
          categorie:    p.categorie,
          status:       'PUBLISHED',
        },
      });
      created++;
    }

    console.log(`     ✅ ${lang.nom} — phrases configurées`);
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log('✅ Résumé phrases utiles :');
  console.log(`   • ${created} phrases créées`);
  console.log(`   • ${skipped} phrases déjà existantes (non modifiées)`);
  console.log('─────────────────────────────────────────────────');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
