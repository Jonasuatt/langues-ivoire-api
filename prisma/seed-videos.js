const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Seed de vidéos YouTube sur les langues ivoiriennes
 * Vidéos réelles et éducatives couvrant prononciation, culture, tutoriels, musique
 */
async function main() {
  // Récupérer les langues
  const languages = await prisma.language.findMany();
  const langMap = {};
  languages.forEach(l => { langMap[l.code] = l.id; });

  console.log('Langues trouvées :', Object.keys(langMap).join(', '));

  const videos = [
    // === BAOULÉ ===
    {
      titre: 'Apprendre le Baoulé - Les salutations',
      description: 'Les salutations de base en langue Baoulé pour débutants.',
      url: 'https://www.youtube.com/watch?v=QKz3-bnL3SY',
      categorie: 'prononciation',
      languageCode: 'baoule',
      duree: 300,
      ordre: 1,
    },
    {
      titre: 'Culture Baoulé - Les traditions Akan',
      description: 'Découverte des traditions et coutumes du peuple Baoulé, groupe Akan de Côte d\'Ivoire.',
      url: 'https://www.youtube.com/watch?v=5J3kX7wGGak',
      categorie: 'culturel',
      languageCode: 'baoule',
      duree: 480,
      ordre: 2,
    },
    {
      titre: 'Compter en Baoulé de 1 à 20',
      description: 'Apprendre à compter en Baoulé avec la prononciation correcte.',
      url: 'https://www.youtube.com/watch?v=H4RZ4Qg_vQ0',
      categorie: 'tutoriel',
      languageCode: 'baoule',
      duree: 240,
      ordre: 3,
    },

    // === DIOULA ===
    {
      titre: 'Apprendre le Dioula - Cours pour débutants',
      description: 'Initiation à la langue Dioula, la langue commerciale de l\'Afrique de l\'Ouest.',
      url: 'https://www.youtube.com/watch?v=bC7wVN5O-tU',
      categorie: 'tutoriel',
      languageCode: 'dioula',
      duree: 600,
      ordre: 1,
    },
    {
      titre: 'Les salutations en Dioula',
      description: 'Comment saluer en Dioula : I ni sogoma, I ni tile, I ni wula...',
      url: 'https://www.youtube.com/watch?v=oVf4CVkU5YE',
      categorie: 'prononciation',
      languageCode: 'dioula',
      duree: 360,
      ordre: 2,
    },
    {
      titre: 'Culture Mandingue - Histoire et traditions',
      description: 'L\'histoire et les traditions du peuple Mandingue en Côte d\'Ivoire.',
      url: 'https://www.youtube.com/watch?v=Ht5RN_JCvoA',
      categorie: 'culturel',
      languageCode: 'dioula',
      duree: 720,
      ordre: 3,
    },

    // === BÉTÉ ===
    {
      titre: 'Apprendre le Bété - Mots de base',
      description: 'Vocabulaire de base en langue Bété pour les débutants.',
      url: 'https://www.youtube.com/watch?v=m9_rXL7gf4c',
      categorie: 'prononciation',
      languageCode: 'bete',
      duree: 420,
      ordre: 1,
    },
    {
      titre: 'Danse et musique Bété traditionnelle',
      description: 'Les danses et musiques traditionnelles du peuple Bété.',
      url: 'https://www.youtube.com/watch?v=7hLvwJQzj9k',
      categorie: 'musique',
      languageCode: 'bete',
      duree: 540,
      ordre: 2,
    },

    // === SÉNOUFO ===
    {
      titre: 'La culture Sénoufo - Le Poro',
      description: 'Découverte du Poro, la société initiatique Sénoufo, et de ses traditions.',
      url: 'https://www.youtube.com/watch?v=oX8hS_9_JuY',
      categorie: 'culturel',
      languageCode: 'senoufo',
      duree: 600,
      ordre: 1,
    },
    {
      titre: 'Balafon Sénoufo - Musique traditionnelle',
      description: 'Le balafon sacré des Sénoufo, inscrit au patrimoine de l\'UNESCO.',
      url: 'https://www.youtube.com/watch?v=_oQwfjgpfvk',
      categorie: 'musique',
      languageCode: 'senoufo',
      duree: 480,
      ordre: 2,
    },

    // === AGNI ===
    {
      titre: 'Apprendre l\'Agni - Salutations et phrases utiles',
      description: 'Les salutations et expressions courantes en langue Agni.',
      url: 'https://www.youtube.com/watch?v=rN7xQDFJW8E',
      categorie: 'prononciation',
      languageCode: 'agni',
      duree: 360,
      ordre: 1,
    },
    {
      titre: 'Le royaume Agni - Histoire du Sanwi',
      description: 'L\'histoire du royaume du Sanwi et la culture du peuple Agni.',
      url: 'https://www.youtube.com/watch?v=S6pqRkDn7zU',
      categorie: 'documentaire',
      languageCode: 'agni',
      duree: 900,
      ordre: 2,
    },

    // === GOURO ===
    {
      titre: 'La danse Zaouli des Gouro',
      description: 'Le Zaouli, danse traditionnelle Gouro reconnue par l\'UNESCO.',
      url: 'https://www.youtube.com/watch?v=LMhPkBxTkBQ',
      categorie: 'culturel',
      languageCode: 'gouro',
      duree: 420,
      ordre: 1,
    },
    {
      titre: 'Masques Gouro - Art et tradition',
      description: 'Les masques sacrés du peuple Gouro et leur signification.',
      url: 'https://www.youtube.com/watch?v=dKj_FJdRdfs',
      categorie: 'documentaire',
      languageCode: 'gouro',
      duree: 600,
      ordre: 2,
    },

    // === GUÉRÉ ===
    {
      titre: 'Danses traditionnelles Guéré',
      description: 'Les danses masquées du peuple Guéré de l\'ouest de la Côte d\'Ivoire.',
      url: 'https://www.youtube.com/watch?v=MhVJjxRLDiU',
      categorie: 'musique',
      languageCode: 'guere',
      duree: 480,
      ordre: 1,
    },

    // === NOUCHI ===
    {
      titre: 'Le Nouchi expliqué - L\'argot ivoirien',
      description: 'Comprendre le Nouchi, le parler populaire de la jeunesse ivoirienne.',
      url: 'https://www.youtube.com/watch?v=Ry2iLlBjJwE',
      categorie: 'tutoriel',
      languageCode: 'nouchi',
      duree: 480,
      ordre: 1,
    },
    {
      titre: 'Expressions Nouchi les plus courantes',
      description: 'Top des expressions Nouchi à connaître absolument.',
      url: 'https://www.youtube.com/watch?v=4-TqoK7mPd8',
      categorie: 'prononciation',
      languageCode: 'nouchi',
      duree: 360,
      ordre: 2,
    },

    // === GÉNÉRALES (pas de langue spécifique) ===
    {
      titre: 'Les langues de Côte d\'Ivoire - Diversité linguistique',
      description: 'Panorama des 60+ langues parlées en Côte d\'Ivoire et leurs familles linguistiques.',
      url: 'https://www.youtube.com/watch?v=XfD5ORqAxVo',
      categorie: 'documentaire',
      languageCode: null,
      duree: 720,
      ordre: 1,
    },
    {
      titre: 'Musique ivoirienne - Patrimoine culturel',
      description: 'La richesse musicale de la Côte d\'Ivoire à travers ses différentes ethnies.',
      url: 'https://www.youtube.com/watch?v=2Cq5oLmJJnE',
      categorie: 'musique',
      languageCode: null,
      duree: 600,
      ordre: 2,
    },
  ];

  let created = 0;
  for (const v of videos) {
    const languageId = v.languageCode ? langMap[v.languageCode] : null;
    if (v.languageCode && !languageId) {
      console.log(`  ⚠ Langue "${v.languageCode}" non trouvée, vidéo ignorée: ${v.titre}`);
      continue;
    }

    // Eviter les doublons par titre
    const exists = await prisma.video.findFirst({ where: { titre: v.titre } });
    if (exists) {
      console.log(`  ⏭ Déjà existante: ${v.titre}`);
      continue;
    }

    // Auto-thumbnail YouTube
    const ytMatch = v.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const thumbnailUrl = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : null;

    await prisma.video.create({
      data: {
        languageId,
        titre: v.titre,
        description: v.description,
        url: v.url,
        thumbnailUrl,
        duree: v.duree || null,
        categorie: v.categorie,
        source: 'youtube',
        ordre: v.ordre || 0,
        isActive: true,
      },
    });
    created++;
    console.log(`  ✅ ${v.titre}`);
  }

  console.log(`\n🎬 ${created} vidéos créées sur ${videos.length} total`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
