const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTutors = async (req, res, next) => {
  try {
    const tutors = await prisma.tutor.findMany({
      where: { isActive: true },
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(tutors);
  } catch (err) {
    next(err);
  }
};

const getTutor = async (req, res, next) => {
  try {
    const tutor = await prisma.tutor.findUnique({
      where: { id: req.params.id },
      include: { language: { select: { nom: true, code: true, region: true } } },
    });
    if (!tutor) return res.status(404).json({ error: 'Tuteur non trouvé' });
    res.json(tutor);
  } catch (err) {
    next(err);
  }
};

const chatWithTutor = async (req, res, next) => {
  try {
    const { message, categorie } = req.body;
    const tutor = await prisma.tutor.findUnique({
      where: { id: req.params.id },
      include: { language: { select: { nom: true, code: true } } },
    });
    if (!tutor) return res.status(404).json({ error: 'Tuteur non trouvé' });

    // Appel au backend IA Python (FastAPI)
    const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${AI_URL}/tutors/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: tutor.id,
        languageCode: tutor.language.code,
        message,
        categorie,
        userId: req.user.id,
        personalite: tutor.personalite,
      }),
    });

    if (!response.ok) {
      throw new Error('Service IA indisponible');
    }

    const aiResponse = await response.json();
    res.json({ reply: aiResponse.reply, audioUrl: aiResponse.audioUrl });
  } catch (err) {
    // Réponse de fallback si le service IA est indisponible
    res.json({
      reply: "Je suis temporairement indisponible. Réessayez dans quelques instants.",
      audioUrl: null,
    });
  }
};

const requestPronunciation = async (req, res, next) => {
  try {
    const { dictEntryId, audioRecording } = req.body;

    const request = await prisma.pronunciationRequest.create({
      data: {
        userId: req.user.id,
        dictEntryId,
        audioRecording,
      },
    });

    // Appel asynchrone au service IA pour l'analyse
    const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    fetch(`${AI_URL}/pronunciation/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: request.id, audioUrl: audioRecording, dictEntryId }),
    }).catch(() => {}); // Ne bloque pas la réponse

    res.status(202).json({
      requestId: request.id,
      message: 'Analyse en cours, résultat disponible sous peu.',
    });
  } catch (err) {
    next(err);
  }
};

const createTutor = async (req, res, next) => {
  try {
    const tutor = await prisma.tutor.create({
      data: req.body,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.status(201).json(tutor);
  } catch (err) { next(err); }
};

const updateTutor = async (req, res, next) => {
  try {
    const tutor = await prisma.tutor.update({
      where: { id: req.params.id },
      data: req.body,
      include: { language: { select: { nom: true, code: true } } },
    });
    res.json(tutor);
  } catch (err) { next(err); }
};

const deleteTutor = async (req, res, next) => {
  try {
    await prisma.tutor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getTutors, getTutor, chatWithTutor, requestPronunciation, createTutor, updateTutor, deleteTutor };
