/**
 * Seed du Cursus Scolaire (Phase A)
 * ---------------------------------
 * - 16 niveaux : CP1 → Terminale + Parcours Chercheur I-III
 * - Mapping des modules pédagogiques (verrouillés par classe)
 *   vs outils/patrimoine (toujours libres)
 *
 * Modes de passage :
 * - AUTO   : algorithme de score (seuil 75% + leçons obligatoires terminées)
 * - COMITE : validation par le comité d'experts (examens charnières — Phase B)
 *
 * Usage : node prisma/seed-curriculum.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { GRADE_LEVELS, CURRICULUM_MODULES } = require('./curriculum-data');

async function main() {
  console.log('🏫 Seed du Cursus Scolaire — Phase A\n');

  // 1) Niveaux scolaires
  for (const g of GRADE_LEVELS) {
    await prisma.gradeLevel.upsert({
      where: { code: g.code },
      update: { nom: g.nom, ordre: g.ordre, cycle: g.cycle, passageMode: g.passageMode, seuilPassage: g.seuilPassage, description: g.description },
      create: g,
    });
    console.log(`  ✓ ${g.code.padEnd(12)} (${g.cycle}, passage ${g.passageMode})`);
  }

  // 2) Modules du cursus et outils libres
  console.log('');
  for (const m of CURRICULUM_MODULES) {
    await prisma.curriculumModule.upsert({
      where: { moduleKey: m.moduleKey },
      update: { nom: m.nom, pilier: m.pilier, minGradeOrdre: m.minGradeOrdre, isCursus: m.isCursus },
      create: m,
    });
    console.log(`  ✓ ${m.moduleKey.padEnd(18)} ${m.isCursus ? `🔒 cursus (dès ordre ${m.minGradeOrdre})` : '🆓 libre'}`);
  }

  const counts = {
    grades: await prisma.gradeLevel.count(),
    modules: await prisma.curriculumModule.count(),
  };
  console.log(`\n✅ Terminé : ${counts.grades} niveaux, ${counts.modules} modules configurés.`);
}

main()
  .catch((e) => { console.error('❌ Erreur seed cursus :', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
