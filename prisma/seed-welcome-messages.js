/**
 * Seed des messages de bienvenue pour les 9 langues MVP
 * Met à jour le champ welcomeMessage de chaque langue active.
 * Utilise update (pas upsert) — ne touche qu'aux welcomeMessage null/vide.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const WELCOME_MESSAGES = [
  {
    code: 'baoule',
    welcomeMessage: "Akwaba ! Mé yran Langues Ivoire app su. Wawê, i kô yê baoule kuli. N'da !",
    // "Bienvenue ! Je suis dans l'app Langues Ivoire. Ensemble, nous allons apprendre le baoulé. Merci !"
  },
  {
    code: 'dioula',
    welcomeMessage: "I ni ce ! Aw bɛ se ka kalan dioula la yan, Langues Ivoire app kɔnɔ. Aw ni baara !",
    // "Bonjour ! Vous pouvez apprendre le dioula ici, dans l'app Langues Ivoire. Bon courage !"
  },
  {
    code: 'bete',
    welcomeMessage: "Zébéhi ! I ôh nœ Langues Ivoire app kô. Déhi ah beh bété kɔ.",
    // "Bienvenue ! Tu es dans l'app Langues Ivoire. Ensemble, nous apprendrons le bété."
  },
  {
    code: 'senoufo',
    welcomeMessage: "Nagnon ! Wô fô Langues Ivoire app kô. Naha lèh sénoufo pè. Yalê !",
    // "Bienvenue ! Tu es dans l'app Langues Ivoire. Apprenons ensemble le sénoufo. Bonne chance !"
  },
  {
    code: 'agni',
    welcomeMessage: "Akwaba ! Wô hɔn Langues Ivoire app su. Yè kô agni kali. Meda wase !",
    // "Bienvenue ! Tu es dans l'app Langues Ivoire. Nous allons apprendre l'agni ensemble. Merci !"
  },
  {
    code: 'gouro',
    welcomeMessage: "Nouhan ! Wii ka si Langues Ivoire app yé. Yè si gouro kali.",
    // "Bienvenue ! Tu es dans l'app Langues Ivoire. Apprenons le gouro ensemble."
  },
  {
    code: 'guere',
    welcomeMessage: "Wahon ! Wii gɔ Langues Ivoire app zuu. Yè guéré kɔ gbo. Gbagba !",
    // "Bienvenue ! Tu es dans l'app Langues Ivoire. Apprenons le guéré bien. Courage !"
  },
  {
    code: 'nouchi',
    welcomeMessage: "Dégueu frérot ! T'es sur Langues Ivoire, l'app des langues de chez nous. On va apprendre ensemble, sans chicotter ! Yako !",
    // Nouchi — argot abidjanais, décontracté
  },
  {
    code: 'yacouba',
    welcomeMessage: "Bii yo ! Zo wuu Langues Ivoire app kô. Yè Dan kali sɛɛ. Yèkè !",
    // "Bonjour ! Tu es dans l'app Langues Ivoire. Apprenons bien le Dan (Yacouba). C'est parti !"
  },
];

async function main() {
  console.log('🌟 Seed des messages de bienvenue pour les langues MVP…\n');

  let updated = 0;
  let skipped = 0;

  for (const item of WELCOME_MESSAGES) {
    const lang = await prisma.language.findUnique({ where: { code: item.code } });
    if (!lang) {
      console.log(`  ⚠️  Langue introuvable : ${item.code}`);
      continue;
    }

    // Ne mettre à jour que si welcomeMessage est null/vide
    if (lang.welcomeMessage) {
      console.log(`  ⏭  ${lang.nom} (message déjà configuré)`);
      skipped++;
      continue;
    }

    await prisma.language.update({
      where: { id: lang.id },
      data:  { welcomeMessage: item.welcomeMessage },
    });
    console.log(`  ✅ ${lang.nom} → message configuré`);
    updated++;
  }

  console.log('\n─────────────────────────────────────────');
  console.log('✅ Résumé messages de bienvenue :');
  console.log(`   • ${updated} messages configurés`);
  console.log(`   • ${skipped} déjà configurés (non modifiés)`);
  console.log('─────────────────────────────────────────');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
