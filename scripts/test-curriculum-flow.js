/**
 * Test de bout en bout du Cursus Scolaire (Phase A)
 * --------------------------------------------------
 * Simule un parcours élève complet :
 *  1. Inscription au cursus (test de positionnement → CP1, pas de questions seedées)
 *  2. Complétion des leçons obligatoires de CP1 (score ≥ seuil)
 *  3. Passage automatique en CP2
 *  4. Vérification du livret (historique)
 *  5. Tentative de 2ème langue → refusée (CP2 non terminé)
 * Nettoie ses données de test à la fin.
 *
 * Usage : node scripts/test-curriculum-flow.js  (API démarrée sur :3000)
 */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API = process.env.TEST_API_URL || 'http://localhost:3000/api';

let failures = 0;
function check(label, cond, extra = '') {
  console.log(`  ${cond ? '✅' : '❌'} ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) failures++;
}

async function main() {
  console.log('🧪 Test du Cursus Scolaire — Phase A\n');

  // ---- Préparation : utilisateur + 2 leçons CP1 de test ----
  const user = await prisma.user.upsert({
    where: { email: 'eleve.test@languesivoire.ci' },
    update: {},
    create: { nom: 'TEST', prenom: 'Élève', email: 'eleve.test@languesivoire.ci', role: 'USER' },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const langs = await prisma.language.findMany({ where: { isActive: true }, take: 2, orderBy: { ordreAffichage: 'asc' } });
  if (langs.length < 2) throw new Error('Au moins 2 langues actives requises pour le test');
  const [lang1, lang2] = langs;
  console.log(`  Langues de test : ${lang1.nom} (principale), ${lang2.nom} (secondaire)\n`);

  const cp1 = await prisma.gradeLevel.findUnique({ where: { code: 'CP1' } });
  const testLessons = [];
  for (let i = 1; i <= 2; i++) {
    testLessons.push(await prisma.lesson.create({
      data: {
        languageId: lang1.id, titre: `[TEST CURSUS] Leçon CP1 n°${i}`, pointsXp: 50,
        gradeLevelId: cp1.id, pilier: 'LANGUE_COMMUNICATION', isObligatoire: true,
      },
    }));
  }

  // Nettoyage préalable d'un éventuel run précédent
  await prisma.enrollmentHistory.deleteMany({ where: { enrollment: { userId: user.id } } });
  await prisma.enrollment.deleteMany({ where: { userId: user.id } });
  await prisma.placementResult.deleteMany({ where: { userId: user.id } });

  try {
    // ---- 1. Référentiel ----
    const grades = await (await fetch(`${API}/curriculum/grades`)).json();
    check('GET /grades retourne les 16 niveaux', grades.length === 16, `${grades.length} niveaux`);

    const modules = await (await fetch(`${API}/curriculum/modules`, { headers: H })).json();
    const dict = modules.find(m => m.moduleKey === 'dictionary');
    const conj = modules.find(m => m.moduleKey === 'conjugation');
    check('Dictionnaire libre (toujours débloqué)', dict?.unlocked === true);
    check('Conjugaison verrouillée sans inscription', conj?.unlocked === false);

    // ---- 2. Test de positionnement (pas de questions → CP1 direct) ----
    const placement = await (await fetch(`${API}/curriculum/placement/${lang1.id}`, { headers: H })).json();
    check('Placement sans questions → directCP1', placement.directCP1 === true);

    const enroll = await (await fetch(`${API}/curriculum/placement/${lang1.id}`, {
      method: 'POST', headers: H, body: JSON.stringify({ answers: [] }),
    })).json();
    check('Inscription créée en CP1', enroll.enrollment?.gradeLevel?.code === 'CP1');
    check('Première langue = principale', enroll.enrollment?.isPrincipal === true);

    // Double inscription refusée
    const dup = await fetch(`${API}/curriculum/placement/${lang1.id}`, {
      method: 'POST', headers: H, body: JSON.stringify({ answers: [] }),
    });
    check('Double inscription refusée (409)', dup.status === 409);

    // ---- 3. 2ème langue refusée avant la fin du CP2 ----
    const second = await fetch(`${API}/curriculum/placement/${lang2.id}`, {
      method: 'POST', headers: H, body: JSON.stringify({ answers: [] }),
    });
    check('2ème langue refusée avant fin CP2 (403)', second.status === 403);

    // ---- 4. Progression : pas prêt tant que les leçons ne sont pas faites ----
    let prog = await (await fetch(`${API}/curriculum/enrollments/${lang1.id}/check-progression`, {
      method: 'POST', headers: H,
    })).json();
    check('Pas de passage sans leçons complétées', prog.promoted === false && prog.reason === 'conditions_non_remplies');

    // ---- 5. Compléter les 2 leçons obligatoires avec un bon score ----
    for (const l of testLessons) {
      await fetch(`${API}/users/me/lessons/${l.id}/complete`, {
        method: 'POST', headers: H, body: JSON.stringify({ score: 90 }),
      });
    }

    const detail = await (await fetch(`${API}/curriculum/enrollments/${lang1.id}`, { headers: H })).json();
    check('Détail : 2/2 leçons complétées', detail.progression?.lessonsCompleted === 2);
    check('Détail : moyenne 90%', detail.progression?.moyenne === 90);
    check('Détail : prêt pour le passage', detail.progression?.readyForPromotion === true);

    // ---- 6. Passage automatique CP1 → CP2 ----
    prog = await (await fetch(`${API}/curriculum/enrollments/${lang1.id}/check-progression`, {
      method: 'POST', headers: H,
    })).json();
    check('Passage automatique CP1 → CP2', prog.promoted === true && prog.to?.code === 'CP2', prog.message);

    // ---- 7. Livret de scolarité ----
    const mine = await (await fetch(`${API}/curriculum/enrollments`, { headers: H })).json();
    const e1 = mine.enrollments?.find(e => e.languageId === lang1.id);
    check('Classe actuelle : CP2', e1?.gradeLevel?.code === 'CP2');
    check('Livret : CP1 validé (passage AUTO)', e1?.historique?.length === 1 && e1.historique[0].passageMode === 'AUTO');
    check('2ème langue toujours verrouillée (CP2 en cours)', mine.secondLanguageUnlocked === false);

    // ---- 8. Modules avec inscription : alphabet débloqué, conjugaison (CM1) verrouillée ----
    const mods2 = await (await fetch(`${API}/curriculum/modules?languageId=${lang1.id}`, { headers: H })).json();
    check('Alphabet débloqué en CP2', mods2.find(m => m.moduleKey === 'alphabet')?.unlocked === true);
    check('Conjugaison (CM1) verrouillée en CP2', mods2.find(m => m.moduleKey === 'conjugation')?.unlocked === false);

  } finally {
    // ---- Nettoyage ----
    await prisma.userProgress.deleteMany({ where: { userId: user.id, lessonId: { in: testLessons.map(l => l.id) } } });
    await prisma.enrollmentHistory.deleteMany({ where: { enrollment: { userId: user.id } } });
    await prisma.enrollment.deleteMany({ where: { userId: user.id } });
    await prisma.placementResult.deleteMany({ where: { userId: user.id } });
    await prisma.lesson.deleteMany({ where: { id: { in: testLessons.map(l => l.id) } } });
    console.log('\n🧹 Données de test nettoyées');
  }

  console.log(failures === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${failures} test(s) en échec`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('💥 Erreur :', e); process.exit(1); }).finally(() => prisma.$disconnect());
