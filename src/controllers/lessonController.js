const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLessonsByLanguage = async (req, res, next) => {
  try {
    const { langue } = req.params;
    const { niveau } = req.query;

    const language = await prisma.language.findFirst({
      where: { OR: [{ id: langue }, { code: langue }], isActive: true },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    const where = { languageId: language.id, isActive: true };
    if (niveau) where.niveau = niveau;

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ niveau: 'asc' }, { ordre: 'asc' }],
      select: {
        id: true, titre: true, description: true, ordre: true,
        pointsXp: true, niveau: true, imageUrl: true,
        _count: { select: { steps: true } },
      },
    });

    // Si l'utilisateur est connecté, récupérer sa progression
    let progressMap = {};
    if (req.user) {
      const progress = await prisma.userProgress.findMany({
        where: { userId: req.user.id, lessonId: { in: lessons.map(l => l.id) } },
      });
      progressMap = Object.fromEntries(progress.map(p => [p.lessonId, p]));
    }

    const result = lessons.map(l => ({
      ...l,
      progress: progressMap[l.id] || null,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        steps: {
          orderBy: { ordre: 'asc' },
          include: { exercises: true },
        },
        language: { select: { nom: true, code: true } },
      },
    });
    if (!lesson) return res.status(404).json({ error: 'Leçon non trouvée' });
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

/**
 * Vérifie la réponse d'un exercice selon son type.
 * Supporte : VOCABULARY, TRANSLATION, GRAMMAR, LISTENING (QCM classique)
 * et IMAGE_WORD, GAME (comparaison flexible).
 */
function checkAnswer(exercise, userReponse) {
  const solution = exercise.solution;
  if (!solution) return false;

  // Normaliser les chaînes pour la comparaison
  const normalize = (s) => (s || '').toString().trim().toLowerCase();

  // QCM classique : comparer la réponse textuelle
  if (solution.reponse !== undefined) {
    return normalize(userReponse) === normalize(solution.reponse);
  }

  // Réponse multiple (ex: ordonner des mots)
  if (Array.isArray(solution) && Array.isArray(userReponse)) {
    if (solution.length !== userReponse.length) return false;
    return solution.every((val, i) => normalize(val) === normalize(userReponse[i]));
  }

  // Fallback : comparaison JSON
  return JSON.stringify(userReponse) === JSON.stringify(solution);
}

const submitExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reponse } = req.body;

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: { step: { select: { lessonId: true } } },
    });
    if (!exercise) return res.status(404).json({ error: 'Exercice non trouvé' });

    const isCorrect = checkAnswer(exercise, reponse);

    let pointsGagnes = 0;
    if (isCorrect) {
      pointsGagnes = exercise.pointsXp;
    }

    // Toujours enregistrer la tentative
    if (exercise.step) {
      await prisma.userProgress.upsert({
        where: { userId_lessonId: { userId: req.user.id, lessonId: exercise.step.lessonId } },
        create: {
          userId: req.user.id,
          lessonId: exercise.step.lessonId,
          statut: 'in_progress',
          score: pointsGagnes,
          attempts: 1,
        },
        update: {
          statut: 'in_progress',
          score: { increment: pointsGagnes },
          attempts: { increment: 1 },
        },
      });
    }

    res.json({
      correct: isCorrect,
      pointsGagnes,
      explication: exercise.explication || null,
      solution: !isCorrect ? exercise.solution : null,
    });
  } catch (err) {
    next(err);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.create({ data: req.body });
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: req.body });
    res.json(lesson);
  } catch (err) {
    next(err);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ==================== STEPS ====================

const createStep = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return res.status(404).json({ error: 'Leçon non trouvée' });

    const step = await prisma.lessonStep.create({
      data: { lessonId, ...req.body },
    });
    res.status(201).json(step);
  } catch (err) { next(err); }
};

const updateStep = async (req, res, next) => {
  try {
    const step = await prisma.lessonStep.update({
      where: { id: req.params.stepId },
      data: req.body,
    });
    res.json(step);
  } catch (err) { next(err); }
};

const deleteStep = async (req, res, next) => {
  try {
    await prisma.lessonStep.delete({ where: { id: req.params.stepId } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ==================== EXERCISES ====================

const createExercise = async (req, res, next) => {
  try {
    const { stepId } = req.params;
    const step = await prisma.lessonStep.findUnique({ where: { id: stepId } });
    if (!step) return res.status(404).json({ error: 'Étape non trouvée' });

    const exercise = await prisma.exercise.create({
      data: { stepId, ...req.body },
    });
    res.status(201).json(exercise);
  } catch (err) { next(err); }
};

const updateExercise = async (req, res, next) => {
  try {
    const exercise = await prisma.exercise.update({
      where: { id: req.params.exerciseId },
      data: req.body,
    });
    res.json(exercise);
  } catch (err) { next(err); }
};

const deleteExercise = async (req, res, next) => {
  try {
    await prisma.exercise.delete({ where: { id: req.params.exerciseId } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = {
  getLessonsByLanguage, getLesson, submitExercise,
  createLesson, updateLesson, deleteLesson,
  createStep, updateStep, deleteStep,
  createExercise, updateExercise, deleteExercise,
};
