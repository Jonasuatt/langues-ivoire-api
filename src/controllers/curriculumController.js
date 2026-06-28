const prisma = require('../lib/prisma');
/**
 * Cursus Scolaire (Phase A)
 * -------------------------
 * - Test de positionnement (plafonné à la 6ème)
 * - Inscriptions (un cursus indépendant par langue)
 * - Passage automatique de classe (mode AUTO : seuil + leçons obligatoires)
 * - Les paliers COMITE (CM2→6ème, 3ème→2nde, lycée…) sont gérés en Phase B
 */
const { notifyUser } = require('../utils/notify');
const { issueCursusCertIfEligible } = require('./cursusCertificateController');

// Ordre minimal dans la langue principale pour débloquer une 2ème langue
// (être en 6ème = ordre 7, après avoir passé les examens de passage)
const ORDRE_DEBLOCAGE_LANGUE_SECONDAIRE = 7;

// Plafond du test de positionnement : la 6ème (ordre 7).
// Personne ne saute le secondaire ni les examens validés par le comité.
const ORDRE_PLAFOND_PLACEMENT = 7;

// Barème du test de positionnement (score % → ordre de classe)
function ordreFromScore(score) {
  if (score >= 70) return 7;  // 6ème (plafond)
  if (score >= 50) return 6;  // CM2
  if (score >= 35) return 5;  // CM1
  if (score >= 20) return 3;  // CE1
  return 1;                   // CP1
}

// ==================== RÉFÉRENTIEL ====================

// GET /api/curriculum/grades — les 16 niveaux du cursus
const getGrades = async (req, res, next) => {
  try {
    const grades = await prisma.gradeLevel.findMany({
      where: { isActive: true },
      orderBy: { ordre: 'asc' },
    });
    res.json(grades);
  } catch (err) { next(err); }
};

// GET /api/curriculum/modules?languageId=… — config des modules + état de verrouillage
const getModules = async (req, res, next) => {
  try {
    const { languageId } = req.query;
    const modules = await prisma.curriculumModule.findMany({
      where: { isActive: true },
      orderBy: [{ isCursus: 'desc' }, { minGradeOrdre: 'asc' }],
    });

    // Sans langue (ou sans inscription) : seuls les modules libres sont débloqués
    let ordreActuel = 0;
    if (languageId && req.user) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_languageId: { userId: req.user.id, languageId } },
        include: { gradeLevel: true },
      });
      if (enrollment) ordreActuel = enrollment.gradeLevel.ordre;
    }

    res.json(modules.map(m => ({
      ...m,
      unlocked: !m.isCursus || ordreActuel >= m.minGradeOrdre,
    })));
  } catch (err) { next(err); }
};

// ==================== TEST DE POSITIONNEMENT ====================

// GET /api/curriculum/placement/:languageId — questions (sans les solutions)
const getPlacementTest = async (req, res, next) => {
  try {
    const { languageId } = req.params;

    const existing = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId: req.user.id, languageId } },
    });
    if (existing) {
      return res.status(409).json({ error: 'Vous êtes déjà inscrit au cursus de cette langue', enrollmentId: existing.id });
    }

    const questions = await prisma.placementQuestion.findMany({
      where: { languageId, isActive: true },
      orderBy: { niveauOrdre: 'asc' },
      select: { id: true, niveauOrdre: true, donnees: true }, // jamais la solution
    });

    res.json({
      languageId,
      questionCount: questions.length,
      // S'il n'y a pas encore de questions pour cette langue, l'élève démarre en CP1
      directCP1: questions.length === 0,
      questions,
    });
  } catch (err) { next(err); }
};

// POST /api/curriculum/placement/:languageId — soumettre → classe de départ + inscription
// Body : { answers: [{ questionId, answer }] }
const submitPlacementTest = async (req, res, next) => {
  try {
    const { languageId } = req.params;
    const { answers = [] } = req.body;

    const existing = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId: req.user.id, languageId } },
    });
    if (existing) {
      return res.status(409).json({ error: 'Vous êtes déjà inscrit au cursus de cette langue' });
    }

    // Règle de la 2ème langue : la langue principale doit avoir atteint le CE1 (fin CP2)
    const principal = await prisma.enrollment.findFirst({
      where: { userId: req.user.id, isPrincipal: true },
      include: { gradeLevel: true, language: { select: { nom: true } } },
    });
    if (principal && principal.gradeLevel.ordre < ORDRE_DEBLOCAGE_LANGUE_SECONDAIRE) {
      return res.status(403).json({
        error: `Passez en 6ème en ${principal.language.nom} pour débloquer une nouvelle langue d'apprentissage`,
        requiredGradeOrdre: ORDRE_DEBLOCAGE_LANGUE_SECONDAIRE,
      });
    }

    // Correction du test
    const questions = await prisma.placementQuestion.findMany({
      where: { languageId, isActive: true },
    });

    let score = null;
    let ordreCible = 1; // CP1 par défaut
    let detail = null;

    if (questions.length > 0 && answers.length > 0) {
      const solutionMap = Object.fromEntries(questions.map(q => [q.id, q.solution]));
      let correct = 0;
      const corrections = [];
      for (const a of answers) {
        const sol = solutionMap[a.questionId];
        if (sol === undefined) continue;
        const expected = typeof sol === 'object' && sol !== null ? (sol.reponse ?? sol.answer ?? sol) : sol;
        const ok = String(a.answer).trim().toLowerCase() === String(expected).trim().toLowerCase();
        if (ok) correct++;
        corrections.push({ questionId: a.questionId, correct: ok });
      }
      score = Math.round((correct / questions.length) * 100);
      ordreCible = Math.min(ordreFromScore(score), ORDRE_PLAFOND_PLACEMENT);
      detail = { correct, total: questions.length, corrections };
    }

    const gradeLevel = await prisma.gradeLevel.findFirst({ where: { ordre: ordreCible, isActive: true } });
    if (!gradeLevel) return res.status(500).json({ error: 'Niveau scolaire introuvable — contactez le support' });

    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.create({
        data: {
          userId: req.user.id,
          languageId,
          gradeLevelId: gradeLevel.id,
          isPrincipal: !principal, // première langue = langue principale
        },
        include: { gradeLevel: true, language: { select: { nom: true, code: true } } },
      }),
      ...(score !== null ? [prisma.placementResult.create({
        data: { userId: req.user.id, languageId, score, gradeLevelId: gradeLevel.id, detail },
      })] : []),
    ]);

    res.status(201).json({
      enrollment,
      placement: { score, classeAttribuee: gradeLevel.nom, plafond: ordreCible === ORDRE_PLAFOND_PLACEMENT },
      message: score === null
        ? `Bienvenue ! Votre cursus commence en ${gradeLevel.nom}.`
        : `Test terminé (${score}%) — vous êtes affecté(e) en ${gradeLevel.nom}.`,
    });
  } catch (err) { next(err); }
};

// ==================== MES CURSUS ====================

// GET /api/curriculum/enrollments — tous mes cursus (une carte par langue)
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        gradeLevel: true,
        language: { select: { id: true, nom: true, code: true, imageDrapeau: true, couleur: true, emoji: true } },
        historique: { include: { gradeLevel: { select: { nom: true, code: true } } }, orderBy: { validatedAt: 'asc' } },
      },
      orderBy: [{ isPrincipal: 'desc' }, { startedAt: 'asc' }],
    });

    // Déblocage 2ème langue
    const principal = enrollments.find(e => e.isPrincipal);
    const secondLanguageUnlocked = !!principal && principal.gradeLevel.ordre >= ORDRE_DEBLOCAGE_LANGUE_SECONDAIRE;

    res.json({ enrollments, secondLanguageUnlocked });
  } catch (err) { next(err); }
};

// Calcule la progression d'un élève dans sa classe actuelle pour une langue
async function computeGradeProgress(userId, enrollment) {
  const lessons = await prisma.lesson.findMany({
    where: {
      languageId: enrollment.languageId,
      gradeLevelId: enrollment.gradeLevelId,
      isObligatoire: true,
      isActive: true,
    },
    select: { id: true, titre: true, pointsXp: true, trimestre: true, semaine: true },
  });

  if (lessons.length === 0) {
    return { lessonsTotal: 0, lessonsCompleted: 0, moyenne: null, readyForPromotion: false, contentAvailable: false, lessons: [], byTrimestre: {} };
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId, lessonId: { in: lessons.map(l => l.id) } },
  });
  const progressMap = Object.fromEntries(progress.map(p => [p.lessonId, p]));

  const completed = lessons.filter(l => progressMap[l.id]?.statut === 'completed');
  const scores = completed.map(l => progressMap[l.id].score ?? 0);
  const moyenne = scores.length > 0 ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) : null;

  const seuil = enrollment.gradeLevel.seuilPassage;
  const allDone = completed.length === lessons.length;
  const readyForPromotion = allDone && moyenne !== null && moyenne >= seuil;

  const lessonsList = lessons.map(l => ({
    id: l.id, titre: l.titre,
    trimestre: l.trimestre ?? null,
    semaine:   l.semaine   ?? null,
    statut: progressMap[l.id]?.statut ?? 'not_started',
    score:  progressMap[l.id]?.score  ?? null,
  }));

  // Regrouper par trimestre pour l'affichage mobile
  const byTrimestre = { T1: [], T2: [], T3: [], null: [] };
  for (const l of lessonsList) {
    const key = l.trimestre ?? 'null';
    (byTrimestre[key] = byTrimestre[key] ?? []).push(l);
  }

  return {
    lessonsTotal: lessons.length,
    lessonsCompleted: completed.length,
    moyenne,
    seuil,
    readyForPromotion,
    contentAvailable: true,
    lessons: lessonsList,
    byTrimestre,
  };
}

// GET /api/curriculum/enrollments/:languageId — détail du cursus d'une langue
const getEnrollmentDetail = async (req, res, next) => {
  try {
    const { languageId } = req.params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId: req.user.id, languageId } },
      include: {
        gradeLevel: true,
        language: { select: { id: true, nom: true, code: true } },
        filiere:    true,
        historique: { include: { gradeLevel: { select: { nom: true, code: true, cycle: true } } }, orderBy: { validatedAt: 'asc' } },
      },
    });
    if (!enrollment) return res.status(404).json({ error: 'Aucun cursus pour cette langue — passez le test de positionnement' });

    const progression = await computeGradeProgress(req.user.id, enrollment);

    const nextGrade = await prisma.gradeLevel.findFirst({
      where: { ordre: enrollment.gradeLevel.ordre + 1, isActive: true },
      select: { code: true, nom: true, cycle: true },
    });

    res.json({
      enrollment,
      progression,
      nextGrade,
      passageMode: enrollment.gradeLevel.passageMode, // AUTO ou COMITE (Phase B)
    });
  } catch (err) { next(err); }
};

// POST /api/curriculum/enrollments/:languageId/check-progression — passage auto
const checkProgression = async (req, res, next) => {
  try {
    const { languageId } = req.params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId: req.user.id, languageId } },
      include: { gradeLevel: true },
    });
    if (!enrollment) return res.status(404).json({ error: 'Aucun cursus pour cette langue' });

    const progression = await computeGradeProgress(req.user.id, enrollment);

    // Mettre à jour la moyenne courante
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { moyenne: progression.moyenne },
    });

    if (!progression.contentAvailable) {
      return res.json({ promoted: false, reason: 'contenu_indisponible', progression });
    }
    if (!progression.readyForPromotion) {
      return res.json({ promoted: false, reason: 'conditions_non_remplies', progression });
    }

    // Palier charnière : examen + comité d'experts (Phase B)
    if (enrollment.gradeLevel.passageMode === 'COMITE') {
      return res.json({
        promoted: false,
        reason: 'examen_comite_requis',
        message: `Félicitations, vous avez terminé le programme de ${enrollment.gradeLevel.nom} ! Le passage en classe supérieure se fait sur examen validé par le comité d'experts (bientôt disponible).`,
        progression,
      });
    }

    // Passage automatique
    const nextGrade = await prisma.gradeLevel.findFirst({
      where: { ordre: enrollment.gradeLevel.ordre + 1, isActive: true },
    });
    if (!nextGrade) {
      return res.json({ promoted: false, reason: 'dernier_niveau', progression });
    }

    await prisma.$transaction([
      prisma.enrollmentHistory.create({
        data: {
          enrollmentId: enrollment.id,
          gradeLevelId: enrollment.gradeLevelId,
          moyenneFinale: progression.moyenne,
          passageMode: 'AUTO',
        },
      }),
      prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { gradeLevelId: nextGrade.id, moyenne: null },
      }),
    ]);

    // Notifier l'élève du passage de classe
    await notifyUser(
      prisma,
      req.user.id,
      'PASSAGE_CLASSE',
      '🎓 Passage de classe !',
      `Félicitations ! Vous passez de ${enrollment.gradeLevel.nom} en ${nextGrade.nom}.`,
      { fromGrade: enrollment.gradeLevel.nom, toGrade: nextGrade.nom },
    );

    // Émettre un certificat de fin de cycle si ce niveau est un seuil (ex : CP2 ordre=2)
    await issueCursusCertIfEligible(req.user.id, languageId, enrollment.gradeLevel.ordre);

    res.json({
      promoted: true,
      from: { code: enrollment.gradeLevel.code, nom: enrollment.gradeLevel.nom },
      to: { code: nextGrade.code, nom: nextGrade.nom },
      moyenneFinale: progression.moyenne,
      message: `🎉 Passage de classe réussi ! Vous êtes maintenant en ${nextGrade.nom}.`,
    });
  } catch (err) { next(err); }
};

// ==================== ADMINISTRATION (CMS) ====================

// PUT /api/curriculum/admin/grades/:id — seuil / mode / activation
const updateGrade = async (req, res, next) => {
  try {
    const { seuilPassage, passageMode, isActive, description } = req.body;
    const grade = await prisma.gradeLevel.update({
      where: { id: req.params.id },
      data: {
        ...(seuilPassage !== undefined && { seuilPassage: Math.max(0, Math.min(100, parseInt(seuilPassage))) }),
        ...(passageMode && { passageMode }),
        ...(isActive !== undefined && { isActive }),
        ...(description !== undefined && { description }),
      },
    });
    res.json(grade);
  } catch (err) { next(err); }
};

// PUT /api/curriculum/admin/modules/:id — verrouillage des modules
const updateModule = async (req, res, next) => {
  try {
    const { minGradeOrdre, isCursus, isActive, pilier, nom } = req.body;
    const mod = await prisma.curriculumModule.update({
      where: { id: req.params.id },
      data: {
        ...(minGradeOrdre !== undefined && { minGradeOrdre: parseInt(minGradeOrdre) }),
        ...(isCursus !== undefined && { isCursus }),
        ...(isActive !== undefined && { isActive }),
        ...(pilier && { pilier }),
        ...(nom && { nom }),
      },
    });
    res.json(mod);
  } catch (err) { next(err); }
};

// PUT /api/curriculum/admin/lessons/:id/grade — rattacher une leçon à une classe/matière
const assignLessonGrade = async (req, res, next) => {
  try {
    const { gradeLevelId, pilier, isObligatoire, trimestre, semaine } = req.body;
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: {
        gradeLevelId: gradeLevelId || null,
        ...(pilier      !== undefined && { pilier:      pilier      || null }),
        ...(isObligatoire !== undefined && { isObligatoire }),
        ...(trimestre   !== undefined && { trimestre:   trimestre   || null }),
        ...(semaine     !== undefined && { semaine:     semaine     ? parseInt(semaine) : null }),
      },
      include: { gradeLevel: { select: { code: true, nom: true } } },
    });
    res.json(lesson);
  } catch (err) { next(err); }
};

// GET /api/curriculum/admin/stats — répartition des élèves par classe et par langue
const getStats = async (req, res, next) => {
  try {
    const byGrade = await prisma.enrollment.groupBy({
      by: ['gradeLevelId', 'languageId'],
      _count: { id: true },
    });

    const [grades, languages] = await Promise.all([
      prisma.gradeLevel.findMany({ select: { id: true, code: true, nom: true, ordre: true, cycle: true } }),
      prisma.language.findMany({ select: { id: true, nom: true, code: true } }),
    ]);
    const gradeMap = Object.fromEntries(grades.map(g => [g.id, g]));
    const langMap = Object.fromEntries(languages.map(l => [l.id, l]));

    const stats = byGrade.map(row => ({
      grade: gradeMap[row.gradeLevelId],
      language: langMap[row.languageId],
      eleves: row._count.id,
    })).sort((a, b) => (a.grade?.ordre ?? 0) - (b.grade?.ordre ?? 0));

    const totals = {
      totalEleves: await prisma.enrollment.count(),
      totalPlacements: await prisma.placementResult.count(),
      totalPassages: await prisma.enrollmentHistory.count(),
    };

    res.json({ stats, totals });
  } catch (err) { next(err); }
};

// CRUD questions du test de positionnement
const listPlacementQuestions = async (req, res, next) => {
  try {
    const { languageId } = req.query;
    const questions = await prisma.placementQuestion.findMany({
      where: { ...(languageId && { languageId }) },
      include: { language: { select: { nom: true, code: true } } },
      orderBy: [{ languageId: 'asc' }, { niveauOrdre: 'asc' }],
    });
    res.json(questions);
  } catch (err) { next(err); }
};

const createPlacementQuestion = async (req, res, next) => {
  try {
    const { languageId, niveauOrdre, donnees, solution } = req.body;
    if (!languageId || !niveauOrdre || !donnees || solution === undefined) {
      return res.status(400).json({ error: 'languageId, niveauOrdre, donnees et solution sont requis' });
    }
    const q = await prisma.placementQuestion.create({
      data: { languageId, niveauOrdre: parseInt(niveauOrdre), donnees, solution },
    });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

const updatePlacementQuestion = async (req, res, next) => {
  try {
    const { niveauOrdre, donnees, solution, isActive } = req.body;
    const q = await prisma.placementQuestion.update({
      where: { id: req.params.id },
      data: {
        ...(niveauOrdre !== undefined && { niveauOrdre: parseInt(niveauOrdre) }),
        ...(donnees !== undefined && { donnees }),
        ...(solution !== undefined && { solution }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    res.json(q);
  } catch (err) { next(err); }
};

const deletePlacementQuestion = async (req, res, next) => {
  try {
    await prisma.placementQuestion.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// POST /api/curriculum/admin/seed — initialise les 16 niveaux + 25 modules (idempotent)
const seedCurriculum = async (req, res, next) => {
  try {
    const { GRADE_LEVELS, CURRICULUM_MODULES } = require('../../prisma/curriculum-data');
    for (const g of GRADE_LEVELS) {
      await prisma.gradeLevel.upsert({
        where: { code: g.code },
        update: { nom: g.nom, ordre: g.ordre, cycle: g.cycle, passageMode: g.passageMode, seuilPassage: g.seuilPassage, description: g.description },
        create: g,
      });
    }
    for (const m of CURRICULUM_MODULES) {
      await prisma.curriculumModule.upsert({
        where: { moduleKey: m.moduleKey },
        update: { nom: m.nom, pilier: m.pilier },  // ne pas écraser minGradeOrdre/isCursus modifiés via CMS
        create: m,
      });
    }
    const counts = {
      grades: await prisma.gradeLevel.count(),
      modules: await prisma.curriculumModule.count(),
    };
    res.json({ success: true, ...counts, message: `Cursus initialisé : ${counts.grades} niveaux, ${counts.modules} modules.` });
  } catch (err) { next(err); }
};

// ==================== PHASE B — EXAMENS COMITÉ ====================

// POST /api/curriculum/enrollments/:languageId/submit-exam
// L'élève soumet sa demande de passage COMITE (texte + audio optionnel)
const submitExam = async (req, res, next) => {
  try {
    const userId     = req.user.id;
    const { languageId } = req.params;
    const { textContent, audioUrl } = req.body;

    if (!textContent && !audioUrl) {
      return res.status(400).json({ error: 'Fournissez un texte ou un enregistrement audio.' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_languageId: { userId, languageId } },
      include: { gradeLevel: true },
    });
    if (!enrollment) return res.status(404).json({ error: 'Cursus introuvable.' });
    if (enrollment.gradeLevel.passageMode !== 'COMITE') {
      return res.status(400).json({ error: 'Ce niveau utilise le passage automatique, pas le comité.' });
    }

    // Une seule demande PENDING ou IN_REVIEW à la fois
    const existing = await prisma.examSubmission.findFirst({
      where: { userId, languageId, gradeLevelId: enrollment.gradeLevelId, status: { in: ['PENDING', 'IN_REVIEW'] } },
    });
    if (existing) return res.status(409).json({ error: 'Une demande est déjà en cours d\'examen.' });

    const exam = await prisma.examSubmission.create({
      data: { userId, languageId, enrollmentId: enrollment.id, gradeLevelId: enrollment.gradeLevelId, textContent, audioUrl },
    });
    res.status(201).json({ success: true, exam });
  } catch (err) { next(err); }
};

// GET /api/curriculum/enrollments/:languageId/exam-status
// L'élève consulte le statut de sa dernière demande
const getExamStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;
    const exam = await prisma.examSubmission.findFirst({
      where: { userId, languageId },
      orderBy: { createdAt: 'desc' },
      include: { gradeLevel: { select: { nom: true, cycle: true } } },
    });
    res.json({ exam });
  } catch (err) { next(err); }
};

// GET /api/curriculum/admin/exams
// Comité : liste des demandes (filtrées par status, languageId, gradeLevelId)
const listExams = async (req, res, next) => {
  try {
    const { status, languageId, gradeLevelId, page = 1, limit = 30 } = req.query;
    const where = {};
    if (status)       where.status       = status;
    if (languageId)   where.languageId   = languageId;
    if (gradeLevelId) where.gradeLevelId = gradeLevelId;

    const [items, total] = await Promise.all([
      prisma.examSubmission.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: {
          user:       { select: { id: true, nom: true, prenom: true, photo: true } },
          language:   { select: { id: true, nom: true, code: true } },
          gradeLevel: { select: { id: true, nom: true, cycle: true } },
          reviewer:   { select: { id: true, nom: true, prenom: true } },
        },
      }),
      prisma.examSubmission.count({ where }),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

// POST /api/curriculum/admin/exams/:id/review
// Comité : approuver ou rejeter une demande
const reviewExam = async (req, res, next) => {
  try {
    const reviewerId = req.user.id;
    const { id }     = req.params;
    const { decision, commentaire } = req.body; // decision: 'APPROVED' | 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ error: "Decision doit être 'APPROVED' ou 'REJECTED'." });
    }

    const exam = await prisma.examSubmission.findUnique({
      where: { id },
      include: { enrollment: { include: { gradeLevel: true } } },
    });
    if (!exam) return res.status(404).json({ error: 'Demande introuvable.' });
    if (['APPROVED', 'REJECTED'].includes(exam.status)) {
      return res.status(409).json({ error: 'Cette demande a déjà été traitée.' });
    }

    // Mettre à jour le statut de la demande
    const updated = await prisma.examSubmission.update({
      where: { id },
      data: { status: decision, reviewedBy: reviewerId, commentaire, reviewedAt: new Date() },
    });

    const enrollment   = exam.enrollment;
    const currentGrade = enrollment.gradeLevel;

    // Si approuvé → passer la classe dans l'enrollment
    if (decision === 'APPROVED') {
      // Trouver la classe suivante
      const nextGrade = await prisma.gradeLevel.findFirst({
        where: { ordre: { gt: currentGrade.ordre }, isActive: true },
        orderBy: { ordre: 'asc' },
      });

      // Enregistrer dans le livret
      await prisma.enrollmentHistory.create({
        data: {
          enrollmentId:  enrollment.id,
          gradeLevelId:  currentGrade.id,
          passageMode:   'COMITE',
          decidedBy:     reviewerId,
        },
      });

      if (nextGrade) {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data:  { gradeLevelId: nextGrade.id, moyenneGlobale: 0 },
        });
        await notifyUser(
          prisma,
          enrollment.userId,
          'PASSAGE_CLASSE',
          '🎓 Passage validé par le comité !',
          `Le comité d'experts a approuvé votre passage de ${currentGrade.nom} en ${nextGrade.nom}. Félicitations !`,
          { fromGrade: currentGrade.nom, toGrade: nextGrade.nom },
        );
      }

      // Émettre un certificat de fin de cycle si ce niveau est un seuil
      // (CM2 ord=6, 3ème ord=10, Terminale ord=13, Chercheur III ord=16)
      await issueCursusCertIfEligible(
        enrollment.userId,
        enrollment.languageId,
        currentGrade.ordre,
        reviewerId,
      );
    } else {
      // Refusé — notifier l'élève
      await notifyUser(
        prisma,
        enrollment.userId,
        'EXAMEN_REFUSE',
        '📝 Examen non validé',
        `Le comité n'a pas validé votre passage de ${currentGrade.nom}. ${commentaire ? `Commentaire : ${commentaire}` : 'Continuez vos leçons et réessayez.'}`,
        { gradeNom: currentGrade.nom, commentaire: commentaire ?? null },
      );
    }

    res.json({ success: true, exam: updated });
  } catch (err) { next(err); }
};

// PATCH /api/curriculum/admin/exams/:id/take
// Comité : prendre en charge une demande (passe en IN_REVIEW)
const takeExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await prisma.examSubmission.update({
      where: { id },
      data: { status: 'IN_REVIEW', reviewedBy: req.user.id },
    });
    res.json({ success: true, exam });
  } catch (err) { next(err); }
};

// GET /api/curriculum/admin/enrollments — liste des inscriptions pour le CMS (Phase H)
const listEnrollmentsAdmin = async (req, res, next) => {
  try {
    const { languageId } = req.query;
    const enrollments = await prisma.enrollment.findMany({
      where: { ...(languageId && { languageId }) },
      include: {
        user:       { select: { id: true, nom: true, prenom: true, email: true } },
        language:   { select: { id: true, nom: true, code: true, emoji: true } },
        gradeLevel: { select: { id: true, nom: true, cycle: true, ordre: true } },
        filiere:    { select: { id: true, nom: true, code: true, emoji: true } },
      },
      orderBy: [{ language: { nom: 'asc' } }, { gradeLevel: { ordre: 'asc' } }],
    });
    res.json({ enrollments });
  } catch (err) { next(err); }
};

// POST /api/curriculum/admin/seed-content — contenu démo (Phase K)
// Assigne les leçons actives sans classe à CP1, CP2, CE1 (4 leçons par classe par langue).
const seedContent = async (req, res, next) => {
  try {
    const LECONS_PAR_CLASSE = 4;
    const PILIERS = ['LANGUE_COMMUNICATION', 'CULTURE_CITOYENNETE', 'PRATIQUE_METIERS'];
    const GRADES_CIBLES = ['CP1', 'CP2', 'CE1'];

    const grades = await prisma.gradeLevel.findMany({
      where: { code: { in: GRADES_CIBLES } },
      orderBy: { ordre: 'asc' },
    });
    if (grades.length === 0) return res.status(404).json({ error: 'Classes CP1/CP2/CE1 introuvables. Initialisez d\'abord le cursus.' });

    const languages = await prisma.language.findMany({ where: { isActive: true } });
    let totalAssigned = 0;
    const detail = [];

    for (const lang of languages) {
      const lecons = await prisma.lesson.findMany({
        where: { languageId: lang.id, isActive: true, gradeLevelId: null },
        orderBy: { ordre: 'asc' },
      });
      if (lecons.length === 0) continue;

      let idx = 0;
      for (const grade of grades) {
        const tranche = lecons.slice(idx, idx + LECONS_PAR_CLASSE);
        if (tranche.length === 0) break;
        for (let i = 0; i < tranche.length; i++) {
          await prisma.lesson.update({
            where: { id: tranche[i].id },
            data: { gradeLevelId: grade.id, pilier: PILIERS[i % PILIERS.length], isObligatoire: true },
          });
        }
        detail.push({ langue: lang.nom, classe: grade.nom, count: tranche.length });
        totalAssigned += tranche.length;
        idx += LECONS_PAR_CLASSE;
        if (idx >= lecons.length) break;
      }
    }

    res.json({ success: true, totalAssigned, detail });
  } catch (err) { next(err); }
};

// POST /api/curriculum/admin/reset-content — supprime le contenu démo (Phase K)
// Retire toutes les assignations de classe sur les leçons (gradeLevelId → null).
const resetContent = async (req, res, next) => {
  try {
    const { count } = await prisma.lesson.updateMany({
      where: { gradeLevelId: { not: null } },
      data: { gradeLevelId: null, pilier: null, isObligatoire: false },
    });
    res.json({ success: true, resetCount: count });
  } catch (err) { next(err); }
};

module.exports = {
  getGrades, getModules,
  getPlacementTest, submitPlacementTest,
  getMyEnrollments, getEnrollmentDetail, checkProgression,
  updateGrade, updateModule, assignLessonGrade, getStats,
  listPlacementQuestions, createPlacementQuestion, updatePlacementQuestion, deletePlacementQuestion,
  seedCurriculum,
  listEnrollmentsAdmin,
  seedContent,
  resetContent,
  // Phase B
  submitExam, getExamStatus, listExams, reviewExam, takeExam,
};
