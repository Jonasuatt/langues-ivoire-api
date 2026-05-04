/**
 * Corrige la base de production :
 * - Renomme toutes les entrées Tutor nomAvatar='Amara' avec genre='F' en 'Zélé'
 * - Met à jour la personnalité et les messages dans la voixConfig/messagesPersonnalises
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Renommer Amara (F) → Zélé
  const renamed = await prisma.tutor.updateMany({
    where: { nomAvatar: 'Amara', genre: 'F' },
    data: {
      nomAvatar: 'Zélé',
      personalite: 'Douce et patiente, Zélé guide les débutants avec bienveillance. Elle répète chaque mot lentement et encourage chaque progrès.',
    },
  });
  console.log(`✅ ${renamed.count} tuteurs Amara(F) renommés en Zélé`);

  // 2. Créer Zélé pour les langues où elle n'existe pas encore
  const languages = await prisma.language.findMany({ where: { isActive: true } });
  let created = 0;
  for (const lang of languages) {
    const exists = await prisma.tutor.findFirst({ where: { nomAvatar: 'Zélé', languageId: lang.id } });
    if (!exists) {
      await prisma.tutor.create({
        data: {
          languageId: lang.id,
          nomAvatar: 'Zélé',
          genre: 'F',
          personalite: 'Douce et patiente, Zélé guide les débutants avec bienveillance. Elle répète chaque mot lentement et encourage chaque progrès.',
          voixConfig: { speed: 0.85, pitch: 1.15, voice: 'fr-FR-DeniseNeural' },
          messagesPersonnalises: {
            greeting: "Bonjour ! Je suis Zélé, votre tutrice. Écoutez ma prononciation et répétez après moi. N'ayez pas peur de vous tromper !",
            encouragement: ['Très bien !', 'Bravo, continuez comme ça !', 'Vous progressez, je suis fière de vous !', 'Excellent travail !'],
            correction: 'Pas tout à fait, mais vous êtes sur la bonne voie. Écoutez encore une fois...',
          },
          isActive: true,
        },
      });
      created++;
      console.log(`  ✅ Zélé ♀ → ${lang.nom}`);
    } else {
      console.log(`  ⏭ Zélé (${lang.nom}) existe déjà`);
    }
  }

  // 3. Vérifier Kouadio
  let kouadioCreated = 0;
  for (const lang of languages) {
    const exists = await prisma.tutor.findFirst({ where: { nomAvatar: 'Kouadio', languageId: lang.id } });
    if (!exists) {
      await prisma.tutor.create({
        data: {
          languageId: lang.id,
          nomAvatar: 'Kouadio',
          genre: 'M',
          personalite: "Dynamique et encourageant, Kouadio rend l'apprentissage amusant. Il utilise des expressions du quotidien et des anecdotes culturelles.",
          voixConfig: { speed: 1.0, pitch: 0.9, voice: 'fr-FR-HenriNeural' },
          messagesPersonnalises: {
            greeting: "Eh, salut mon ami(e) ! Moi c'est Kouadio. On va pratiquer ensemble, c'est parti !",
            encouragement: ["Waouh, c'est bien ça !", 'Tu gères !', 'Comme un vrai locuteur natif !', "C'est ça même !"],
            correction: 'Hmm, pas exactement. Écoute bien, je vais répéter pour toi...',
          },
          isActive: true,
        },
      });
      kouadioCreated++;
      console.log(`  ✅ Kouadio ♂ → ${lang.nom}`);
    } else {
      console.log(`  ⏭ Kouadio (${lang.nom}) existe déjà`);
    }
  }

  // Bilan final
  const total = await prisma.tutor.count();
  const zele = await prisma.tutor.count({ where: { nomAvatar: 'Zélé' } });
  const kouadio = await prisma.tutor.count({ where: { nomAvatar: 'Kouadio' } });
  const cultural = total - zele - kouadio;
  console.log(`\n📊 Bilan production :`);
  console.log(`   🤖 Zélé ♀ : ${zele} entrées`);
  console.log(`   🤖 Kouadio ♂ : ${kouadio} entrées`);
  console.log(`   🎭 Tuteurs culturels : ${cultural}`);
  console.log(`   Total : ${total}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
