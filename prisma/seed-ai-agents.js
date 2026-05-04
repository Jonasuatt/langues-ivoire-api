const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Seed des 2 agents IA linguistiques principaux :
 * - Zélé (♀) : guide douce et patiente
 * - Kouadio (♂) : dynamique et encourageant
 *
 * Ces agents sont associés à TOUTES les langues (un tuteur par agent par langue)
 */
async function main() {
  const languages = await prisma.language.findMany({ where: { isActive: true } });
  console.log(`${languages.length} langues actives trouvées\n`);

  const agents = [
    {
      nomAvatar: 'Zélé',
      genre: 'F',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,r_max/docs/models.jpg',
      personalite: 'Douce et patiente, Zélé guide les débutants avec bienveillance. Elle répète chaque mot lentement et encourage chaque progrès.',
      voixConfig: { speed: 0.85, pitch: 1.15, voice: 'fr-FR-DeniseNeural' },
      messagesPersonnalises: {
        greeting: 'Bonjour ! Je suis Zélé, votre tutrice. Écoutez ma prononciation et répétez après moi. N\'ayez pas peur de vous tromper !',
        encouragement: ['Très bien !', 'Bravo, continuez comme ça !', 'Vous progressez, je suis fière de vous !', 'Excellent travail !'],
        correction: 'Pas tout à fait, mais vous êtes sur la bonne voie. Écoutez encore une fois...',
      },
    },
    {
      nomAvatar: 'Kouadio',
      genre: 'M',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,r_max/docs/models2.jpg',
      personalite: 'Dynamique et encourageant, Kouadio rend l\'apprentissage amusant. Il utilise des expressions du quotidien et des anecdotes culturelles.',
      voixConfig: { speed: 1.0, pitch: 0.9, voice: 'fr-FR-HenriNeural' },
      messagesPersonnalises: {
        greeting: 'Eh, salut mon ami(e) ! Moi c\'est Kouadio. On va pratiquer ensemble, c\'est parti ! Tu vas voir, c\'est pas compliqué !',
        encouragement: ['Waouh, c\'est bien ça !', 'Tu gères !', 'Comme un vrai locuteur natif !', 'C\'est ça même !'],
        correction: 'Hmm, pas exactement. Écoute bien, je vais répéter pour toi...',
      },
    },
  ];

  let created = 0;

  for (const lang of languages) {
    for (const agent of agents) {
      // Vérifier si ce tuteur existe déjà pour cette langue
      const exists = await prisma.tutor.findFirst({
        where: { nomAvatar: agent.nomAvatar, languageId: lang.id },
      });

      if (exists) {
        console.log(`  ⏭ ${agent.nomAvatar} (${lang.nom}) existe déjà`);
        continue;
      }

      await prisma.tutor.create({
        data: {
          languageId: lang.id,
          ...agent,
          isActive: true,
        },
      });
      created++;
      console.log(`  ✅ ${agent.nomAvatar} ${agent.genre === 'F' ? '♀' : '♂'} → ${lang.nom}`);
    }
  }

  console.log(`\n🤖 ${created} agents IA créés (${agents.length} agents × ${languages.length} langues)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
