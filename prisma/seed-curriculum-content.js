/**
 * Seed contenu démo du cursus scolaire
 * -------------------------------------
 * Distribue les leçons actives existantes sur CP1, CP2, CE1 par langue.
 * CONTENU TEMPORAIRE — supprimable avec : node prisma/reset-curriculum-content.js
 *
 * Usage : node prisma/seed-curriculum-content.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Nombre de leçons à assigner par classe
const LECONS_PAR_CLASSE = 4;

// Distribution des piliers en rotation
const PILIERS = ['LANGUE_COMMUNICATION', 'CULTURE_CITOYENNETE', 'PRATIQUE_METIERS'];

// Classes cibles pour le démo (CP1, CP2, CE1)
const GRADES_CIBLES = ['CP1', 'CP2', 'CE1'];

async function main() {
  console.log('📚 Seed contenu démo du cursus scolaire\n');

  // Récupérer les classes cibles
  const grades = await prisma.gradeLevel.findMany({
    where: { code: { in: GRADES_CIBLES } },
    orderBy: { ordre: 'asc' },
  });

  if (grades.length === 0) {
    console.error('❌ Aucune classe trouvée. Lancez d\'abord : node prisma/seed-curriculum.js');
    process.exit(1);
  }

  // Récupérer toutes les langues actives
  const languages = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: { nom: 'asc' },
  });

  console.log(`Langues actives : ${languages.map(l => l.nom).join(', ')}\n`);

  let totalAssigned = 0;

  for (const lang of languages) {
    // Toutes les leçons actives de cette langue sans classe assignée, ordonnées
    const lecons = await prisma.lesson.findMany({
      where: { languageId: lang.id, isActive: true, gradeLevelId: null },
      orderBy: { ordre: 'asc' },
    });

    if (lecons.length === 0) {
      console.log(`  ⚠  ${lang.nom} — aucune leçon active disponible`);
      continue;
    }

    let lessonIdx = 0;

    for (const grade of grades) {
      const tranche = lecons.slice(lessonIdx, lessonIdx + LECONS_PAR_CLASSE);
      if (tranche.length === 0) break;

      for (let i = 0; i < tranche.length; i++) {
        const lecon = tranche[i];
        const pilier = PILIERS[i % PILIERS.length];
        await prisma.lesson.update({
          where: { id: lecon.id },
          data: { gradeLevelId: grade.id, pilier, isObligatoire: true },
        });
      }

      console.log(`  ✓ ${lang.nom.padEnd(14)} → ${grade.nom} : ${tranche.length} leçon(s) assignée(s)`);
      totalAssigned += tranche.length;
      lessonIdx += LECONS_PAR_CLASSE;
      if (lessonIdx >= lecons.length) break;
    }
  }

  console.log(`\n✅ ${totalAssigned} leçon(s) assignée(s) au total.`);
  console.log('ℹ️  Pour réinitialiser : node prisma/reset-curriculum-content.js');
}

main()
  .catch(e => { console.error('❌', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
