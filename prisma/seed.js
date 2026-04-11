const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const LANGUAGES = [
  { nom: 'Baoulé', code: 'baoule', famille: 'Akan', region: 'Centre', locuteurs: 2500000, ordreAffichage: 1, isInMvp: true,
    description: 'Langue du groupe ethnique Akan, parlée principalement dans le Centre de la Côte d\'Ivoire.' },
  { nom: 'Dioula', code: 'dioula', famille: 'Mandé Nord', region: 'Nord & national', locuteurs: 5000000, ordreAffichage: 2, isInMvp: true,
    description: 'Langue commerciale parlée dans tout le pays, notamment au Nord.' },
  { nom: 'Bété', code: 'bete', famille: 'Krou', region: 'Ouest', locuteurs: 1500000, ordreAffichage: 3, isInMvp: true,
    description: 'Langue du groupe Krou, parlée principalement dans l\'ouest ivoirien.' },
  { nom: 'Senoufo', code: 'senoufo', famille: 'Gour', region: 'Nord (Korhogo)', locuteurs: 1200000, ordreAffichage: 4, isInMvp: true,
    description: 'Langue du peuple Senoufo, dominant dans la région de Korhogo au Nord.' },
  { nom: 'Agni', code: 'agni', famille: 'Akan', region: 'Est', locuteurs: 900000, ordreAffichage: 5, isInMvp: true,
    description: 'Langue Akan parlée à l\'est du pays, proche du baoulé.' },
  { nom: 'Gouro', code: 'gouro', famille: 'Mandé Sud', region: 'Centre-Ouest', locuteurs: 600000, ordreAffichage: 6, isInMvp: true,
    description: 'Langue du peuple Gouro dans le centre-ouest ivoirien.' },
  { nom: 'Guéré', code: 'guere', famille: 'Krou', region: 'Ouest', locuteurs: 400000, ordreAffichage: 7, isInMvp: true,
    description: 'Langue Krou parlée dans la région de l\'ouest près de la frontière libérienne.' },
  { nom: 'Nouchi', code: 'nouchi', famille: 'Argot urbain', region: 'Abidjan & national', locuteurs: 5000000, ordreAffichage: 8, isInMvp: true,
    description: 'Argot urbain né à Abidjan, mélange de langues ivoiriennes, français et autres.' },
];

const TUTORS = [
  { languageCode: 'baoule', nomAvatar: 'Koffi', personalite: 'Sage et bienveillant, Koffi parle lentement et clairement. Il aime raconter des proverbes baoulé.' },
  { languageCode: 'dioula', nomAvatar: 'Amara', personalite: 'Commerçant chaleureux, Amara est dynamique et encourage beaucoup l\'apprenant.' },
  { languageCode: 'bete', nomAvatar: 'Yoro', personalite: 'Guerrier noble, Yoro est fier de sa culture et explique les traditions avec passion.' },
  { languageCode: 'senoufo', nomAvatar: 'Tialagnon', personalite: 'Artisan patient, Tialagnon enseigne avec méthode et célèbre chaque progrès.' },
  { languageCode: 'agni', nomAvatar: 'Tehia', personalite: 'Princesse élégante, Tehia parle avec raffinement et insiste sur la bonne prononciation.' },
  { languageCode: 'gouro', nomAvatar: 'Zan Bi', personalite: 'Agriculteur humble, Zan Bi utilise des exemples de la vie quotidienne pour enseigner.' },
  { languageCode: 'guere', nomAvatar: 'Oulahi', personalite: 'Chasseur courageux, Oulahi est direct et enthousiaste dans ses encouragements.' },
  { languageCode: 'nouchi', nomAvatar: 'Pololo', personalite: 'Jeune branchée d\'Abidjan, Pololo est fun et utilise beaucoup d\'expressions contemporaines.' },
];

const SAMPLE_BADGES = [
  { nom: 'Premier Pas', description: 'Complétez votre première leçon', categorie: 'linguistique', condition: { type: 'lessons_completed', count: 1 }, pointsXp: 20 },
  { nom: 'Apprenti Linguiste', description: 'Complétez 10 leçons', categorie: 'linguistique', condition: { type: 'lessons_completed', count: 10 }, pointsXp: 100 },
  { nom: 'Linguiste Confirmé', description: 'Complétez 50 leçons', categorie: 'linguistique', condition: { type: 'lessons_completed', count: 50 }, pointsXp: 500 },
  { nom: 'Contributeur', description: 'Soumettez votre première contribution', categorie: 'social', condition: { type: 'contributions', count: 1 }, pointsXp: 30 },
  { nom: 'Gardien des Langues', description: 'Soumettez 20 contributions approuvées', categorie: 'social', condition: { type: 'contributions', count: 20 }, pointsXp: 200 },
];

const SAMPLE_CULTURAL_ITEMS = [
  { type: 'PROVERB', languageCode: 'baoule', contenu: 'Sran bi w\'a di mma, ɔ di ne ho.', traduction: 'L\'homme qui ne mange pas avec les enfants mange seul.', sourceEthnique: 'Baoulé' },
  { type: 'PROVERB', languageCode: 'dioula', contenu: 'Denmɔgɔ bɛ kalan, a bɛ se ka baara kɛ.', traduction: 'L\'enfant qui apprend sera capable de travailler.', sourceEthnique: 'Dioula' },
  { type: 'ANECDOTE', languageCode: 'baoule', contenu: 'Le tissage Kita est un art traditionnel baoulé transmis de génération en génération. Chaque motif raconte une histoire.', sourceEthnique: 'Baoulé' },
];

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Admin par défaut
  const adminHash = await bcrypt.hash('Admin@2026!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@languesivoire.ci' },
    update: {},
    create: {
      nom: 'Admin', prenom: 'Langues Ivoire',
      email: 'admin@languesivoire.ci',
      motDePasseHash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin créé');

  // Langues
  const langueMap = {};
  for (const lang of LANGUAGES) {
    const l = await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: { ...lang, isActive: true },
    });
    langueMap[lang.code] = l.id;
  }
  console.log('✅ 8 langues créées');

  // Tuteurs
  for (const t of TUTORS) {
    const langId = langueMap[t.languageCode];
    if (!langId) continue;
    await prisma.tutor.upsert({
      where: { languageId: langId },
      update: {},
      create: {
        languageId: langId,
        nomAvatar: t.nomAvatar,
        personalite: t.personalite,
        voixConfig: { vitesse: 1.0, pitch: 1.0, langue: t.languageCode },
        isActive: true,
      },
    });
  }
  console.log('✅ 8 tuteurs créés');

  // Badges
  for (const b of SAMPLE_BADGES) {
    await prisma.badge.upsert({
      where: { nom: b.nom },
      update: {},
      create: b,
    });
  }
  console.log('✅ Badges créés');

  // Contenu culturel
  for (const item of SAMPLE_CULTURAL_ITEMS) {
    const { languageCode, ...rest } = item;
    await prisma.culturalItem.create({
      data: { ...rest, languageId: langueMap[languageCode], isActive: true },
    });
  }
  console.log('✅ Contenu culturel créé');

  // Leçon d'exemple (Baoulé)
  const baouleLangId = langueMap['baoule'];
  const lesson = await prisma.lesson.create({
    data: {
      languageId: baouleLangId,
      titre: 'Les Salutations Baoulé',
      description: 'Apprenez à dire bonjour et à vous présenter en Baoulé.',
      ordre: 1,
      pointsXp: 50,
      niveau: 'A1',
      isActive: true,
    },
  });

  const step1 = await prisma.lessonStep.create({
    data: {
      lessonId: lesson.id,
      type: 'VOCABULARY',
      ordre: 1,
      contenu: {
        titre: 'Mots de base',
        mots: [
          { mot: 'Mô ô', traduction: 'Bonjour (à une personne)', transcription: 'mɔ ɔ' },
          { mot: 'Mô wô', traduction: 'Bonjour (à plusieurs)', transcription: 'mɔ wɔ' },
          { mot: 'Akwaba', traduction: 'Bienvenue', transcription: 'akwaba' },
          { mot: 'Mé frán', traduction: 'Je m\'appelle', transcription: 'me fran' },
        ],
      },
    },
  });

  await prisma.exercise.create({
    data: {
      stepId: step1.id,
      type: 'VOCABULARY',
      donnees: {
        question: 'Comment dit-on "Bonjour" en Baoulé à une personne ?',
        choix: ['Mô ô', 'Akwaba', 'Mé frán', 'Mô wô'],
      },
      solution: { reponse: 'Mô ô' },
      pointsXp: 10,
      explication: '"Mô ô" s\'utilise pour saluer une seule personne. "Mô wô" est la forme plurielle.',
    },
  });

  // Quelques entrées de dictionnaire Baoulé
  const sampleWords = [
    { mot: 'Mô ô', transcription: 'mɔ ɔ', traduction: 'Bonjour (singulier)', categorie: 'salutations' },
    { mot: 'Akwaba', transcription: 'akwaba', traduction: 'Bienvenue', categorie: 'salutations' },
    { mot: 'Kɛkɛ', transcription: 'kɛkɛ', traduction: 'Vélo', categorie: 'transport' },
    { mot: 'Blɔ', transcription: 'blɔ', traduction: 'Maison', categorie: 'habitat' },
    { mot: 'Nzuɛ', transcription: 'nzuɛ', traduction: 'Eau', categorie: 'nature' },
  ];

  for (const word of sampleWords) {
    await prisma.dictionaryEntry.create({
      data: { ...word, languageId: baouleLangId, status: 'PUBLISHED' },
    });
  }

  console.log('✅ Données de démonstration créées (leçon + dictionnaire Baoulé)');
  console.log('\n🎉 Seed terminé avec succès !');
  console.log('📧 Admin : admin@languesivoire.ci | 🔑 Mot de passe : Admin@2026!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
