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

const submitExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reponse } = req.body;

    const exercise = await prisma.exercise.findUnique({ where: { id } });
    if (!exercise) return res.status(404).json({ error: 'Exercice non trouvé' });

    // Vérification basique de la réponse (à adapter selon le type d'exercice)
    const isCorrect = JSON.stringify(reponse) === JSON.stringify(exercise.solution);

    let pointsGagnes = 0;
    if (isCorrect) {
      pointsGagnes = exercise.pointsXp;
      // Mettre à jour la progression de la leçon si toutes les étapes sont complétées
      const step = await prisma.lessonStep.findUnique({
        where: { id: exercise.stepId },
        select: { lessonId: true },
      });
      if (step) {
        await prisma.userProgress.upsert({
          where: { userId_lessonId: { userId: req.user.id, lessonId: step.lessonId } },
          create: { userId: req.user.id, lessonId: step.lessonId, statut: 'in_progress', score: pointsGagnes, attempts: 1 },
          update: { statut: 'in_progress', score: { increment: pointsGagnes }, attempts: { increment: 1 } },
        });
      }
    }

    res.json({
      correct: isCorrect,
      pointsGagnes,
      explication: !isCorrect ? exercise.explication : null,
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

module.exports = { getLessonsByLanguage, getLesson, submitExercise, createLesson, updateLesson, deleteLesson };
