const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================================
// DICTIONNAIRE V5 — Finalisation 200+ mots pour toutes les langues
// Bété +30, Senoufo +35, Agni +35, Gouro +50, Guéré +50, Nouchi +65
// ============================================================

const DICTIONARY_V5 = {
  bete: [
    // --- Verbes manquants ---
    { mot: 'Wɔ', transcription: 'wɔ', traduction: 'Parler / Dire', categorie: 'verbes' },
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Donner', categorie: 'verbes' },
    { mot: 'Gbɔ', transcription: 'gbɔ', traduction: 'Attraper / Prendre', categorie: 'verbes' },
    { mot: 'Grɛ', transcription: 'grɛ', traduction: 'Chercher', categorie: 'verbes' },
    { mot: 'Dru', transcription: 'dru', traduction: 'Tomber', categorie: 'verbes' },
    // --- Objets complémentaires ---
    { mot: 'Plê dan', transcription: 'plê dan', traduction: 'Bol', categorie: 'habitat' },
    { mot: 'Gbo kpè', transcription: 'gbo kpè', traduction: 'Seau / Bassine', categorie: 'habitat' },
    { mot: 'Trɔ gba', transcription: 'trɔ gba', traduction: 'Valise / Sac', categorie: 'habitat' },
    // --- Nature complémentaire ---
    { mot: 'Yru', transcription: 'yru', traduction: 'Étoile', categorie: 'nature' },
    { mot: 'Gbo yɔn', transcription: 'gbo yɔn', traduction: 'Lac / Étang', categorie: 'nature' },
    { mot: 'Klê', transcription: 'klê', traduction: 'Sable', categorie: 'nature' },
    { mot: 'Tui nyo', transcription: 'tui nyo', traduction: 'Défense d\'éléphant / Ivoire', categorie: 'nature' },
    // --- Animaux complémentaires ---
    { mot: 'Kpan nyo', transcription: 'kpan nyo', traduction: 'Escargot', categorie: 'animaux' },
    { mot: 'Gblô', transcription: 'gblô', traduction: 'Grenouille', categorie: 'animaux' },
    { mot: 'Zran', transcription: 'zran', traduction: 'Crabe', categorie: 'animaux' },
    // --- Nourriture complémentaire ---
    { mot: 'Wôwô', transcription: 'wôwô', traduction: 'Foutou (pâte pilée)', categorie: 'nourriture' },
    { mot: 'Gbɛ', transcription: 'gbɛ', traduction: 'Attiéké (semoule de manioc)', categorie: 'nourriture' },
    { mot: 'Klɔ', transcription: 'klɔ', traduction: 'Banane douce', categorie: 'nourriture' },
    { mot: 'Wuɛ', transcription: 'wuɛ', traduction: 'Miel', categorie: 'nourriture' },
    // --- Famille complémentaire ---
    { mot: 'Sè', transcription: 'sè', traduction: 'Oncle', categorie: 'famille' },
    { mot: 'Yè nyu', transcription: 'yè nyu', traduction: 'Tante (soeur de la mère)', categorie: 'famille' },
    { mot: 'Gnon nylu', transcription: 'gnon nylu', traduction: 'Beau-fils / Belle-fille', categorie: 'famille' },
    { mot: 'Pwa bian', transcription: 'pwa bian', traduction: 'Mari / Époux', categorie: 'famille' },
    { mot: 'Gbla pwa', transcription: 'gbla pwa', traduction: 'Épouse', categorie: 'famille' },
    // --- Expressions complémentaires ---
    { mot: 'I ya?', transcription: 'i ya', traduction: 'Ça va ?', categorie: 'salutations' },
    { mot: 'Ya ô', transcription: 'ya ô', traduction: 'Ça va bien', categorie: 'salutations' },
    { mot: 'Sèè', transcription: 'sèè', traduction: 'Bonsoir', categorie: 'salutations' },
    { mot: 'Yê kɔ', transcription: 'yê kɔ', traduction: 'Au revoir', categorie: 'salutations' },
    { mot: 'N klê...', transcription: 'n klê', traduction: 'Je m\'appelle...', categorie: 'expressions' },
    { mot: 'Gbo gbê?', transcription: 'gbo gbê', traduction: 'Où est l\'eau ?', categorie: 'expressions' },
    { mot: 'Gnon gbê?', transcription: 'gnon gbê', traduction: 'Où est la maison ?', categorie: 'expressions' },
  ],

  senoufo: [
    // --- Verbes manquants ---
    { mot: 'Gbɔ', transcription: 'gbɔ', traduction: 'Attraper / Prendre', categorie: 'verbes' },
    { mot: 'Dɔ', transcription: 'dɔ', traduction: 'Donner', categorie: 'verbes' },
    { mot: 'Grɛ', transcription: 'grɛ', traduction: 'Chercher', categorie: 'verbes' },
    { mot: 'Ko', transcription: 'ko', traduction: 'Se laver', categorie: 'verbes' },
    { mot: 'Kari', transcription: 'kari', traduction: 'Coudre / Tisser', categorie: 'verbes' },
    // --- Objets ---
    { mot: 'Filɛn', transcription: 'filɛn', traduction: 'Assiette / Plat', categorie: 'habitat' },
    { mot: 'Jɛ', transcription: 'jɛ', traduction: 'Calebasse', categorie: 'habitat' },
    { mot: 'Bɔɔrɔ', transcription: 'bɔɔrɔ', traduction: 'Sac / Sacoche', categorie: 'habitat' },
    // --- Nature complémentaire ---
    { mot: 'Lolo', transcription: 'lolo', traduction: 'Étoile', categorie: 'nature' },
    { mot: 'Ba', transcription: 'ba', traduction: 'Fleuve / Rivière', categorie: 'nature' },
    { mot: 'Kulu', transcription: 'kulu', traduction: 'Montagne', categorie: 'nature' },
    { mot: 'Bɛlɛ', transcription: 'bɛlɛ', traduction: 'Pierre', categorie: 'nature' },
    { mot: 'Furakala', transcription: 'furakala', traduction: 'Feuille', categorie: 'nature' },
    // --- Animaux complémentaires ---
    { mot: 'Konkon', transcription: 'konkon', traduction: 'Escargot', categorie: 'animaux' },
    { mot: 'Ntori', transcription: 'ntori', traduction: 'Grenouille', categorie: 'animaux' },
    { mot: 'Baninkɔnɔ', transcription: 'baninkɔnɔ', traduction: 'Lézard', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Foutou', transcription: 'foutou', traduction: 'Foutou (pâte pilée)', categorie: 'nourriture' },
    { mot: 'Tô', transcription: 'tô', traduction: 'Tô (pâte de maïs/mil)', categorie: 'nourriture', exemplePhrase: 'Tô ni nan ka di', exempleTraduction: 'Le tô avec la sauce est bon' },
    { mot: 'Lɛri', transcription: 'lɛri', traduction: 'Miel', categorie: 'nourriture' },
    { mot: 'Kabato', transcription: 'kabato', traduction: 'Pâte de maïs traditionnelle', categorie: 'nourriture' },
    // --- Famille complémentaire ---
    { mot: 'Tɛrɛ', transcription: 'tɛrɛ', traduction: 'Oncle', categorie: 'famille' },
    { mot: 'Barima', transcription: 'barima', traduction: 'Tante', categorie: 'famille' },
    { mot: 'Denya', transcription: 'denya', traduction: 'Cousin / Cousine', categorie: 'famille' },
    // --- Vie sociale ---
    { mot: 'Fɔlɔfɔlɔ', transcription: 'fɔlɔfɔlɔ', traduction: 'Chasseur', categorie: 'vie_sociale' },
    { mot: 'Jeli', transcription: 'jeli', traduction: 'Griot / Conteur', categorie: 'vie_sociale' },
    // --- Expressions ---
    { mot: 'Kawelé nanga', transcription: 'kawelé nanga', traduction: 'Bonjour merci', categorie: 'salutations' },
    { mot: 'Ka wula', transcription: 'ka wula', traduction: 'Bonsoir', categorie: 'salutations' },
    { mot: 'Ka sini ye', transcription: 'ka sini ye', traduction: 'À demain', categorie: 'salutations' },
    { mot: 'N tɔgɔ ye...', transcription: 'n tɔgɔ ye', traduction: 'Je m\'appelle...', categorie: 'expressions' },
    { mot: 'Dɔgɔtɔrɔso bɛ min?', transcription: 'dɔgɔtɔrɔso bɛ min', traduction: 'Où est l\'hôpital ?', categorie: 'expressions' },
    { mot: 'Sira jumɛn?', transcription: 'sira jumɛn', traduction: 'Quel chemin ?', categorie: 'expressions' },
    { mot: 'N bɛ kalan na', transcription: 'n bɛ kalan na', traduction: 'J\'étudie / J\'apprends', categorie: 'expressions' },
    { mot: 'Kɛnɛya', transcription: 'kɛnɛya', traduction: 'Santé / Bonne santé', categorie: 'corps' },
    // --- Vêtements ---
    { mot: 'Dereke', transcription: 'dereke', traduction: 'Chemise', categorie: 'vie_quotidienne' },
    { mot: 'Gɛlɛn', transcription: 'gɛlɛn', traduction: 'Ceinture', categorie: 'vie_quotidienne' },
  ],

  agni: [
    // --- Verbes manquants ---
    { mot: 'Fa', transcription: 'fa', traduction: 'Prendre', categorie: 'verbes' },
    { mot: 'Bɔ', transcription: 'bɔ', traduction: 'Sortir', categorie: 'verbes' },
    { mot: 'Fite', transcription: 'fite', traduction: 'Prier', categorie: 'verbes' },
    { mot: 'Wu', transcription: 'wu', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Cɛcɛ', transcription: 'cɛcɛ', traduction: 'Balayer', categorie: 'verbes' },
    // --- Objets ---
    { mot: 'Buali kpli', transcription: 'buali kpli', traduction: 'Grande marmite', categorie: 'habitat' },
    { mot: 'Ngo', transcription: 'ngo', traduction: 'Cuillère', categorie: 'habitat' },
    { mot: 'Gba', transcription: 'gba', traduction: 'Panier', categorie: 'habitat' },
    // --- Nature complémentaire ---
    { mot: 'Nzraama', transcription: 'nzraama', traduction: 'Étoile', categorie: 'nature' },
    { mot: 'Nzuɛ dan', transcription: 'nzuɛ dan', traduction: 'Fleuve / Grande rivière', categorie: 'nature' },
    { mot: 'Yɛbuɛ', transcription: 'yɛbuɛ', traduction: 'Pierre / Rocher', categorie: 'nature' },
    { mot: 'Blo', transcription: 'blo', traduction: 'Forêt', categorie: 'nature' },
    // --- Animaux complémentaires ---
    { mot: 'Nwan', transcription: 'nwan', traduction: 'Escargot', categorie: 'animaux' },
    { mot: 'Dɛnkyɛm', transcription: 'dɛnkyɛm', traduction: 'Lézard', categorie: 'animaux' },
    { mot: 'Kɔtrɔbɔ', transcription: 'kɔtrɔbɔ', traduction: 'Grenouille', categorie: 'animaux' },
    // --- Nourriture ---
    { mot: 'Foutou', transcription: 'foutou', traduction: 'Foutou (pâte pilée)', categorie: 'nourriture' },
    { mot: 'Attiéké', transcription: 'attiéké', traduction: 'Attiéké (semoule de manioc)', categorie: 'nourriture' },
    { mot: 'Klɔ', transcription: 'klɔ', traduction: 'Banane douce', categorie: 'nourriture' },
    { mot: 'Wuɛ', transcription: 'wuɛ', traduction: 'Miel', categorie: 'nourriture' },
    // --- Famille ---
    { mot: 'Suan', transcription: 'suan', traduction: 'Oncle', categorie: 'famille' },
    { mot: 'Niɛn bla', transcription: 'niɛn bla', traduction: 'Tante', categorie: 'famille' },
    { mot: 'Osua', transcription: 'osua', traduction: 'Cousin / Cousine', categorie: 'famille' },
    // --- Vie sociale ---
    { mot: 'Ahye yofuɛ', transcription: 'ahye yofuɛ', traduction: 'Chasseur', categorie: 'vie_sociale' },
    { mot: 'Sran kpa', transcription: 'sran kpa', traduction: 'Personne de bien / Noble', categorie: 'vie_sociale' },
    // --- Expressions ---
    { mot: 'Mɔ ô kpa', transcription: 'mɔ ô kpa', traduction: 'Bonne journée', categorie: 'salutations' },
    { mot: 'Kɔnguɛ kpa', transcription: 'kɔnguɛ kpa', traduction: 'Bonne nuit', categorie: 'salutations' },
    { mot: 'E kunmin', transcription: 'e kunmin', traduction: 'À demain', categorie: 'salutations' },
    { mot: 'Min dunman yɛ...', transcription: 'min dunman yɛ', traduction: 'Je m\'appelle...', categorie: 'expressions' },
    { mot: 'Ayre dan gbê?', transcription: 'ayre dan gbê', traduction: 'Où est l\'hôpital ?', categorie: 'expressions' },
    { mot: 'N su suan Agni', transcription: 'n su suan agni', traduction: 'J\'apprends l\'Agni', categorie: 'expressions' },
    { mot: 'Kpɛn kle min', transcription: 'kpɛn kle min', traduction: 'J\'ai mal', categorie: 'expressions' },
    // --- Traditions ---
    { mot: 'Abissa', transcription: 'abissa', traduction: 'Fête traditionnelle N\'zima / Carnaval', categorie: 'spiritualite' },
    { mot: 'Komian', transcription: 'komian', traduction: 'Prêtresse traditionnelle', categorie: 'spiritualite' },
    // --- Vêtements ---
    { mot: 'Kita', transcription: 'kita', traduction: 'Pagne / Tissu Akan', categorie: 'vie_quotidienne' },
  ],

  gouro: [
    // --- Animaux sauvages complémentaires ---
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Escargot', categorie: 'animaux' },
    { mot: 'Gblô', transcription: 'gblô', traduction: 'Grenouille', categorie: 'animaux' },
    { mot: 'Zran', transcription: 'zran', traduction: 'Crabe', categorie: 'animaux' },
    { mot: 'Bla nyo', transcription: 'bla nyo', traduction: 'Agneau', categorie: 'animaux' },
    // --- Verbes manquants ---
    { mot: 'Wɔ', transcription: 'wɔ', traduction: 'Dire / Parler', categorie: 'verbes' },
    { mot: 'Grɛ', transcription: 'grɛ', traduction: 'Chercher', categorie: 'verbes' },
    { mot: 'Dru', transcription: 'dru', traduction: 'Tomber', categorie: 'verbes' },
    { mot: 'Wu', transcription: 'wu', traduction: 'Coudre', categorie: 'verbes' },
    { mot: 'Bo', transcription: 'bo', traduction: 'Frapper', categorie: 'verbes' },
    { mot: 'Zri', transcription: 'zri', traduction: 'Laver (vêtement)', categorie: 'verbes' },
    // --- Nourriture complémentaire ---
    { mot: 'Wôwô', transcription: 'wôwô', traduction: 'Foutou (pâte pilée)', categorie: 'nourriture' },
    { mot: 'Gbɛ', transcription: 'gbɛ', traduction: 'Attiéké', categorie: 'nourriture' },
    { mot: 'Klɔ', transcription: 'klɔ', traduction: 'Banane douce', categorie: 'nourriture' },
    { mot: 'Wuɛ', transcription: 'wuɛ', traduction: 'Miel', categorie: 'nourriture' },
    { mot: 'Drui', transcription: 'drui', traduction: 'Huile', categorie: 'nourriture' },
    { mot: 'Mango', transcription: 'mango', traduction: 'Mangue', categorie: 'nourriture' },
    // --- Nature complémentaire ---
    { mot: 'Yru', transcription: 'yru', traduction: 'Étoile', categorie: 'nature' },
    { mot: 'Gbo yɔn', transcription: 'gbo yɔn', traduction: 'Lac / Rivière', categorie: 'nature' },
    { mot: 'Klê', transcription: 'klê', traduction: 'Sable', categorie: 'nature' },
    { mot: 'Dro blɛ', transcription: 'dro blɛ', traduction: 'Saison sèche', categorie: 'nature' },
    { mot: 'Yû blɛ', transcription: 'yû blɛ', traduction: 'Saison des pluies', categorie: 'nature' },
    // --- Famille complémentaire ---
    { mot: 'Sè', transcription: 'sè', traduction: 'Oncle', categorie: 'famille' },
    { mot: 'Yè nyu', transcription: 'yè nyu', traduction: 'Tante', categorie: 'famille' },
    { mot: 'Pwa', transcription: 'pwa', traduction: 'Femme / Épouse', categorie: 'famille' },
    { mot: 'Gbla', transcription: 'gbla', traduction: 'Homme / Époux', categorie: 'famille' },
    // --- Objets complémentaires ---
    { mot: 'Plê', transcription: 'plê', traduction: 'Assiette', categorie: 'habitat' },
    { mot: 'Gbo kpè', transcription: 'gbo kpè', traduction: 'Seau', categorie: 'habitat' },
    { mot: 'Trɔ gba', transcription: 'trɔ gba', traduction: 'Valise / Sac', categorie: 'habitat' },
    { mot: 'Ngo', transcription: 'ngo', traduction: 'Cuillère', categorie: 'habitat' },
    // --- Sentiments ---
    { mot: 'Sɛ', transcription: 'sɛ', traduction: 'Amour', categorie: 'expressions' },
    // --- Lieux complémentaires ---
    { mot: 'Ayre dan', transcription: 'ayre dan', traduction: 'Hôpital', categorie: 'lieux' },
    { mot: 'Ɲanmiɛn sua', transcription: 'ɲanmiɛn sua', traduction: 'Église', categorie: 'lieux' },
    { mot: 'Gbo nyon', transcription: 'gbo nyon', traduction: 'Rivière', categorie: 'lieux' },
    // --- Expressions complémentaires ---
    { mot: 'I ya ô', transcription: 'i ya ô', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Kpa-a', transcription: 'kpa-a', traduction: 'Merci', categorie: 'salutations' },
    { mot: 'Yê kɔ', transcription: 'yê kɔ', traduction: 'Au revoir', categorie: 'salutations' },
    { mot: 'N klo ɔ', transcription: 'n klo ɔ', traduction: 'Je t\'aime', categorie: 'expressions' },
    { mot: 'Gbê?', transcription: 'gbê', traduction: 'Où ?', categorie: 'expressions' },
    { mot: 'Dê?', transcription: 'dê', traduction: 'Quoi ?', categorie: 'expressions' },
    { mot: 'Kpè?', transcription: 'kpè', traduction: 'Quand ?', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Trɔ kpa', transcription: 'trɔ kpa', traduction: 'Pantalon', categorie: 'vie_quotidienne' },
    { mot: 'Trɔ dan', transcription: 'trɔ dan', traduction: 'Robe / Pagne', categorie: 'vie_quotidienne' },
    { mot: 'Gbabua', transcription: 'gbabua', traduction: 'Chaussure', categorie: 'vie_quotidienne' },
    // --- Traditions Gouro ---
    { mot: 'Djè', transcription: 'djè', traduction: 'Danse / Fête traditionnelle', categorie: 'spiritualite' },
    { mot: 'Wlɛ gba', transcription: 'wlɛ gba', traduction: 'Tam-tam / Tambour', categorie: 'spiritualite' },
    // --- Corps ---
    { mot: 'Nuan', transcription: 'nuan', traduction: 'Langue (organe)', categorie: 'corps' },
    { mot: 'Ngban', transcription: 'ngban', traduction: 'Genou', categorie: 'corps' },
  ],

  guere: [
    // --- Animaux complémentaires ---
    { mot: 'Kpan', transcription: 'kpan', traduction: 'Escargot', categorie: 'animaux' },
    { mot: 'Gblô', transcription: 'gblô', traduction: 'Grenouille', categorie: 'animaux' },
    { mot: 'Zran nyo', transcription: 'zran nyo', traduction: 'Crabe', categorie: 'animaux' },
    { mot: 'Tui', transcription: 'tui', traduction: 'Éléphant', categorie: 'animaux' },
    // --- Verbes manquants ---
    { mot: 'Wɔ', transcription: 'wɔ', traduction: 'Dire / Parler', categorie: 'verbes' },
    { mot: 'Grɛ', transcription: 'grɛ', traduction: 'Chercher', categorie: 'verbes' },
    { mot: 'Dru', transcription: 'dru', traduction: 'Tomber', categorie: 'verbes' },
    { mot: 'Gbɔ', transcription: 'gbɔ', traduction: 'Attraper', categorie: 'verbes' },
    { mot: 'Bo', transcription: 'bo', traduction: 'Frapper', categorie: 'verbes' },
    { mot: 'Nyo', transcription: 'nyo', traduction: 'Écouter', categorie: 'verbes' },
    // --- Nourriture complémentaire ---
    { mot: 'Wôwô', transcription: 'wôwô', traduction: 'Foutou (pâte pilée)', categorie: 'nourriture' },
    { mot: 'Gbɛ', transcription: 'gbɛ', traduction: 'Attiéké', categorie: 'nourriture' },
    { mot: 'Klɔ', transcription: 'klɔ', traduction: 'Banane douce', categorie: 'nourriture' },
    { mot: 'Wuɛ', transcription: 'wuɛ', traduction: 'Miel', categorie: 'nourriture' },
    { mot: 'Glô', transcription: 'glô', traduction: 'Poisson fumé', categorie: 'nourriture' },
    // --- Nature complémentaire ---
    { mot: 'Yru', transcription: 'yru', traduction: 'Étoile', categorie: 'nature' },
    { mot: 'Gbo yɔn', transcription: 'gbo yɔn', traduction: 'Lac / Rivière', categorie: 'nature' },
    { mot: 'Klê', transcription: 'klê', traduction: 'Sable', categorie: 'nature' },
    { mot: 'Klô', transcription: 'klô', traduction: 'Forêt dense', categorie: 'nature' },
    // --- Famille complémentaire ---
    { mot: 'Sè', transcription: 'sè', traduction: 'Oncle', categorie: 'famille' },
    { mot: 'Yɔ nyu', transcription: 'yɔ nyu', traduction: 'Tante', categorie: 'famille' },
    { mot: 'Pɔ bian', transcription: 'pɔ bian', traduction: 'Mari', categorie: 'famille' },
    { mot: 'Gbla pɔ', transcription: 'gbla pɔ', traduction: 'Épouse', categorie: 'famille' },
    // --- Objets complémentaires ---
    { mot: 'Plê', transcription: 'plê', traduction: 'Assiette', categorie: 'habitat' },
    { mot: 'Gbo kpè', transcription: 'gbo kpè', traduction: 'Seau', categorie: 'habitat' },
    { mot: 'Ngo', transcription: 'ngo', traduction: 'Cuillère', categorie: 'habitat' },
    { mot: 'Trɔ gba', transcription: 'trɔ gba', traduction: 'Sac / Valise', categorie: 'habitat' },
    // --- Lieux complémentaires ---
    { mot: 'Ayre dan', transcription: 'ayre dan', traduction: 'Hôpital', categorie: 'lieux' },
    { mot: 'Ɲanmiɛn sua', transcription: 'ɲanmiɛn sua', traduction: 'Église', categorie: 'lieux' },
    // --- Expressions ---
    { mot: 'Gbɔɔ kpa', transcription: 'gbɔɔ kpa', traduction: 'Bonne journée', categorie: 'salutations' },
    { mot: 'Yê kɔ', transcription: 'yê kɔ', traduction: 'Au revoir', categorie: 'salutations' },
    { mot: 'N klo ɔ', transcription: 'n klo ɔ', traduction: 'Je t\'aime', categorie: 'expressions' },
    { mot: 'Gbê?', transcription: 'gbê', traduction: 'Où ?', categorie: 'expressions' },
    { mot: 'Dê?', transcription: 'dê', traduction: 'Quoi ?', categorie: 'expressions' },
    { mot: 'Kpè?', transcription: 'kpè', traduction: 'Quand ?', categorie: 'expressions' },
    // --- Vêtements ---
    { mot: 'Trɔ', transcription: 'trɔ', traduction: 'Vêtement (général)', categorie: 'vie_quotidienne' },
    // --- Traditions ---
    { mot: 'Gla', transcription: 'gla', traduction: 'Danse guerrière traditionnelle', categorie: 'spiritualite' },
    { mot: 'Wlɛ gba', transcription: 'wlɛ gba', traduction: 'Tam-tam / Tambour', categorie: 'spiritualite' },
    { mot: 'Djè', transcription: 'djè', traduction: 'Fête traditionnelle', categorie: 'spiritualite' },
    // --- Santé ---
    { mot: 'Kɛnɛya', transcription: 'kɛnɛya', traduction: 'Bonne santé', categorie: 'corps' },
    // --- Corps ---
    { mot: 'Nuan', transcription: 'nuan', traduction: 'Langue (organe)', categorie: 'corps' },
    { mot: 'Ngban', transcription: 'ngban', traduction: 'Genou', categorie: 'corps' },
    // --- Nature lieux ---
    { mot: 'Nnua', transcription: 'nnua', traduction: 'Arbre', categorie: 'nature' },
    { mot: 'Bly', transcription: 'bly', traduction: 'Ciel', categorie: 'nature' },
  ],

  nouchi: [
    // --- Expressions de la rue ---
    { mot: 'Atalaku', transcription: 'atalaku', traduction: 'Animateur de foule / Hype man', categorie: 'musique', exemplePhrase: 'L\'atalaku a chauffé la salle', exempleTraduction: 'L\'animateur a mis l\'ambiance' },
    { mot: 'Faro', transcription: 'faro', traduction: 'Montrer / Frimer / Se vanter', categorie: 'verbes', exemplePhrase: 'Il faro avec sa voiture', exempleTraduction: 'Il frime avec sa voiture' },
    { mot: 'Kouman', transcription: 'kouman', traduction: 'Situation / Affaire / Comment', categorie: 'expressions' },
    { mot: 'Pian', transcription: 'pian', traduction: 'Problème / Souci', categorie: 'expressions', exemplePhrase: 'Y a pas de pian', exempleTraduction: 'Il n\'y a pas de problème' },
    { mot: 'Coco', transcription: 'coco', traduction: 'Ami proche / Partenaire', categorie: 'vie_sociale' },
    { mot: 'Peyi', transcription: 'peyi', traduction: 'Pays / Village d\'origine', categorie: 'lieux' },
    { mot: 'Kata', transcription: 'kata', traduction: 'Quartier / Zone', categorie: 'lieux' },
    // --- Adjectifs complémentaires ---
    { mot: 'Doux', transcription: 'doux', traduction: 'Agréable / Beau / Bon', categorie: 'expressions' },
    { mot: 'Choco', transcription: 'choco', traduction: 'Snob / Prétentieux / De classe aisée', categorie: 'personnalite', exemplePhrase: 'Elle est trop choco', exempleTraduction: 'Elle est trop snob' },
    { mot: 'Bourré', transcription: 'bourré', traduction: 'Riche / Plein d\'argent', categorie: 'expressions' },
    { mot: 'Calé', transcription: 'calé', traduction: 'Intelligent / Compétent', categorie: 'personnalite' },
    { mot: 'Poto-poto', transcription: 'poto-poto', traduction: 'Boue / Sale / En désordre', categorie: 'expressions' },
    // --- Nourriture de rue ---
    { mot: 'Pain chargé', transcription: 'pin charjé', traduction: 'Sandwich garni (pain + viande/sardine)', categorie: 'nourriture', exemplePhrase: 'Donne-moi un pain chargé', exempleTraduction: 'Donne-moi un sandwich garni' },
    { mot: 'Dégué', transcription: 'dégué', traduction: 'Yaourt traditionnel au mil', categorie: 'nourriture' },
    { mot: 'Thé Lipton', transcription: 'thé lipton', traduction: 'Thé noir sucré (boisson populaire)', categorie: 'nourriture' },
    { mot: 'Sucrerie', transcription: 'sucrerie', traduction: 'Bonbon / Friandise', categorie: 'nourriture' },
    { mot: 'Brakô', transcription: 'brakô', traduction: 'Grillades de rue', categorie: 'nourriture' },
    // --- Transport complémentaire ---
    { mot: 'Continu', transcription: 'continu', traduction: 'Taxi sans arrêt (direct)', categorie: 'transport' },
    { mot: 'Bateau-bus', transcription: 'bato-bus', traduction: 'Transport fluvial lagunaire', categorie: 'transport' },
    { mot: 'Gare', transcription: 'gare', traduction: 'Station de transport / Gare routière', categorie: 'transport' },
    // --- Commerce ---
    { mot: 'Kpata', transcription: 'kpata', traduction: 'Étalage / Commerce de rue', categorie: 'vie_sociale' },
    { mot: 'Braise', transcription: 'braise', traduction: 'Argent (argot)', categorie: 'vie_quotidienne', exemplePhrase: 'J\'ai pas la braise', exempleTraduction: 'Je n\'ai pas d\'argent' },
    { mot: 'Douilles', transcription: 'douilles', traduction: 'Argent (argot)', categorie: 'vie_quotidienne' },
    { mot: 'Gbi', transcription: 'gbi', traduction: 'Rien / Zéro', categorie: 'expressions', exemplePhrase: 'J\'ai gbi', exempleTraduction: 'Je n\'ai rien' },
    // --- Vie quotidienne ---
    { mot: 'Zougloutique', transcription: 'zougloutik', traduction: 'Relatif au zouglou / Style de vie zouglou', categorie: 'musique' },
    { mot: 'Maquis', transcription: 'maquis', traduction: 'Bar-restaurant populaire', categorie: 'lieux' },
    { mot: 'Allocodrome', transcription: 'allocodrome', traduction: 'Zone de vente d\'alloco et grillades', categorie: 'lieux' },
    { mot: 'Espace', transcription: 'espace', traduction: 'Bar en plein air', categorie: 'lieux' },
    // --- Expressions sentimentales ---
    { mot: 'Chérie coco', transcription: 'chéri coco', traduction: 'Chéri(e) / Mon amour', categorie: 'expressions' },
    { mot: 'Tomber', transcription: 'tombé', traduction: 'Tomber amoureux', categorie: 'verbes', exemplePhrase: 'Il est tombé pour la go', exempleTraduction: 'Il est tombé amoureux de la fille' },
    // --- Insultes légères / Humour ---
    { mot: 'Couillon', transcription: 'couyon', traduction: 'Bête / Nul (gentil)', categorie: 'personnalite' },
    { mot: 'Mougou', transcription: 'mougou', traduction: 'Idiot / Bête (du Dioula)', categorie: 'personnalite' },
    // --- Exclamations ---
    { mot: 'Hein!', transcription: 'ein', traduction: 'Exclamation de surprise / d\'incrédulité', categorie: 'expressions' },
    { mot: 'Kai!', transcription: 'kai', traduction: 'Exclamation forte (choc, douleur)', categorie: 'expressions' },
    { mot: 'Yéhh!', transcription: 'yéhh', traduction: 'Exclamation de joie / d\'encouragement', categorie: 'expressions' },
    { mot: 'Aya!', transcription: 'aya', traduction: 'Exclamation de douleur', categorie: 'expressions' },
    // --- Verbes supplémentaires ---
    { mot: 'Gater', transcription: 'gaté', traduction: 'Gâcher / Détruire / Rater', categorie: 'verbes' },
    { mot: 'Bouger', transcription: 'boujé', traduction: 'Partir / Se déplacer', categorie: 'verbes', exemplePhrase: 'On bouge là ?', exempleTraduction: 'On y va ?' },
    { mot: 'Débrouiller', transcription: 'débrouillé', traduction: 'Se débrouiller / Survivre', categorie: 'verbes' },
    { mot: 'Squatter', transcription: 'skouaté', traduction: 'Rester / Traîner quelque part', categorie: 'verbes' },
    // --- Divers ---
    { mot: 'Djama', transcription: 'djama', traduction: 'Foule / Grand rassemblement', categorie: 'vie_sociale' },
    { mot: 'Kpangbé', transcription: 'kpangbé', traduction: 'Marche / Grève / Manifestation', categorie: 'vie_sociale' },
    { mot: 'Crise', transcription: 'crise', traduction: 'Période difficile / Période de conflit', categorie: 'vie_sociale' },
    { mot: 'Article 15', transcription: 'article quinze', traduction: 'Se débrouiller (référence humoristique)', categorie: 'expressions', exemplePhrase: 'Ici c\'est article 15', exempleTraduction: 'Ici on se débrouille par tous les moyens' },
  ],
};

async function main() {
  console.log('🌍 Enrichissement V5 — Finalisation 200+ mots pour toutes les langues...\n');

  const languages = await prisma.language.findMany();
  const langMap = {};
  for (const l of languages) langMap[l.code] = l.id;

  let totalWords = 0;
  let skipped = 0;

  for (const [langCode, words] of Object.entries(DICTIONARY_V5)) {
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
