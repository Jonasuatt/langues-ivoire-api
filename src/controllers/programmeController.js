const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PILIERS = ['LANGUE_COMMUNICATION', 'CULTURE_CITOYENNETE', 'PRATIQUE_METIERS'];
const TRIMESTRES = ['T1', 'T2', 'T3'];

// GET /api/curriculum/programme?languageId=X
module.exports = async function getProgramme(req, res) {
  try {
    const { languageId } = req.query;

    const [grades, lessons] = await Promise.all([
      prisma.gradeLevel.findMany({
        where:   { isActive: true },
        orderBy: { ordre: 'asc' },
        select:  { id: true, code: true, nom: true, cycle: true, ordre: true },
      }),
      prisma.lesson.findMany({
        where: {
          isActive:    true,
          gradeLevelId: { not: null },
          ...(languageId ? { languageId } : {}),
        },
        select: {
          id: true, titre: true, description: true,
          gradeLevelId: true, languageId: true,
          pilier: true, trimestre: true, semaine: true,
          isObligatoire: true,
          language: { select: { id: true, nom: true, code: true, emoji: true } },
        },
        orderBy: [
          { gradeLevelId: 'asc' },
          { pilier: 'asc' },
          { trimestre: 'asc' },
          { semaine: 'asc' },
          { ordre: 'asc' },
        ],
      }),
    ]);

    // Grouper les leçons par gradeLevelId
    const lessonsByGrade = {};
    for (const l of lessons) {
      if (!lessonsByGrade[l.gradeLevelId]) lessonsByGrade[l.gradeLevelId] = [];
      lessonsByGrade[l.gradeLevelId].push(l);
    }

    // Construire la table des matières
    const result = grades.map(g => {
      const gradeLecons = lessonsByGrade[g.id] ?? [];

      // Grouper par pilier puis trimestre
      const byPilier = {};
      for (const pilier of PILIERS) {
        const pilierLecons = gradeLecons.filter(l => l.pilier === pilier);
        byPilier[pilier] = {};
        for (const trim of TRIMESTRES) {
          byPilier[pilier][trim] = pilierLecons
            .filter(l => l.trimestre === trim)
            .sort((a, b) => (a.semaine ?? 99) - (b.semaine ?? 99));
        }
        byPilier[pilier]['SANS_TRIMESTRE'] = pilierLecons.filter(l => !l.trimestre);
      }
      byPilier['SANS_PILIER'] = gradeLecons.filter(l => !l.pilier);

      const total = {
        LANGUE_COMMUNICATION: gradeLecons.filter(l => l.pilier === 'LANGUE_COMMUNICATION').length,
        CULTURE_CITOYENNETE:  gradeLecons.filter(l => l.pilier === 'CULTURE_CITOYENNETE').length,
        PRATIQUE_METIERS:     gradeLecons.filter(l => l.pilier === 'PRATIQUE_METIERS').length,
        SANS_PILIER:          gradeLecons.filter(l => !l.pilier).length,
        TOTAL:                gradeLecons.length,
      };

      return { ...g, lecons: byPilier, total };
    });

    // Grouper les grades par cycle
    const byCycle = {};
    for (const g of result) {
      if (!byCycle[g.cycle]) byCycle[g.cycle] = [];
      byCycle[g.cycle].push(g);
    }

    res.json({ programme: byCycle, totalLecons: lessons.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
