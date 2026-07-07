const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Mode Enseignant (PEI/DPFC) — classes réelles dans l'application.
 *
 * L'enseignant (rôle TEACHER, ou ADMIN/SUPER_ADMIN) crée une classe liée à
 * une langue. Un code à 6 caractères est généré ; les élèves le saisissent
 * pour rejoindre. L'enseignant consulte ensuite le tableau de suivi :
 * XP, assiduité (streak / dernière activité), leçons complétées et classe
 * du cursus pour la langue de la classe.
 */

const TEACHER_ROLES = ['TEACHER', 'ADMIN', 'SUPER_ADMIN'];

// Alphabet sans caractères ambigus (pas de 0/O, 1/I/L)
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generateCode(len = 6) {
  let code = '';
  for (let i = 0; i < len; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

async function uniqueCode() {
  for (let i = 0; i < 10; i++) {
    const code = generateCode();
    const exists = await prisma.classroom.findUnique({ where: { code } });
    if (!exists) return code;
  }
  // Improbable après 10 essais sur 31^6 combinaisons — élargir
  return generateCode(8);
}

function isTeacher(req) {
  return TEACHER_ROLES.includes(req.user?.role);
}

const CLASSROOM_INCLUDE = {
  language:   { select: { id: true, nom: true, code: true, emoji: true } },
  gradeLevel: { select: { id: true, nom: true, code: true, cycle: true } },
  _count:     { select: { members: true } },
};

// --------------------------------------------------------------------------
// POST /api/classrooms  { nom, languageId, gradeLevelId?, etablissement? }
// --------------------------------------------------------------------------
async function createClassroom(req, res) {
  try {
    if (!isTeacher(req)) {
      return res.status(403).json({ error: 'Réservé aux enseignants. Demandez le rôle Enseignant à un administrateur.' });
    }
    const { nom, languageId, gradeLevelId, etablissement } = req.body;
    if (!nom?.trim() || !languageId) {
      return res.status(400).json({ error: 'nom et languageId requis.' });
    }

    const language = await prisma.language.findUnique({ where: { id: languageId } });
    if (!language) return res.status(404).json({ error: 'Langue inconnue.' });

    const classroom = await prisma.classroom.create({
      data: {
        nom: nom.trim(),
        code: await uniqueCode(),
        etablissement: etablissement?.trim() || null,
        teacherId: req.user.id,
        languageId,
        gradeLevelId: gradeLevelId || null,
      },
      include: CLASSROOM_INCLUDE,
    });

    res.status(201).json({ classroom });
  } catch (err) {
    console.error('createClassroom:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/classrooms/mine — classes de l'enseignant connecté
// --------------------------------------------------------------------------
async function myClassrooms(req, res) {
  try {
    if (!isTeacher(req)) return res.status(403).json({ error: 'Réservé aux enseignants.' });

    const classrooms = await prisma.classroom.findMany({
      where: { teacherId: req.user.id },
      include: CLASSROOM_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ classrooms });
  } catch (err) {
    console.error('myClassrooms:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/classrooms/:id — détail + tableau de suivi des élèves
// --------------------------------------------------------------------------
async function getClassroom(req, res) {
  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: req.params.id },
      include: {
        ...CLASSROOM_INCLUDE,
        members: {
          orderBy: { joinedAt: 'asc' },
          include: {
            user: {
              select: {
                id: true, prenom: true, nom: true, photo: true,
                bonusXp: true, streak: true, lastActiveAt: true,
              },
            },
          },
        },
      },
    });
    if (!classroom) return res.status(404).json({ error: 'Classe introuvable.' });

    const isOwner = classroom.teacherId === req.user.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    const isMember = classroom.members.some(m => m.userId === req.user.id);
    if (!isOwner && !isAdmin && !isMember) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    // Enrichissement du roster (réservé enseignant/admin — un élève ne voit pas
    // les stats des autres)
    let roster = null;
    if (isOwner || isAdmin) {
      const userIds = classroom.members.map(m => m.userId);

      const [lessonCounts, enrollments] = await Promise.all([
        userIds.length
          ? prisma.userProgress.groupBy({
              by: ['userId'],
              where: { userId: { in: userIds }, statut: 'completed' },
              _count: { _all: true },
            })
          : [],
        userIds.length
          ? prisma.enrollment.findMany({
              where: { userId: { in: userIds }, languageId: classroom.languageId },
              select: {
                userId: true, moyenne: true,
                gradeLevel: { select: { nom: true, code: true, cycle: true } },
              },
            })
          : [],
      ]);

      const lessonMap = Object.fromEntries(lessonCounts.map(l => [l.userId, l._count._all]));
      const enrollMap = Object.fromEntries(enrollments.map(e => [e.userId, e]));

      roster = classroom.members.map(m => ({
        memberId: m.id,
        joinedAt: m.joinedAt,
        user: m.user,
        lessonsCompleted: lessonMap[m.userId] ?? 0,
        enrollment: enrollMap[m.userId]
          ? { gradeLevel: enrollMap[m.userId].gradeLevel, moyenne: enrollMap[m.userId].moyenne }
          : null,
      }));
    }

    const { members, ...meta } = classroom;
    // Le code d'accès n'est visible que par l'enseignant/admin
    if (!isOwner && !isAdmin) delete meta.code;
    res.json({ classroom: { ...meta, membersCount: members.length }, roster });
  } catch (err) {
    console.error('getClassroom:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// POST /api/classrooms/join  { code }
// --------------------------------------------------------------------------
async function joinClassroom(req, res) {
  try {
    const code = (req.body.code || '').trim().toUpperCase();
    if (!code) return res.status(400).json({ error: 'Code requis.' });

    const classroom = await prisma.classroom.findUnique({
      where: { code },
      include: CLASSROOM_INCLUDE,
    });
    if (!classroom || !classroom.isActive) {
      return res.status(404).json({ error: 'Code invalide ou classe fermée. Vérifiez auprès de votre enseignant.' });
    }
    if (classroom.teacherId === req.user.id) {
      return res.status(400).json({ error: 'Vous êtes l\'enseignant de cette classe.' });
    }

    const member = await prisma.classroomMember.upsert({
      where: { classroomId_userId: { classroomId: classroom.id, userId: req.user.id } },
      update: {},
      create: { classroomId: classroom.id, userId: req.user.id },
    });

    const { code: _hidden, ...safe } = classroom;
    res.status(201).json({ classroom: safe, member });
  } catch (err) {
    console.error('joinClassroom:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/classrooms/joined — classes rejointes par l'élève connecté
// --------------------------------------------------------------------------
async function joinedClassrooms(req, res) {
  try {
    const memberships = await prisma.classroomMember.findMany({
      where: { userId: req.user.id },
      include: {
        classroom: {
          include: {
            ...CLASSROOM_INCLUDE,
            teacher: { select: { prenom: true, nom: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const classrooms = memberships.map(m => {
      const { code, ...safe } = m.classroom;
      return { ...safe, joinedAt: m.joinedAt };
    });
    res.json({ classrooms });
  } catch (err) {
    console.error('joinedClassrooms:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// DELETE /api/classrooms/:id/members/:userId — retirer un élève (enseignant)
// DELETE /api/classrooms/:id/members/me      — quitter la classe (élève)
// --------------------------------------------------------------------------
async function removeMember(req, res) {
  try {
    const { id, userId: targetParam } = req.params;
    const classroom = await prisma.classroom.findUnique({ where: { id } });
    if (!classroom) return res.status(404).json({ error: 'Classe introuvable.' });

    const targetUserId = targetParam === 'me' ? req.user.id : targetParam;
    const isOwner = classroom.teacherId === req.user.id;
    const isSelf = targetUserId === req.user.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    if (!isOwner && !isSelf && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    await prisma.classroomMember.deleteMany({
      where: { classroomId: id, userId: targetUserId },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('removeMember:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// PATCH /api/classrooms/:id  { nom?, etablissement?, gradeLevelId?, isActive? }
// --------------------------------------------------------------------------
async function updateClassroom(req, res) {
  try {
    const classroom = await prisma.classroom.findUnique({ where: { id: req.params.id } });
    if (!classroom) return res.status(404).json({ error: 'Classe introuvable.' });
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    if (classroom.teacherId !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    const { nom, etablissement, gradeLevelId, isActive } = req.body;
    const data = {};
    if (nom !== undefined)           data.nom = String(nom).trim();
    if (etablissement !== undefined) data.etablissement = etablissement ? String(etablissement).trim() : null;
    if (gradeLevelId !== undefined)  data.gradeLevelId = gradeLevelId || null;
    if (isActive !== undefined)      data.isActive = !!isActive;

    const updated = await prisma.classroom.update({
      where: { id: req.params.id },
      data,
      include: CLASSROOM_INCLUDE,
    });
    res.json({ classroom: updated });
  } catch (err) {
    console.error('updateClassroom:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

module.exports = {
  createClassroom, myClassrooms, getClassroom,
  joinClassroom, joinedClassrooms, removeMember, updateClassroom,
};
