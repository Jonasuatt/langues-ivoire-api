const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Met à jour les avatars des agents IA Amara et Kouadio
 * avec des portraits réalistes haute qualité (Unsplash, libre de droits)
 */
async function main() {
  // Portrait femme africaine professionnelle - Amara
  const amaraImageUrl = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face&auto=format&q=80';

  // Portrait homme africain professionnel - Kouadio
  const kouadioImageUrl = 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=face&auto=format&q=80';

  // Mettre à jour tous les tuteurs Amara
  const amaraResult = await prisma.tutor.updateMany({
    where: { nomAvatar: 'Amara' },
    data: { imageUrl: amaraImageUrl },
  });
  console.log(`✅ Amara : ${amaraResult.count} tuteur(s) mis à jour`);

  // Mettre à jour tous les tuteurs Kouadio
  const kouadioResult = await prisma.tutor.updateMany({
    where: { nomAvatar: 'Kouadio' },
    data: { imageUrl: kouadioImageUrl },
  });
  console.log(`✅ Kouadio : ${kouadioResult.count} tuteur(s) mis à jour`);

  // Mettre aussi à jour les emojis dans le PracticeScreen n'est pas nécessaire
  // car les images viennent du serveur via l'API tutors

  console.log('\n🎨 Avatars mis à jour avec des portraits réalistes !');
  console.log('   Amara  → Portrait femme africaine professionnelle');
  console.log('   Kouadio → Portrait homme africain professionnel');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
