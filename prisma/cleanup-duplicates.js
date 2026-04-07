const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('🧹 Nettoyage des doublons...');

  // Récupérer toutes les entrées du dictionnaire
  const allWords = await prisma.dictionaryEntry.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // Grouper par (mot + langueCode) pour trouver les doublons
  const seen = new Map();
  const toDelete = [];

  for (const word of allWords) {
    const key = `${word.mot.toLowerCase()}-${word.langueCode}`;
    if (seen.has(key)) {
      toDelete.push(word.id);
    } else {
      seen.set(key, word.id);
    }
  }

  if (toDelete.length > 0) {
    await prisma.dictionaryEntry.deleteMany({ where: { id: { in: toDelete } } });
    console.log(`✅ ${toDelete.length} doublons supprimés du dictionnaire`);
  } else {
    console.log('✅ Aucun doublon dans le dictionnaire');
  }

  // Même chose pour les leçons
  const allLessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const seenLessons = new Map();
  const lessonsToDelete = [];

  for (const lesson of allLessons) {
    const key = `${lesson.titre.toLowerCase()}-${lesson.langueCode}`;
    if (seenLessons.has(key)) {
      lessonsToDelete.push(lesson.id);
    } else {
      seenLessons.set(key, lesson.id);
    }
  }

  if (lessonsToDelete.length > 0) {
    await prisma.lesson.deleteMany({ where: { id: { in: lessonsToDelete } } });
    console.log(`✅ ${lessonsToDelete.length} doublons supprimés des leçons`);
  } else {
    console.log('✅ Aucun doublon dans les leçons');
  }

  // Même chose pour le contenu culturel
  const allCultural = await prisma.culturalItem.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const seenCultural = new Map();
  const culturalToDelete = [];

  for (const item of allCultural) {
    const key = `${item.titre.toLowerCase()}-${item.langueCode}`;
    if (seenCultural.has(key)) {
      culturalToDelete.push(item.id);
    } else {
      seenCultural.set(key, item.id);
    }
  }

  if (culturalToDelete.length > 0) {
    await prisma.culturalItem.deleteMany({ where: { id: { in: culturalToDelete } } });
    console.log(`✅ ${culturalToDelete.length} doublons supprimés du contenu culturel`);
  } else {
    console.log('✅ Aucun doublon dans le contenu culturel');
  }

  console.log('🎉 Nettoyage terminé !');
  await prisma.$disconnect();
}

cleanupDuplicates().catch(console.error);
