// ==================== LES 16 NIVEAUX DU CURSUS ====================
const GRADE_LEVELS = [
  // ----- PRIMAIRE (passage auto, sauf CM2 → examen d'entrée en 6ème) -----
  { code: 'CP1',  nom: 'CP1',                    ordre: 1,  cycle: 'PRIMAIRE', passageMode: 'AUTO',   seuilPassage: 75, description: 'Éveil linguistique — alphabet, sons, vocabulaire de base.' },
  { code: 'CP2',  nom: 'CP2',                    ordre: 2,  cycle: 'PRIMAIRE', passageMode: 'AUTO',   seuilPassage: 75, description: 'Lecture syllabique avancée, premiers mots écrits.' },
  { code: 'CE1',  nom: 'CE1',                    ordre: 3,  cycle: 'PRIMAIRE', passageMode: 'AUTO',   seuilPassage: 75, description: 'Lecture de phrases, écriture, grammaire de base.' },
  { code: 'CE2',  nom: 'CE2',                    ordre: 4,  cycle: 'PRIMAIRE', passageMode: 'AUTO',   seuilPassage: 75, description: 'Production écrite courte, calcul du quotidien.' },
  { code: 'CM1',  nom: 'CM1',                    ordre: 5,  cycle: 'PRIMAIRE', passageMode: 'AUTO',   seuilPassage: 75, description: 'Compréhension de texte, conjugaison, expression orale.' },
  { code: 'CM2',  nom: 'CM2',                    ordre: 6,  cycle: 'PRIMAIRE', passageMode: 'COMITE', seuilPassage: 75, description: "Consolidation du primaire. Passage en 6ème sur examen validé par le comité d'experts." },
  // ----- COLLÈGE (passage auto, sauf 3ème → examen d'entrée en 2nde) -----
  { code: '6EME', nom: 'Classe de 6ème',         ordre: 7,  cycle: 'COLLEGE',  passageMode: 'AUTO',   seuilPassage: 75, description: 'Compréhension écrite et orale, vocabulaire thématique.' },
  { code: '5EME', nom: 'Classe de 5ème',         ordre: 8,  cycle: 'COLLEGE',  passageMode: 'AUTO',   seuilPassage: 75, description: 'Production écrite structurée, grammaire fonctionnelle.' },
  { code: '4EME', nom: 'Classe de 4ème',         ordre: 9,  cycle: 'COLLEGE',  passageMode: 'AUTO',   seuilPassage: 75, description: 'Lecture analytique, débat oral. Ouverture spécialisation métiers (Phase D).' },
  { code: '3EME', nom: 'Classe de 3ème',         ordre: 10, cycle: 'COLLEGE',  passageMode: 'COMITE', seuilPassage: 75, description: "Fin du premier cycle. Passage en 2nde sur examen validé par le comité d'experts." },
  // ----- LYCÉE (chaque palier validé par le comité) -----
  { code: '2NDE', nom: 'Classe de Seconde',      ordre: 11, cycle: 'LYCEE',    passageMode: 'COMITE', seuilPassage: 75, description: 'Littérature orale, analyse de textes. Validation par le comité.' },
  { code: '1ERE', nom: 'Classe de Première',     ordre: 12, cycle: 'LYCEE',    passageMode: 'COMITE', seuilPassage: 75, description: 'Traduction bidirectionnelle, rhétorique. Validation par le comité.' },
  { code: 'TLE',  nom: 'Classe de Terminale',    ordre: 13, cycle: 'LYCEE',    passageMode: 'COMITE', seuilPassage: 75, description: 'Certificat National de Maîtrise Linguistique (mention niveau Terminale) délivré sur examen final validé par le comité.' },
  // ----- PARCOURS CHERCHEUR (équivalent universitaire, sans noms de diplômes d'État) -----
  { code: 'CHERCHEUR_1', nom: 'Niveau Chercheur I',   ordre: 14, cycle: 'CHERCHEUR', passageMode: 'COMITE', seuilPassage: 75, description: 'Linguistique comparée, dialectologie. Validation par le comité.' },
  { code: 'CHERCHEUR_2', nom: 'Niveau Chercheur II',  ordre: 15, cycle: 'CHERCHEUR', passageMode: 'COMITE', seuilPassage: 75, description: 'Pédagogie, documentation de la langue. Validation par le comité.' },
  { code: 'CHERCHEUR_3', nom: 'Niveau Chercheur III', ordre: 16, cycle: 'CHERCHEUR', passageMode: 'COMITE', seuilPassage: 75, description: 'Travail de recherche — corpus, préservation, transmission. Validation par le comité.' },
];

// ==================== MODULES : CURSUS vs OUTILS LIBRES ====================
// Principe : « L'école est un cursus, la culture est un droit. »
// isCursus=true  → verrouillé tant que la classe minGradeOrdre n'est pas atteinte
// isCursus=false → toujours accessible (outils, patrimoine, services)
const CURRICULUM_MODULES = [
  // ----- Pilier 1 : Langue et Communication (cursus) -----
  { moduleKey: 'alphabet',         nom: 'Alphabet',            pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: true },
  { moduleKey: 'pronunciation',    nom: 'Prononciation',       pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: true },
  { moduleKey: 'quiz',             nom: 'Quiz',                pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: true },
  { moduleKey: 'phrases_utiles',   nom: 'Phrases Utiles',      pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 2, isCursus: true },
  { moduleKey: 'writing_practice', nom: "Pratique d'Écriture", pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 3, isCursus: true },
  { moduleKey: 'sens_mots',        nom: 'Sens des Mots',       pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 3, isCursus: true },
  { moduleKey: 'conjugation',      nom: 'Conjugaison',         pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 5, isCursus: true },
  // ----- Pilier 2 : Culture et Citoyenneté (cursus) -----
  { moduleKey: 'civisme',          nom: 'Civisme',             pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 6, isCursus: true },
  // ----- Pilier 3 : Pratique et Métiers (cursus) -----
  { moduleKey: 'mathematiques',    nom: 'Mathématiques',       pilier: 'PRATIQUE_METIERS',     minGradeOrdre: 4, isCursus: true },
  // ----- Outils et patrimoine : TOUJOURS LIBRES -----
  { moduleKey: 'dictionary',       nom: 'Dictionnaire',        pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'translator',       nom: 'Traducteur IA',       pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'sos',              nom: 'S.O.S.',              pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'premier_secours',  nom: 'Premiers Secours',    pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'musee',            nom: 'Musée',               pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'carte',            nom: 'Carte des Langues',   pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'monnaie',          nom: 'Monnaie',             pilier: 'PRATIQUE_METIERS',     minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'marche',           nom: 'Au Marché',           pilier: 'PRATIQUE_METIERS',     minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'proverbes',        nom: 'Proverbes',           pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'nouchi',           nom: 'Nouchi',              pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'cultural',         nom: 'Culture',             pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'arbres',           nom: 'Arbres',              pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'videos',           nom: 'Vidéos',              pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'images',           nom: 'Images',              pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'repetitor',        nom: 'RÉPÉTO',              pilier: 'LANGUE_COMMUNICATION', minGradeOrdre: 1, isCursus: false },
  { moduleKey: 'text_content',     nom: 'Textes et Récits',    pilier: 'CULTURE_CITOYENNETE',  minGradeOrdre: 1, isCursus: false },
];

module.exports = { GRADE_LEVELS, CURRICULUM_MODULES };
