/**
 * Reset contenu démo du cursus scolaire
 * ---------------------------------------
 * Supprime toutes les assignations de classe sur les leçons
 * (gradeLevelId → null, pilier → null, isObligatoire → false).
 * Ne supprime pas les leçons elles-mêmes.
 *
 * Usage : node prisma/reset-curriculum-content.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Reset des assignations de classe sur les leçons\n');

  const { count } = await prisma.lesson.updateMany({
    where: { gradeLevelId: { not: null } },
    data: { gradeLevelId: null, pilier: null, isObligatoire: false },
  });

  console.log(`✅ ${count} leçon(s) réinitialisée(s) — aucune classe assignée.`);
}

main()
  .catch(e => { console.error('❌', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
