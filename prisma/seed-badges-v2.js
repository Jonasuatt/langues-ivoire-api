const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BADGES_V2 = [
  // Streak
  { nom: 'Flamme Naissante', description: 'Maintenez un streak de 3 jours', categorie: 'linguistique', condition: { type: 'streak', count: 3 }, pointsXp: 30 },
  { nom: 'Flamme Ardente', description: 'Maintenez un streak de 7 jours', categorie: 'linguistique', condition: { type: 'streak', count: 7 }, pointsXp: 75 },
  { nom: 'Flamme Éternelle', description: 'Maintenez un streak de 30 jours', categorie: 'linguistique', condition: { type: 'streak', count: 30 }, pointsXp: 300 },
  // Multi-langues
  { nom: 'Polyglotte en Herbe', description: 'Complétez des leçons dans 3 langues différentes', categorie: 'linguistique', condition: { type: 'languages_studied', count: 3 }, pointsXp: 100 },
  { nom: 'Maître Polyglotte', description: 'Complétez des leçons dans 6 langues différentes', categorie: 'linguistique', condition: { type: 'languages_studied', count: 6 }, pointsXp: 250 },
  // Leçons complémentaires
  { nom: 'Assidu', description: 'Complétez 5 leçons', categorie: 'linguistique', condition: { type: 'lessons_completed', count: 5 }, pointsXp: 50 },
  { nom: 'Scholar', description: 'Complétez 25 leçons', categorie: 'linguistique', condition: { type: 'lessons_completed', count: 25 }, pointsXp: 250 },
  { nom: 'Érudit des Langues', description: 'Complétez 100 leçons', categorie: 'linguistique', condition: { type: 'lessons_completed', count: 100 }, pointsXp: 1000 },
  // XP
  { nom: 'Première Étoile', description: 'Accumulez 100 XP', categorie: 'linguistique', condition: { type: 'total_xp', count: 100 }, pointsXp: 20 },
  { nom: 'Étoile Montante', description: 'Accumulez 500 XP', categorie: 'linguistique', condition: { type: 'total_xp', count: 500 }, pointsXp: 50 },
  { nom: 'Étoile d\'Or', description: 'Accumulez 2000 XP', categorie: 'linguistique', condition: { type: 'total_xp', count: 2000 }, pointsXp: 200 },
  // Culturel
  { nom: 'Curieux Culturel', description: 'Consultez 5 éléments culturels', categorie: 'culturel', condition: { type: 'cultural_views', count: 5 }, pointsXp: 30 },
  { nom: 'Gardien de la Tradition', description: 'Consultez 20 éléments culturels', categorie: 'culturel', condition: { type: 'cultural_views', count: 20 }, pointsXp: 100 },
  // Social
  { nom: 'Ambassadeur', description: 'Soumettez 5 contributions', categorie: 'social', condition: { type: 'contributions', count: 5 }, pointsXp: 75 },
  { nom: 'Pilier Communautaire', description: 'Soumettez 50 contributions approuvées', categorie: 'social', condition: { type: 'contributions', count: 50 }, pointsXp: 500 },
  // Niveau
  { nom: 'Niveau A2 Atteint', description: 'Complétez une leçon de niveau A2', categorie: 'linguistique', condition: { type: 'level_reached', level: 'A2' }, pointsXp: 50 },
  { nom: 'Niveau B1 Atteint', description: 'Complétez une leçon de niveau B1', categorie: 'linguistique', condition: { type: 'level_reached', level: 'B1' }, pointsXp: 100 },
];

async function main() {
  console.log('🏆 Insertion des badges V2...\n');
  let created = 0, skipped = 0;

  for (const badge of BADGES_V2) {
    const existing = await prisma.badge.findUnique({ where: { nom: badge.nom } });
    if (existing) { skipped++; continue; }
    await prisma.badge.create({ data: badge });
    created++;
    console.log(`  ✓ ${badge.nom}`);
  }

  console.log(`\n✅ ${created} badges créés, ${skipped} doublons ignorés`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
