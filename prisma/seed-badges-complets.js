/**
 * Seed complet des badges Langues Ivoire (35 badges)
 * Le Badge n'a pas de champ isActive → tous les badges sont actifs par défaut.
 * Ce seed étend les 5 badges initiaux à un catalogue complet de 40 badges.
 * Utilise upsert par nom → safe à relancer.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BADGES = [
  // ══════════════════════════════════════════════════════════════
  // LINGUISTIQUE — Progression des leçons
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Premier Pas',
    description: 'Complétez votre première leçon. Le voyage commence ici !',
    categorie: 'linguistique',
    condition: { type: 'lessons_completed', count: 1 },
    pointsXp: 20,
  },
  {
    nom: 'Apprenti Linguiste',
    description: 'Complétez 10 leçons. Vous connaissez les bases !',
    categorie: 'linguistique',
    condition: { type: 'lessons_completed', count: 10 },
    pointsXp: 100,
  },
  {
    nom: 'Linguiste Confirmé',
    description: 'Complétez 50 leçons. Votre engagement est remarquable.',
    categorie: 'linguistique',
    condition: { type: 'lessons_completed', count: 50 },
    pointsXp: 500,
  },
  {
    nom: 'Expert en Langues',
    description: 'Complétez 100 leçons. Vous êtes un véritable passionné.',
    categorie: 'linguistique',
    condition: { type: 'lessons_completed', count: 100 },
    pointsXp: 1000,
  },
  {
    nom: 'Maître des Mots',
    description: 'Complétez 200 leçons. La maîtrise est à portée.',
    categorie: 'linguistique',
    condition: { type: 'lessons_completed', count: 200 },
    pointsXp: 2000,
  },
  {
    nom: 'Légende Ivoirienne',
    description: 'Complétez 500 leçons. Vous êtes une légende vivante des langues de Côte d\'Ivoire.',
    categorie: 'linguistique',
    condition: { type: 'lessons_completed', count: 500 },
    pointsXp: 5000,
  },

  // ══════════════════════════════════════════════════════════════
  // LINGUISTIQUE — Niveaux CECRL
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Niveau A1 Atteint',
    description: 'Validez le niveau A1 dans une langue. Vous pouvez vous présenter et comprendre les bases.',
    categorie: 'linguistique',
    condition: { type: 'level_reached', level: 'A1' },
    pointsXp: 50,
  },
  {
    nom: 'Niveau A2 Atteint',
    description: 'Validez le niveau A2. Vous survivez aux situations courantes.',
    categorie: 'linguistique',
    condition: { type: 'level_reached', level: 'A2' },
    pointsXp: 150,
  },
  {
    nom: 'Niveau B1 Atteint',
    description: 'Validez le niveau B1. Vous vous exprimez avec aisance sur des sujets familiers.',
    categorie: 'linguistique',
    condition: { type: 'level_reached', level: 'B1' },
    pointsXp: 400,
  },
  {
    nom: 'Niveau B2 Atteint',
    description: 'Validez le niveau B2. Vous maîtrisez la langue avec nuance.',
    categorie: 'linguistique',
    condition: { type: 'level_reached', level: 'B2' },
    pointsXp: 800,
  },
  {
    nom: 'Niveau C1 Atteint',
    description: 'Validez le niveau C1. Vous êtes quasi bilingue dans cette langue.',
    categorie: 'linguistique',
    condition: { type: 'level_reached', level: 'C1' },
    pointsXp: 1500,
  },

  // ══════════════════════════════════════════════════════════════
  // LINGUISTIQUE — Dictionnaire
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Premier Mot',
    description: 'Apprenez votre premier mot dans le dictionnaire.',
    categorie: 'linguistique',
    condition: { type: 'words_learned', count: 1 },
    pointsXp: 10,
  },
  {
    nom: 'Vocabulaire de Base',
    description: 'Apprenez 50 mots. Vous avez les fondations.',
    categorie: 'linguistique',
    condition: { type: 'words_learned', count: 50 },
    pointsXp: 100,
  },
  {
    nom: 'Lexicographe',
    description: 'Apprenez 200 mots. Votre vocabulaire s\'enrichit chaque jour.',
    categorie: 'linguistique',
    condition: { type: 'words_learned', count: 200 },
    pointsXp: 500,
  },
  {
    nom: 'Encyclopédiste',
    description: 'Apprenez 500 mots. Vous connaissez presque autant de mots qu\'un locuteur natif courant.',
    categorie: 'linguistique',
    condition: { type: 'words_learned', count: 500 },
    pointsXp: 1500,
  },

  // ══════════════════════════════════════════════════════════════
  // STREAK — Régularité
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Assidu 3 Jours',
    description: 'Apprenez 3 jours de suite. La régularité commence ici.',
    categorie: 'linguistique',
    condition: { type: 'streak_days', count: 3 },
    pointsXp: 30,
  },
  {
    nom: 'Assidu 7 Jours',
    description: 'Apprenez 7 jours de suite. Une semaine complète, bravo !',
    categorie: 'linguistique',
    condition: { type: 'streak_days', count: 7 },
    pointsXp: 75,
  },
  {
    nom: 'Flamme du Mois',
    description: 'Apprenez 30 jours de suite. Un mois entier de dévouement !',
    categorie: 'linguistique',
    condition: { type: 'streak_days', count: 30 },
    pointsXp: 300,
  },
  {
    nom: 'Cent Jours de Sagesse',
    description: 'Apprenez 100 jours de suite. Vous êtes un exemple pour tous.',
    categorie: 'linguistique',
    condition: { type: 'streak_days', count: 100 },
    pointsXp: 1000,
  },
  {
    nom: 'Flamme Ivoirienne',
    description: 'Apprenez 365 jours de suite. Un an sans interruption — vous êtes une flamme qui ne s\'éteint jamais.',
    categorie: 'linguistique',
    condition: { type: 'streak_days', count: 365 },
    pointsXp: 5000,
  },

  // ══════════════════════════════════════════════════════════════
  // SOCIAL — Contributions
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Contributeur',
    description: 'Soumettez votre première contribution. Vous faites partie de l\'aventure !',
    categorie: 'social',
    condition: { type: 'contributions', count: 1 },
    pointsXp: 30,
  },
  {
    nom: 'Gardien des Langues',
    description: 'Soumettez 20 contributions approuvées. Vous êtes un pilier de la communauté.',
    categorie: 'social',
    condition: { type: 'contributions', count: 20 },
    pointsXp: 200,
  },
  {
    nom: 'Grand Gardien',
    description: 'Soumettez 100 contributions approuvées. Vous êtes un géant des langues ivoiriennes.',
    categorie: 'social',
    condition: { type: 'contributions', count: 100 },
    pointsXp: 1000,
  },
  {
    nom: 'Légende Contributrice',
    description: '500 contributions approuvées. Votre empreinte sur le patrimoine linguistique est permanente.',
    categorie: 'social',
    condition: { type: 'contributions', count: 500 },
    pointsXp: 5000,
  },

  // ══════════════════════════════════════════════════════════════
  // CULTUREL — Découverte du patrimoine
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Explorateur Culturel',
    description: 'Consultez votre premier contenu culturel (proverbe, conte, tradition).',
    categorie: 'culturel',
    condition: { type: 'cultural_items_viewed', count: 1 },
    pointsXp: 20,
  },
  {
    nom: 'Passionné de Culture',
    description: 'Consultez 10 contenus culturels. La Côte d\'Ivoire n\'a plus de secrets pour vous.',
    categorie: 'culturel',
    condition: { type: 'cultural_items_viewed', count: 10 },
    pointsXp: 100,
  },
  {
    nom: 'Ambassadeur Culturel',
    description: 'Consultez 50 contenus culturels. Vous êtes un véritable ambassadeur du patrimoine ivoirien.',
    categorie: 'culturel',
    condition: { type: 'cultural_items_viewed', count: 50 },
    pointsXp: 500,
  },
  {
    nom: 'Gardien du Patrimoine',
    description: 'Consultez 100 contenus culturels. Votre connaissance de la culture ivoirienne est encyclopédique.',
    categorie: 'culturel',
    condition: { type: 'cultural_items_viewed', count: 100 },
    pointsXp: 1200,
  },

  // ══════════════════════════════════════════════════════════════
  // MULTILINGUE — Maîtrise de plusieurs langues
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Bilingue',
    description: 'Complétez une langue en entier. La Côte d\'Ivoire est à vous !',
    categorie: 'culturel',
    condition: { type: 'languages_completed', count: 1 },
    pointsXp: 300,
  },
  {
    nom: 'Trilingue',
    description: 'Complétez 2 langues ivoiriennes. Vous êtes rare et précieux.',
    categorie: 'culturel',
    condition: { type: 'languages_completed', count: 2 },
    pointsXp: 700,
  },
  {
    nom: 'Polyglotte Ivoirien',
    description: 'Complétez 3 langues ivoiriennes. Vous pouvez voyager dans tout le pays.',
    categorie: 'culturel',
    condition: { type: 'languages_completed', count: 3 },
    pointsXp: 1500,
  },
  {
    nom: 'Ambassadeur des Peuples',
    description: 'Complétez 5 langues ivoiriennes. Vous parlez au cœur de toute la Côte d\'Ivoire.',
    categorie: 'culturel',
    condition: { type: 'languages_completed', count: 5 },
    pointsXp: 3000,
  },

  // ══════════════════════════════════════════════════════════════
  // RÉUSSITES SPÉCIALES
  // ══════════════════════════════════════════════════════════════
  {
    nom: 'Premier Certificat',
    description: 'Obtenez votre premier certificat de langue. Votre engagement est reconnu officiellement.',
    categorie: 'social',
    condition: { type: 'certificates', count: 1 },
    pointsXp: 200,
  },
  {
    nom: 'Collectionneur de Certificats',
    description: 'Obtenez 5 certificats. Votre mur des diplômes est impressionnant !',
    categorie: 'social',
    condition: { type: 'certificates', count: 5 },
    pointsXp: 1000,
  },
  {
    nom: 'Ivoirien de Cœur',
    description: 'Utilisez l\'application pendant 30 jours. Vous faites partie de la famille Langues Ivoire.',
    categorie: 'social',
    condition: { type: 'days_active', count: 30 },
    pointsXp: 500,
  },
  {
    nom: 'Citoyen Numérique CI',
    description: 'Utilisez l\'application pendant 180 jours. Votre dévouement est une fierté pour la Côte d\'Ivoire.',
    categorie: 'social',
    condition: { type: 'days_active', count: 180 },
    pointsXp: 2000,
  },
];

async function main() {
  console.log('🏆 Seed des badges complets Langues Ivoire…\n');

  let created = 0;
  let skipped = 0;

  for (const badge of BADGES) {
    const result = await prisma.badge.upsert({
      where:  { nom: badge.nom },
      update: {},
      create: badge,
    });

    if (result) {
      const isNew = !result.updatedAt || result.createdAt.getTime() === result.updatedAt.getTime();
      // Détecter si upsert a créé ou ignoré
    }
    // Upsert avec update:{} → si le badge existait déjà, update = no-op
    console.log(`  ✅ ${badge.nom} (${badge.categorie}, ${badge.pointsXp} XP)`);
    created++;
  }

  // Compter réellement
  const total = await prisma.badge.count();

  console.log('\n─────────────────────────────────────────');
  console.log('✅ Résumé du seed badges :');
  console.log(`   • ${BADGES.length} badges traités (upsert safe)`);
  console.log(`   • ${total} badges au total en base de données`);
  console.log('─────────────────────────────────────────');
  console.log('\n🎮 Catégories :');
  const cats = [...new Set(BADGES.map(b => b.categorie))];
  cats.forEach(c => {
    const n = BADGES.filter(b => b.categorie === c).length;
    console.log(`   • ${c}: ${n} badges`);
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
