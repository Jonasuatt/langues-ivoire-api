const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// DICTIONNAIRE V4 — Objectif 200+ mots par langue
// Catégories : insectes, plantes, vêtements, sentiments,
// pronoms, météo, animaux sauvages, actions quotidiennes,
// parties du corps complémentaires, outils, cérémonies
// ============================================================

const DICTIONARY_V4 = {
  baoule: [
    // --- Animaux sauvages ---
    { mot: 'Zɛ', transcription: 'zɛ', traduction: 'Lion', categorie: 'animaux' },
    { mot: 'Kɔlɔ', transcription: 'kɔlɔ', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Gbɛn', transcription: 'gbɛn', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Mɛn', transcription: 'mɛn', traduction: 'Crocodile', categorie: 'animaux' },
    { mot: 'Nannin', transcription: 'nannin', traduction: 'Boeuf / Vache', categorie: 'animaux' },
    { mot: 'Adjran', transcription: 'adjran', traduction: 'Araignée', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Mruɛ', transcription: 'mruɛ', traduction: 'Moustique', categorie: 'animaux', exemplePhrase: 'Mruɛ kpan min', exempleTraduction: 'Le moustique m\'a piqué' },
    { mot: 'Njuɛ', transcription: 'njuɛ', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Mmuanmuan', transcription: 'mmuanmuan', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Awɛ', transcription: 'awɛ', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Aklunjuɛ', transcription: 'aklunjuɛ', traduction: 'Joie / Bonheur', categorie: 'expressions', exemplePhrase: 'Aklunjuɛ o min klun', exempleTraduction: 'J\'ai de la joie dans le coeur' },
    { mot: 'Sɛ', transcription: 'sɛ', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Sran', transcription: 'sran', traduction: 'Tristesse', categorie: 'expressions' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Colère', categorie: 'expressions' },
    { mot: 'Srɛ', transcription: 'srɛ', traduction: 'Peur', categorie: 'expressions', exemplePhrase: 'Srɛ kun min', exempleTraduction: 'J\'ai peur' },
    // --- Vêtements ---
    { mot: 'Tralɛ kpɔnman', transcription: 'tralɛ kpɔnman', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Tralɛ dan', transcription: 'tralɛ dan', traduction: 'Robe / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Ngbabua', transcription: 'ngbabua', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Kɔle', transcription: 'kɔle', traduction: 'Chapeau / Coiffe', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Timuɛn', transcription: 'timuɛn', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kɔmin', transcription: 'kɔmin', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Wati', transcription: 'wati', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Bue', transcription: 'bue', traduction: 'Épaule', categorie: 'corps' },
    { mot: 'Ngban', transcription: 'ngban', traduction: 'Genou', categorie: 'corps' },
    { mot: 'Sa nun', transcription: 'sa nun', traduction: 'Doigt', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Wunnzin', transcription: 'wunnzin', traduction: 'Se laver / Se baigner', categorie: 'verbes', exemplePhrase: 'N su wunnzin', exempleTraduction: 'Je me lave' },
    { mot: 'Cɛcɛ', transcription: 'cɛcɛ', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Yɔ', transcription: 'yɔ', traduction: 'Puiser (l\'eau)', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Piler (foutou)', categorie: 'verbes' },
    { mot: 'Wu', transcription: 'wu', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Bo', transcription: 'bo', traduction: 'Frapper / Battre', categorie: 'verbes' },
    { mot: 'Fite', transcription: 'fite', traduction: 'Prier', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Si', transcription: 'si', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Tin', transcription: 'tin', traduction: 'Construire', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'Min', transcription: 'min', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'Ɔ', transcription: 'ɔ', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'E', transcription: 'e', traduction: 'Nous', categorie: 'expressions' },
    { mot: 'Amun', transcription: 'amun', traduction: 'Vous', categorie: 'expressions' },
    { mot: 'Be', transcription: 'be', traduction: 'Ils / Elles', categorie: 'expressions' },
    // --- Plantes ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Flɛ', transcription: 'flɛ', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Ɛhue', transcription: 'ɛhue', traduction: 'Feuille', categorie: 'nature' },
    { mot: 'Waka', transcription: 'waka', traduction: 'Bois / Bâton', categorie: 'nature' },
    // --- Météo ---
    { mot: 'Ayrɛ', transcription: 'ayrɛ', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Nzuɛ blɛ', transcription: 'nzuɛ blɛ', traduction: 'Saison des pluies', categorie: 'nature' },
  ],

  dioula: [
    // --- Animaux sauvages ---
    { mot: 'Jara', transcription: 'jara', traduction: 'Lion', categorie: 'animaux', exemplePhrase: 'Jara ye fanga tigɛ ye', exempleTraduction: 'Le lion est le roi de la force' },
    { mot: 'Sɔn', transcription: 'sɔn', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Kɔɔri', transcription: 'kɔɔri', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Bama', transcription: 'bama', traduction: 'Crocodile', categorie: 'animaux' },
    { mot: 'Mali', transcription: 'mali', traduction: 'Hippopotame', categorie: 'animaux' },
    { mot: 'Baninkɔnɔ', transcription: 'baninkɔnɔ', traduction: 'Lézard', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Sumungu', transcription: 'sumungu', traduction: 'Moustique', categorie: 'animaux' },
    { mot: 'Nɛnkumu', transcription: 'nɛnkumu', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Mɔnɔn', transcription: 'mɔnɔn', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Kami', transcription: 'kami', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Nisɔndiya', transcription: 'nisɔndiya', traduction: 'Joie / Bonheur', categorie: 'expressions', exemplePhrase: 'Nisɔndiya bɛ n la', exempleTraduction: 'J\'ai de la joie' },
    { mot: 'Kanuya', transcription: 'kanuya', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Dusukasi', transcription: 'dusukasi', traduction: 'Tristesse', categorie: 'expressions' },
    { mot: 'Dimiya', transcription: 'dimiya', traduction: 'Colère', categorie: 'expressions' },
    { mot: 'Siran', transcription: 'siran', traduction: 'Peur / Avoir peur', categorie: 'expressions', exemplePhrase: 'N siranna', exempleTraduction: 'J\'ai eu peur' },
    // --- Vêtements ---
    { mot: 'Kurusi', transcription: 'kurusi', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Dereke', transcription: 'dereke', traduction: 'Chemise', categorie: 'vie_quotidienne' },
    { mot: 'Fani', transcription: 'fani', traduction: 'Pagne / Tissu', categorie: 'vie_quotidienne' },
    { mot: 'Sabara', transcription: 'sabara', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Fula', transcription: 'fula', traduction: 'Chapeau', categorie: 'vie_quotidienne' },
    { mot: 'Gɛlɛn', transcription: 'gɛlɛn', traduction: 'Ceinture', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Kunsigi', transcription: 'kunsigi', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kan', transcription: 'kan', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Kugolo', transcription: 'kugolo', traduction: 'Épaule', categorie: 'corps' },
    { mot: 'Kungolo', transcription: 'kungolo', traduction: 'Genou', categorie: 'corps' },
    { mot: 'Bolokɔni', transcription: 'bolokɔni', traduction: 'Doigt', categorie: 'corps' },
    { mot: 'Nunbara', transcription: 'nunbara', traduction: 'Langue (organe)', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Ko', transcription: 'ko', traduction: 'Se laver', categorie: 'verbes', exemplePhrase: 'N bɛ ko', exempleTraduction: 'Je me lave' },
    { mot: 'Balibali', transcription: 'balibali', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Ji bɔ', transcription: 'ji bɔ', traduction: 'Puiser l\'eau', categorie: 'verbes' },
    { mot: 'Suli', transcription: 'suli', traduction: 'Piler', categorie: 'verbes' },
    { mot: 'Kari', transcription: 'kari', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Delili kɛ', transcription: 'delili kɛ', traduction: 'Prier', categorie: 'verbes' },
    { mot: 'Dɔnkili la', transcription: 'dɔnkili la', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Dɔn', transcription: 'dɔn', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Jɔ', transcription: 'jɔ', traduction: 'Construire', categorie: 'verbes' },
    { mot: 'Kunu', transcription: 'kunu', traduction: 'Semer / Planter', categorie: 'verbes' },
    { mot: 'Tigɛ', transcription: 'tigɛ', traduction: 'Couper', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'Ne', transcription: 'ne', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'A', transcription: 'a', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'An', transcription: 'an', traduction: 'Nous', categorie: 'expressions' },
    { mot: 'Aw', transcription: 'aw', traduction: 'Vous', categorie: 'expressions' },
    { mot: 'U', transcription: 'u', traduction: 'Ils / Elles', categorie: 'expressions' },
    // --- Plantes ---
    { mot: 'Bin', transcription: 'bin', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Fugalan', transcription: 'fugalan', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Furakala', transcription: 'furakala', traduction: 'Feuille', categorie: 'nature' },
    { mot: 'Iri', transcription: 'iri', traduction: 'Graine / Semence', categorie: 'nature' },
    // --- Météo ---
    { mot: 'Tlema', transcription: 'tlema', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Samiyɛ', transcription: 'samiyɛ', traduction: 'Saison des pluies / Hivernage', categorie: 'nature' },
    { mot: 'Nɛnɛ', transcription: 'nɛnɛ', traduction: 'Fraîcheur / Harmattan', categorie: 'nature' },
    // --- Outils ---
    { mot: 'Daba', transcription: 'daba', traduction: 'Houe / Daba', categorie: 'habitat', exemplePhrase: 'N bɛ daba la foro la', exempleTraduction: 'Je travaille avec la houe au champ' },
    { mot: 'Jɛlɛn', transcription: 'jɛlɛn', traduction: 'Hache', categorie: 'habitat' },
    { mot: 'Bɛɛn', transcription: 'bɛɛn', traduction: 'Panier', categorie: 'habitat' },
    { mot: 'Jɛ', transcription: 'jɛ', traduction: 'Calebasse', categorie: 'habitat' },
  ],

  bete: [
    // --- Animaux sauvages ---
    { mot: 'Zlan', transcription: 'zlan', traduction: 'Lion / Panthère', categorie: 'animaux' },
    { mot: 'Wlɛn', transcription: 'wlɛn', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Gbè', transcription: 'gbè', traduction: 'Crocodile', categorie: 'animaux' },
    { mot: 'Nɔɔ', transcription: 'nɔɔ', traduction: 'Vache / Boeuf', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Mruɛ', transcription: 'mruɛ', traduction: 'Moustique', categorie: 'animaux' },
    { mot: 'Njuɛ', transcription: 'njuɛ', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Mma', transcription: 'mma', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Awɛ', transcription: 'awɛ', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Klunjuɛ', transcription: 'klunjuɛ', traduction: 'Joie', categorie: 'expressions' },
    { mot: 'Klo', transcription: 'klo', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Colère', categorie: 'expressions' },
    { mot: 'Srɛ', transcription: 'srɛ', traduction: 'Peur', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Trɔ kpa', transcription: 'trɔ kpa', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Trɔ dan', transcription: 'trɔ dan', traduction: 'Robe / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Gbabua', transcription: 'gbabua', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Kɔle', transcription: 'kɔle', traduction: 'Chapeau', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Zu wli', transcription: 'zu wli', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kɔmin', transcription: 'kɔmin', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Wati', transcription: 'wati', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Bue', transcription: 'bue', traduction: 'Épaule', categorie: 'corps' },
    { mot: 'Gbla nun', transcription: 'gbla nun', traduction: 'Doigt', categorie: 'corps' },
    { mot: 'Nuan', transcription: 'nuan', traduction: 'Langue (organe)', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Wunnzin', transcription: 'wunnzin', traduction: 'Se laver', categorie: 'verbes' },
    { mot: 'Cɛcɛ', transcription: 'cɛcɛ', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Gbo yɔ', transcription: 'gbo yɔ', traduction: 'Puiser l\'eau', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Piler', categorie: 'verbes' },
    { mot: 'Wu', transcription: 'wu', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Bo', transcription: 'bo', traduction: 'Frapper', categorie: 'verbes' },
    { mot: 'Glɔ', transcription: 'glɔ', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Si', transcription: 'si', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Tin', transcription: 'tin', traduction: 'Construire', categorie: 'verbes' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Couper', categorie: 'verbes' },
    { mot: 'Klu', transcription: 'klu', traduction: 'Semer / Planter', categorie: 'verbes' },
    { mot: 'Zri', transcription: 'zri', traduction: 'Laver (vêtement)', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'N', transcription: 'n', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'A', transcription: 'a', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'E', transcription: 'e', traduction: 'Nous', categorie: 'expressions' },
    { mot: 'Mi', transcription: 'mi', traduction: 'Vous', categorie: 'expressions' },
    { mot: 'U', transcription: 'u', traduction: 'Ils / Elles', categorie: 'expressions' },
    // --- Plantes ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Flɛ', transcription: 'flɛ', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Fui', transcription: 'fui', traduction: 'Feuille', categorie: 'nature' },
    // --- Nourriture complémentaire ---
    { mot: 'Baga', transcription: 'baga', traduction: 'Manioc', categorie: 'nourriture' },
    { mot: 'Kpa', transcription: 'kpa', traduction: 'Viande', categorie: 'nourriture' },
    { mot: 'Drui nyo', transcription: 'drui nyo', traduction: 'Huile de palme', categorie: 'nourriture' },
    // --- Outils ---
    { mot: 'Daba', transcription: 'daba', traduction: 'Houe', categorie: 'habitat' },
    { mot: 'Gble', transcription: 'gble', traduction: 'Hache', categorie: 'habitat' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Panier', categorie: 'habitat' },
    { mot: 'Kpè', transcription: 'kpè', traduction: 'Calebasse', categorie: 'habitat' },
    // --- Nature complémentaire ---
    { mot: 'Wlɛ', transcription: 'wlɛ', traduction: 'Montagne / Colline', categorie: 'nature' },
    { mot: 'Sila', transcription: 'sila', traduction: 'Pierre / Rocher', categorie: 'nature' },
    { mot: 'Dro blɛ', transcription: 'dro blɛ', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Gbô blɛ', transcription: 'gbô blɛ', traduction: 'Saison des pluies', categorie: 'nature' },
    // --- Expressions complémentaires ---
    { mot: 'N klo ɔ', transcription: 'n klo ɔ', traduction: 'Je t\'aime', categorie: 'expressions' },
    { mot: 'Gbahon kpa', transcription: 'gbahon kpa', traduction: 'Bonne journée', categorie: 'salutations' },
    { mot: 'Kpa-a sɛ', transcription: 'kpa-a sɛ', traduction: 'Merci beaucoup', categorie: 'salutations' },
  ],

  senoufo: [
    // --- Animaux sauvages ---
    { mot: 'Jara', transcription: 'jara', traduction: 'Lion', categorie: 'animaux' },
    { mot: 'Sɔn', transcription: 'sɔn', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Kɔɔri', transcription: 'kɔɔri', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Bama', transcription: 'bama', traduction: 'Crocodile', categorie: 'animaux' },
    { mot: 'Bli', transcription: 'bli', traduction: 'Chèvre', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Sumungu', transcription: 'sumungu', traduction: 'Moustique', categorie: 'animaux' },
    { mot: 'Nɛnkumu', transcription: 'nɛnkumu', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Mɔnɔn', transcription: 'mɔnɔn', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Kami', transcription: 'kami', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Nisɔndiya', transcription: 'nisɔndiya', traduction: 'Joie', categorie: 'expressions' },
    { mot: 'Kanuya', transcription: 'kanuya', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Dusukasi', transcription: 'dusukasi', traduction: 'Tristesse', categorie: 'expressions' },
    { mot: 'Siran', transcription: 'siran', traduction: 'Peur', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Kurusi', transcription: 'kurusi', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Fani', transcription: 'fani', traduction: 'Pagne / Tissu', categorie: 'vie_quotidienne' },
    { mot: 'Sabara', transcription: 'sabara', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Fula', transcription: 'fula', traduction: 'Chapeau', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Kunsigi', transcription: 'kunsigi', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kan', transcription: 'kan', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Kɔ', transcription: 'kɔ', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Bolokɔni', transcription: 'bolokɔni', traduction: 'Doigt', categorie: 'corps' },
    { mot: 'Ɲin', transcription: 'ɲin', traduction: 'Dent', categorie: 'corps' },
    { mot: 'Nɛnbara', transcription: 'nɛnbara', traduction: 'Langue (organe)', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Ko', transcription: 'ko', traduction: 'Se laver', categorie: 'verbes' },
    { mot: 'Balibali', transcription: 'balibali', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Ji bɔ', transcription: 'ji bɔ', traduction: 'Puiser l\'eau', categorie: 'verbes' },
    { mot: 'Suli', transcription: 'suli', traduction: 'Piler', categorie: 'verbes' },
    { mot: 'Kari', transcription: 'kari', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Dɔnkili', transcription: 'dɔnkili', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Dɔn', transcription: 'dɔn', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Jɔ', transcription: 'jɔ', traduction: 'Construire', categorie: 'verbes' },
    { mot: 'Tigɛ', transcription: 'tigɛ', traduction: 'Couper', categorie: 'verbes' },
    { mot: 'Kunu', transcription: 'kunu', traduction: 'Semer / Planter', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'Ne', transcription: 'ne', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'A', transcription: 'a', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'An', transcription: 'an', traduction: 'Nous', categorie: 'expressions' },
    { mot: 'Aw', transcription: 'aw', traduction: 'Vous', categorie: 'expressions' },
    // --- Plantes ---
    { mot: 'Bin', transcription: 'bin', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Fugalan', transcription: 'fugalan', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Fura', transcription: 'fura', traduction: 'Feuille', categorie: 'nature' },
    { mot: 'Yiri', transcription: 'yiri', traduction: 'Arbre', categorie: 'nature' },
    // --- Nourriture complémentaire ---
    { mot: 'Dɛgɛ', transcription: 'dɛgɛ', traduction: 'Manioc', categorie: 'nourriture' },
    { mot: 'Tulu', transcription: 'tulu', traduction: 'Huile', categorie: 'nourriture' },
    { mot: 'Sukaro', transcription: 'sukaro', traduction: 'Sucre', categorie: 'nourriture' },
    // --- Outils ---
    { mot: 'Daba', transcription: 'daba', traduction: 'Houe', categorie: 'habitat' },
    { mot: 'Jɛlɛn', transcription: 'jɛlɛn', traduction: 'Hache', categorie: 'habitat' },
    { mot: 'Bɛɛn', transcription: 'bɛɛn', traduction: 'Panier', categorie: 'habitat' },
    // --- Traditions ---
    { mot: 'Poro', transcription: 'poro', traduction: 'Initiation sacrée / Bois sacré', categorie: 'spiritualite', exemplePhrase: 'Poro ye sinangwiya ye', exempleTraduction: 'Le Poro est une tradition sacrée' },
    { mot: 'Balafon', transcription: 'balafon', traduction: 'Instrument de musique traditionnel', categorie: 'spiritualite' },
    { mot: 'Boloy', transcription: 'boloy', traduction: 'Masque sacré', categorie: 'spiritualite' },
    // --- Météo ---
    { mot: 'Tlema', transcription: 'tlema', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Samiyɛ', transcription: 'samiyɛ', traduction: 'Saison des pluies', categorie: 'nature' },
  ],

  agni: [
    // --- Animaux sauvages ---
    { mot: 'Gyata', transcription: 'gyata', traduction: 'Lion', categorie: 'animaux' },
    { mot: 'Kwaku', transcription: 'kwaku', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Akyekyere', transcription: 'akyekyere', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Dɛnkyɛm', transcription: 'dɛnkyɛm', traduction: 'Crocodile', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Ntontom', transcription: 'ntontom', traduction: 'Moustique', categorie: 'animaux' },
    { mot: 'Njuɛ', transcription: 'njuɛ', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Tetea', transcription: 'tetea', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Awɛ', transcription: 'awɛ', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Aklunjuɛ', transcription: 'aklunjuɛ', traduction: 'Joie', categorie: 'expressions' },
    { mot: 'Klolɛ', transcription: 'klolɛ', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Awlabɔ', transcription: 'awlabɔ', traduction: 'Tristesse', categorie: 'expressions' },
    { mot: 'Srɛ', transcription: 'srɛ', traduction: 'Peur', categorie: 'expressions' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Colère', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Tralɛ kpɔnman', transcription: 'tralɛ kpɔnman', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Tralɛ dan', transcription: 'tralɛ dan', traduction: 'Robe / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Ngbabua', transcription: 'ngbabua', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Kɔle', transcription: 'kɔle', traduction: 'Chapeau', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Timuɛn', transcription: 'timuɛn', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kɔmin', transcription: 'kɔmin', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Wati', transcription: 'wati', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Sa nun', transcription: 'sa nun', traduction: 'Doigt', categorie: 'corps' },
    { mot: 'Ngban', transcription: 'ngban', traduction: 'Genou', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Wunnzin', transcription: 'wunnzin', traduction: 'Se laver', categorie: 'verbes' },
    { mot: 'Cɛcɛ', transcription: 'cɛcɛ', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Yɔ', transcription: 'yɔ', traduction: 'Puiser l\'eau', categorie: 'verbes' },
    { mot: 'Bo', transcription: 'bo', traduction: 'Frapper', categorie: 'verbes' },
    { mot: 'To', transcription: 'to', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Si', transcription: 'si', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Tin', transcription: 'tin', traduction: 'Construire', categorie: 'verbes' },
    { mot: 'Suan', transcription: 'suan', traduction: 'Apprendre', categorie: 'verbes' },
    { mot: 'Kle', transcription: 'kle', traduction: 'Montrer / Enseigner', categorie: 'verbes' },
    { mot: 'Klɛ', transcription: 'klɛ', traduction: 'Écrire', categorie: 'verbes' },
    { mot: 'Su', transcription: 'su', traduction: 'Pleurer', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'Min', transcription: 'min', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'Ɔ', transcription: 'ɔ', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'E', transcription: 'e', traduction: 'Nous', categorie: 'expressions' },
    { mot: 'Amun', transcription: 'amun', traduction: 'Vous', categorie: 'expressions' },
    // --- Plantes ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Flɛ', transcription: 'flɛ', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Ɛhue', transcription: 'ɛhue', traduction: 'Feuille', categorie: 'nature' },
    // --- Outils ---
    { mot: 'Daba', transcription: 'daba', traduction: 'Houe', categorie: 'habitat' },
    { mot: 'Gble', transcription: 'gble', traduction: 'Hache', categorie: 'habitat' },
    { mot: 'Kpè', transcription: 'kpè', traduction: 'Calebasse', categorie: 'habitat' },
    // --- Météo ---
    { mot: 'Ayrɛ', transcription: 'ayrɛ', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Nzuɛ blɛ', transcription: 'nzuɛ blɛ', traduction: 'Saison des pluies', categorie: 'nature' },
    // --- Nourriture ---
    { mot: 'Baga', transcription: 'baga', traduction: 'Manioc', categorie: 'nourriture' },
    { mot: 'Kpa', transcription: 'kpa', traduction: 'Viande', categorie: 'nourriture' },
  ],

  gouro: [
    // --- Animaux sauvages ---
    { mot: 'Zlan', transcription: 'zlan', traduction: 'Lion', categorie: 'animaux' },
    { mot: 'Wlɛn', transcription: 'wlɛn', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Gbè', transcription: 'gbè', traduction: 'Crocodile', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Mruɛ', transcription: 'mruɛ', traduction: 'Moustique', categorie: 'animaux' },
    { mot: 'Njuɛ', transcription: 'njuɛ', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Mma', transcription: 'mma', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Awɛ', transcription: 'awɛ', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Klunjuɛ', transcription: 'klunjuɛ', traduction: 'Joie', categorie: 'expressions' },
    { mot: 'Klo', transcription: 'klo', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Colère', categorie: 'expressions' },
    { mot: 'Srɛ', transcription: 'srɛ', traduction: 'Peur', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Trɔ kpa', transcription: 'trɔ kpa', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Trɔ dan', transcription: 'trɔ dan', traduction: 'Robe / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Gbabua', transcription: 'gbabua', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Kɔle', transcription: 'kɔle', traduction: 'Chapeau', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Zu wli', transcription: 'zu wli', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kɔmin', transcription: 'kɔmin', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Wati', transcription: 'wati', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Bue', transcription: 'bue', traduction: 'Épaule', categorie: 'corps' },
    { mot: 'Kla nun', transcription: 'kla nun', traduction: 'Doigt', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Wunnzin', transcription: 'wunnzin', traduction: 'Se laver', categorie: 'verbes' },
    { mot: 'Cɛcɛ', transcription: 'cɛcɛ', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Yɔ', transcription: 'yɔ', traduction: 'Puiser l\'eau', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Piler', categorie: 'verbes' },
    { mot: 'Glɔ', transcription: 'glɔ', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Si', transcription: 'si', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Tin', transcription: 'tin', traduction: 'Construire', categorie: 'verbes' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Couper', categorie: 'verbes' },
    { mot: 'Klu', transcription: 'klu', traduction: 'Planter / Semer', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'N', transcription: 'n', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'A', transcription: 'a', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'E', transcription: 'e', traduction: 'Nous', categorie: 'expressions' },
    // --- Plantes & Nature ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Flɛ', transcription: 'flɛ', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Fui', transcription: 'fui', traduction: 'Feuille', categorie: 'nature' },
    { mot: 'Wlɛ', transcription: 'wlɛ', traduction: 'Montagne', categorie: 'nature' },
    { mot: 'Sila', transcription: 'sila', traduction: 'Pierre', categorie: 'nature' },
    // --- Outils ---
    { mot: 'Daba', transcription: 'daba', traduction: 'Houe', categorie: 'habitat' },
    { mot: 'Gble', transcription: 'gble', traduction: 'Hache', categorie: 'habitat' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Panier', categorie: 'habitat' },
    { mot: 'Kpè', transcription: 'kpè', traduction: 'Calebasse', categorie: 'habitat' },
    // --- Nourriture ---
    { mot: 'Kpa', transcription: 'kpa', traduction: 'Viande', categorie: 'nourriture' },
    { mot: 'Drui nyo', transcription: 'drui nyo', traduction: 'Huile de palme', categorie: 'nourriture' },
    // --- Traditions ---
    { mot: 'Zaouli', transcription: 'zaouli', traduction: 'Danse traditionnelle sacrée Gouro', categorie: 'spiritualite', exemplePhrase: 'Zaouli ye gle naan', exempleTraduction: 'Le Zaouli est une danse du village' },
    { mot: 'Goli', transcription: 'goli', traduction: 'Masque sacré Gouro', categorie: 'spiritualite' },
  ],

  guere: [
    // --- Animaux sauvages ---
    { mot: 'Zlan', transcription: 'zlan', traduction: 'Lion / Panthère', categorie: 'animaux' },
    { mot: 'Wlɛn', transcription: 'wlɛn', traduction: 'Singe', categorie: 'animaux' },
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Tortue', categorie: 'animaux' },
    { mot: 'Gbè', transcription: 'gbè', traduction: 'Crocodile', categorie: 'animaux' },
    // --- Insectes ---
    { mot: 'Mruɛ', transcription: 'mruɛ', traduction: 'Moustique', categorie: 'animaux' },
    { mot: 'Njuɛ', transcription: 'njuɛ', traduction: 'Mouche', categorie: 'animaux' },
    { mot: 'Mma', transcription: 'mma', traduction: 'Fourmi', categorie: 'animaux' },
    { mot: 'Awɛ', transcription: 'awɛ', traduction: 'Abeille', categorie: 'animaux' },
    // --- Sentiments ---
    { mot: 'Klunjuɛ', transcription: 'klunjuɛ', traduction: 'Joie', categorie: 'expressions' },
    { mot: 'Klo', transcription: 'klo', traduction: 'Amour', categorie: 'expressions' },
    { mot: 'Ya', transcription: 'ya', traduction: 'Colère', categorie: 'expressions' },
    { mot: 'Srɛ', transcription: 'srɛ', traduction: 'Peur', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Trɔ kpa', transcription: 'trɔ kpa', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Trɔ dan', transcription: 'trɔ dan', traduction: 'Robe / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Gbabua', transcription: 'gbabua', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    { mot: 'Kɔle', transcription: 'kɔle', traduction: 'Chapeau', categorie: 'vie_quotidienne' },
    // --- Corps complémentaire ---
    { mot: 'Zu wli', transcription: 'zu wli', traduction: 'Cheveux', categorie: 'corps' },
    { mot: 'Kɔmin', transcription: 'kɔmin', traduction: 'Cou', categorie: 'corps' },
    { mot: 'Wati', transcription: 'wati', traduction: 'Dos', categorie: 'corps' },
    { mot: 'Bue', transcription: 'bue', traduction: 'Épaule', categorie: 'corps' },
    { mot: 'Gbla nun', transcription: 'gbla nun', traduction: 'Doigt', categorie: 'corps' },
    // --- Actions quotidiennes ---
    { mot: 'Wunnzin', transcription: 'wunnzin', traduction: 'Se laver', categorie: 'verbes' },
    { mot: 'Cɛcɛ', transcription: 'cɛcɛ', traduction: 'Balayer', categorie: 'verbes' },
    { mot: 'Yɔ', transcription: 'yɔ', traduction: 'Puiser l\'eau', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Piler', categorie: 'verbes' },
    { mot: 'Wu', transcription: 'wu', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Glɔ', transcription: 'glɔ', traduction: 'Chanter', categorie: 'verbes' },
    { mot: 'Si', transcription: 'si', traduction: 'Danser', categorie: 'verbes' },
    { mot: 'Tin', transcription: 'tin', traduction: 'Construire', categorie: 'verbes' },
    { mot: 'Gbê', transcription: 'gbê', traduction: 'Couper', categorie: 'verbes' },
    { mot: 'Klu', transcription: 'klu', traduction: 'Planter / Semer', categorie: 'verbes' },
    { mot: 'Zri', transcription: 'zri', traduction: 'Laver (vêtement)', categorie: 'verbes' },
    // --- Pronoms ---
    { mot: 'N', transcription: 'n', traduction: 'Je / Moi', categorie: 'expressions' },
    { mot: 'I', transcription: 'i', traduction: 'Tu / Toi', categorie: 'expressions' },
    { mot: 'A', transcription: 'a', traduction: 'Il / Elle', categorie: 'expressions' },
    { mot: 'E', transcription: 'e', traduction: 'Nous', categorie: 'expressions' },
    { mot: 'Mi', transcription: 'mi', traduction: 'Vous', categorie: 'expressions' },
    // --- Plantes & Nature ---
    { mot: 'Bua', transcription: 'bua', traduction: 'Herbe', categorie: 'nature' },
    { mot: 'Flɛ', transcription: 'flɛ', traduction: 'Fleur', categorie: 'nature' },
    { mot: 'Fui', transcription: 'fui', traduction: 'Feuille', categorie: 'nature' },
    { mot: 'Wlɛ', transcription: 'wlɛ', traduction: 'Montagne', categorie: 'nature' },
    { mot: 'Sila', transcription: 'sila', traduction: 'Pierre', categorie: 'nature' },
    // --- Outils ---
    { mot: 'Daba', transcription: 'daba', traduction: 'Houe', categorie: 'habitat' },
    { mot: 'Gble', transcription: 'gble', traduction: 'Hache', categorie: 'habitat' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Panier', categorie: 'habitat' },
    { mot: 'Kpè', transcription: 'kpè', traduction: 'Calebasse', categorie: 'habitat' },
    // --- Nourriture ---
    { mot: 'Kpa', transcription: 'kpa', traduction: 'Viande', categorie: 'nourriture' },
    { mot: 'Drui nyo', transcription: 'drui nyo', traduction: 'Huile de palme', categorie: 'nourriture' },
    // --- Traditions ---
    { mot: 'Zɛ', transcription: 'zɛ', traduction: 'Masque de guerre sacré', categorie: 'spiritualite' },
    { mot: 'Gla', transcription: 'gla', traduction: 'Danse de guerre traditionnelle', categorie: 'spiritualite' },
    // --- Météo ---
    { mot: 'Dro blɛ', transcription: 'dro blɛ', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Gbô blɛ', transcription: 'gbô blɛ', traduction: 'Saison des pluies', categorie: 'nature' },
  ],

  nouchi: [
    // --- Verbes complémentaires ---
    { mot: 'Tchatcher', transcription: 'tchatcher', traduction: 'Parler beaucoup / Bavarder', categorie: 'verbes', exemplePhrase: 'Tu tchatches trop dèh', exempleTraduction: 'Tu parles trop !' },
    { mot: 'Zuer', transcription: 'zuer', traduction: 'Insulter / Se moquer', categorie: 'verbes' },
    { mot: 'Caler', transcription: 'caler', traduction: 'Abandonner / Laisser tomber', categorie: 'verbes', exemplePhrase: 'Il a calé l\'affaire', exempleTraduction: 'Il a abandonné' },
    { mot: 'Tracer', transcription: 'tracer', traduction: 'Partir vite / S\'enfuir', categorie: 'verbes', exemplePhrase: 'Il a tracé en vitesse', exempleTraduction: 'Il est parti très vite' },
    { mot: 'Doigter', transcription: 'doigter', traduction: 'Montrer du doigt / Dénoncer', categorie: 'verbes' },
    { mot: 'Chercher', transcription: 'chercher', traduction: 'Travailler dur / Se battre pour gagner sa vie', categorie: 'verbes', exemplePhrase: 'Je suis en train de chercher', exempleTraduction: 'Je travaille dur pour m\'en sortir' },
    { mot: 'Casser', transcription: 'casser', traduction: 'Impressionner / Épater', categorie: 'verbes', exemplePhrase: 'Il a cassé la baraque', exempleTraduction: 'Il a impressionné tout le monde' },
    { mot: 'Gérer', transcription: 'gérer', traduction: 'Se débrouiller / Maîtriser la situation', categorie: 'verbes' },
    { mot: 'Pia', transcription: 'pia', traduction: 'Voler / Dérober', categorie: 'verbes' },
    { mot: 'Ambiancer', transcription: 'ambiancer', traduction: 'Mettre de l\'ambiance / Animer', categorie: 'verbes' },
    // --- Quartiers & Lieux complémentaires ---
    { mot: 'Deux-Plateaux', transcription: 'deu plato', traduction: 'Quartier résidentiel chic de Cocody', categorie: 'lieux' },
    { mot: 'Marcory', transcription: 'marcory', traduction: 'Commune résidentielle d\'Abidjan', categorie: 'lieux' },
    { mot: 'Port-Bouët', transcription: 'por bouè', traduction: 'Commune avec l\'aéroport et la plage', categorie: 'lieux' },
    { mot: 'Koumassi', transcription: 'koumassi', traduction: 'Commune populaire d\'Abidjan', categorie: 'lieux' },
    // --- Expressions populaires complémentaires ---
    { mot: 'C\'est le bordel', transcription: "c'est le bordel", traduction: 'C\'est le désordre / C\'est chaotique', categorie: 'expressions' },
    { mot: 'Laisser tomber', transcription: 'léssé tombé', traduction: 'Abandonner / Ne pas s\'en soucier', categorie: 'expressions' },
    { mot: 'C\'est le top', transcription: "c'est le top", traduction: 'C\'est le meilleur / C\'est excellent', categorie: 'expressions' },
    { mot: 'Ça fait pitié', transcription: 'sa fè pitié', traduction: 'C\'est triste / Dommage', categorie: 'expressions' },
    { mot: 'Mon gars', transcription: 'mon gar', traduction: 'Mon ami / Mon pote (masculin)', categorie: 'expressions' },
    { mot: 'Ma go', transcription: 'ma go', traduction: 'Ma copine / Ma petite amie', categorie: 'expressions', exemplePhrase: 'C\'est ma go', exempleTraduction: 'C\'est ma copine' },
    { mot: 'Mon bra', transcription: 'mon bra', traduction: 'Mon frère / Mon ami proche', categorie: 'expressions' },
    { mot: 'Go', transcription: 'go', traduction: 'Fille / Jeune femme', categorie: 'vie_sociale', exemplePhrase: 'La go est belle', exempleTraduction: 'La fille est belle' },
    { mot: 'Gars', transcription: 'gar', traduction: 'Garçon / Jeune homme', categorie: 'vie_sociale' },
    // --- Nourriture complémentaire ---
    { mot: 'Kedjenou', transcription: 'kedjenou', traduction: 'Poulet mijoté en feuille de banane', categorie: 'nourriture', exemplePhrase: 'Le kedjenou est prêt', exempleTraduction: 'Le poulet mijoté est prêt' },
    { mot: 'Sauce graine', transcription: 'soce grèn', traduction: 'Sauce à base de noix de palme', categorie: 'nourriture' },
    { mot: 'Sauce arachide', transcription: 'soce arachid', traduction: 'Sauce à base de pâte d\'arachide', categorie: 'nourriture' },
    { mot: 'Tchap', transcription: 'tchap', traduction: 'Nourriture / Repas (argot)', categorie: 'nourriture' },
    { mot: 'Kondobi', transcription: 'kondobi', traduction: 'Escargots grillés (mets local)', categorie: 'nourriture' },
    // --- Commerce & Argent ---
    { mot: 'Balle', transcription: 'balle', traduction: 'Franc CFA (unité monétaire)', categorie: 'vie_quotidienne', exemplePhrase: 'Ça coûte 500 balles', exempleTraduction: 'Ça coûte 500 FCFA' },
    { mot: 'Barré', transcription: 'barré', traduction: 'Billet de 10 000 FCFA', categorie: 'vie_quotidienne' },
    { mot: 'Caro', transcription: 'caro', traduction: 'Billet de 5 000 FCFA', categorie: 'vie_quotidienne' },
    { mot: 'Faire du grin', transcription: 'faire du grin', traduction: 'Se réunir entre amis autour du thé', categorie: 'vie_sociale', exemplePhrase: 'On fait le grin ce soir', exempleTraduction: 'On se retrouve pour boire le thé ce soir' },
    // --- Personnalité complémentaire ---
    { mot: 'Vieux père', transcription: 'vieu pèr', traduction: 'Homme âgé respecté / Sage', categorie: 'vie_sociale' },
    { mot: 'Vieille mère', transcription: 'vieille mèr', traduction: 'Femme âgée respectée', categorie: 'vie_sociale' },
    { mot: 'Petit', transcription: 'peti', traduction: 'Cadet / Personne plus jeune', categorie: 'vie_sociale' },
    { mot: 'Grand', transcription: 'gran', traduction: 'Aîné / Personne respectée', categorie: 'vie_sociale' },
    // --- Musique complémentaire ---
    { mot: 'Woyo', transcription: 'woyo', traduction: 'Exclamation d\'encouragement dans la danse', categorie: 'musique' },
    { mot: 'Abobolais', transcription: 'abobolais', traduction: 'Habitant d\'Abobo / Style urbain d\'Abobo', categorie: 'vie_sociale' },
    // --- Situations ---
    { mot: 'Gbôhi', transcription: 'gbôhi', traduction: 'Foule / Attroupement', categorie: 'vie_sociale' },
    { mot: 'Boucan', transcription: 'boucan', traduction: 'Bruit / Tapage', categorie: 'expressions' },
    { mot: 'Couper les ponts', transcription: 'coupé lé pon', traduction: 'Ne plus avoir de contact', categorie: 'expressions' },
    { mot: 'Sans façon', transcription: 'san fason', traduction: 'Sans complexe / Naturellement', categorie: 'expressions' },
    { mot: 'Magouille', transcription: 'magouille', traduction: 'Combines / Manoeuvres douteuses', categorie: 'expressions' },
    { mot: 'Trouver sa route', transcription: 'trouver sa rout', traduction: 'Se débrouiller / Réussir', categorie: 'expressions', exemplePhrase: 'Il a trouvé sa route', exempleTraduction: 'Il a réussi dans la vie' },
  ],
};

async function main() {
  console.log('🌍 Enrichissement V4 — Objectif 200+ mots par langue...\n');

  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) langMap[l.code] = l.id;

  let totalWords = 0;
  let skipped = 0;

  for (const [langCode, words] of Object.entries(DICTIONARY_V4)) {
    const languageId = langMap[langCode];
    if (!languageId) { console.log(`  ⚠️  "${langCode}" non trouvée.`); continue; }

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

  console.log(`\n✅ Terminé !`);
  console.log(`   📖 ${totalWords} mots ajoutés`);
  console.log(`   ⏩ ${skipped} doublons ignorés`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
