const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AVATAR_BASE_URL = 'https://langues-ivoire-cms.netlify.app/avatars';

const TUTORS = [
  // BAOULÉ
  { code: 'baoule', nom: 'Koffi', genre: 'M', image: 'koffi.svg',
    personalite: 'Sage et bienveillant, Koffi parle lentement et clairement. Il aime raconter des proverbes baoulé.',
    voix: { vitesse: 0.9, pitch: 0.9 } },
  { code: 'baoule', nom: 'Aya', genre: 'F', image: 'aya.svg',
    personalite: 'Douce et maternelle, Aya enseigne avec patience et encourage chaque progrès avec des mots chaleureux.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // DIOULA
  { code: 'dioula', nom: 'Amara', genre: 'M', image: 'amara.svg',
    personalite: 'Commerçant chaleureux, Amara est dynamique et encourage beaucoup l\'apprenant.',
    voix: { vitesse: 1.1, pitch: 1.0 } },
  { code: 'dioula', nom: 'Djénéba', genre: 'F', image: 'djeneba.svg',
    personalite: 'Marchande joyeuse, Djénéba utilise des expressions du marché et rend l\'apprentissage vivant.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // BÉTÉ
  { code: 'bete', nom: 'Yoro', genre: 'M', image: 'yoro.svg',
    personalite: 'Guerrier noble, Yoro est fier de sa culture et explique les traditions avec passion.',
    voix: { vitesse: 1.0, pitch: 0.9 } },
  { code: 'bete', nom: 'Ozoua', genre: 'F', image: 'ozoua.svg',
    personalite: 'Femme de caractère, Ozoua transmet la fierté bété à travers ses leçons et chants traditionnels.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // SENOUFO
  { code: 'senoufo', nom: 'Dolourou', genre: 'M', image: 'dolourou.svg',
    personalite: 'Artisan patient, Dolourou enseigne avec méthode et célèbre chaque progrès.',
    voix: { vitesse: 0.9, pitch: 1.0 } },
  { code: 'senoufo', nom: 'Tialagnon', genre: 'F', image: 'tialagnon.svg',
    personalite: 'Tisseuse créative, Tialagnon tisse les mots comme elle tisse le pagne, avec soin et beauté.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // AGNI
  { code: 'agni', nom: 'Kadio', genre: 'M', image: 'kadio.svg',
    personalite: 'Prince raffiné, Kadio insiste sur la prononciation correcte et le respect des tons.',
    voix: { vitesse: 1.0, pitch: 0.95 } },
  { code: 'agni', nom: 'Tehia', genre: 'F', image: 'tehia.svg',
    personalite: 'Princesse élégante, Tehia parle avec raffinement et insiste sur la bonne prononciation.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // GOURO
  { code: 'gouro', nom: 'Zan Bi', genre: 'M', image: 'zanbi.svg',
    personalite: 'Agriculteur humble, Zan Bi utilise des exemples de la vie quotidienne pour enseigner.',
    voix: { vitesse: 1.0, pitch: 1.0 } },
  { code: 'gouro', nom: 'Tra Lou', genre: 'F', image: 'tralou.svg',
    personalite: 'Cultivatrice généreuse, Tra Lou partage son savoir comme elle partage sa récolte, avec abondance.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // GUÉRÉ
  { code: 'guere', nom: 'Oulahi', genre: 'M', image: 'oulahi.svg',
    personalite: 'Chasseur courageux, Oulahi est direct et enthousiaste dans ses encouragements.',
    voix: { vitesse: 1.1, pitch: 0.9 } },
  { code: 'guere', nom: 'Bleka', genre: 'F', image: 'bleka.svg',
    personalite: 'Gardienne de la forêt, Bleka enseigne avec la sagesse des ancêtres et la force de la nature.',
    voix: { vitesse: 1.0, pitch: 1.1 } },

  // NOUCHI
  { code: 'nouchi', nom: 'Pololo', genre: 'M', image: 'pololo.svg',
    personalite: 'Jeune branché d\'Abidjan, Pololo est fun et utilise beaucoup d\'expressions contemporaines.',
    voix: { vitesse: 1.2, pitch: 1.0 } },
  { code: 'nouchi', nom: 'Nache', genre: 'F', image: 'nache.svg',
    personalite: 'Jeune branchée d\'Abidjan, Nache mélange tradition et modernité avec style et énergie.',
    voix: { vitesse: 1.1, pitch: 1.15 } },
];

async function main() {
  console.log('Seeding 16 tuteurs...');

  // Supprimer les anciens tuteurs
  await prisma.tutor.deleteMany();
  console.log('Anciens tuteurs supprimés.');

  for (const t of TUTORS) {
    const language = await prisma.language.findFirst({ where: { code: t.code } });
    if (!language) {
      console.log(`  ⚠ Langue ${t.code} non trouvée, skip ${t.nom}`);
      continue;
    }

    await prisma.tutor.create({
      data: {
        languageId: language.id,
        nomAvatar: t.nom,
        genre: t.genre,
        imageUrl: `${AVATAR_BASE_URL}/${t.image}`,
        voixConfig: t.voix,
        personalite: t.personalite,
        isActive: true,
      },
    });
    console.log(`  ✓ ${t.nom} (${t.code} ${t.genre})`);
  }

  console.log('Done! 16 tuteurs créés.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
