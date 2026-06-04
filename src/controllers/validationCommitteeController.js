/**
 * Workflow de certification ILA — Comité scientifique de 5 experts
 *
 * Flux :
 *   SUBMITTED → (expert vote) → IN_REVIEW → CERTIFIED_ILA (quorum 3/5 APPROVED)
 *                                          → REVISION_REQUESTED (quorum 3/5)
 *                                          → REJECTED (quorum 3/5)
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const QUORUM = 3;          // votes requis pour changer de statut
const COMMITTEE_SIZE = 5;  // taille totale du comité

// ─── Include réutilisable ─────────────────────────────────────────────────────
const CONTRIB_INCLUDE = {
  user:     { select: { id: true, prenom: true, nom: true, email: true } },
  language: { select: { id: true, nom: true, code: true } },
  validationVotes: {
    include: {
      expert: { select: { id: true, prenom: true, nom: true } },
    },
    orderBy: { createdAt: 'asc' },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Recalcule le statut de certification après chaque vote.
 * Applique automatiquement CERTIFIED_ILA, REVISION_REQUESTED ou REJECTED
 * si le quorum est atteint.
 */
async function recalculateCertification(audioContributionId, expertId) {
  const votes = await prisma.validationVote.findMany({
    where: { audioContributionId },
  });

  const approved  = votes.filter(v => v.vote === 'APPROVED').length;
  const revision  = votes.filter(v => v.vote === 'REVISION_REQUESTED').length;
  const rejected  = votes.filter(v => v.vote === 'REJECTED').length;

  let newStatus = votes.length > 0 ? 'IN_REVIEW' : 'SUBMITTED';
  let certifiedAt = null;
  let certifiedBy = null;
  let isValidated = undefined;

  if (approved >= QUORUM) {
    newStatus   = 'CERTIFIED_ILA';
    certifiedAt = new Date();
    certifiedBy = expertId;
    isValidated = true;      // rétrocompat avec l'ancien champ
  } else if (revision >= QUORUM) {
    newStatus = 'REVISION_REQUESTED';
  } else if (rejected >= QUORUM) {
    newStatus = 'REJECTED';
  }

  const data = {
    certificationStatus: newStatus,
    certifiedAt,
    certifiedBy,
  };
  if (isValidated !== undefined) data.isValidated = isValidated;

  await prisma.audioContribution.update({
    where: { id: audioContributionId },
    data,
  });

  return { newStatus, approved, revision, rejected, totalVotes: votes.length };
}

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

/**
 * GET /api/validation-committee
 * Liste les contributions à examiner (filtrées par statut, langue, etc.)
 * Accessible : EXPERT, ADMIN, SUPER_ADMIN
 */
const getSubmissions = async (req, res, next) => {
  try {
    const {
      status = 'SUBMITTED,IN_REVIEW',
      langue,
      page  = 1,
      limit = 20,
    } = req.query;

    const statuses = status.split(',').map(s => s.trim());
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { certificationStatus: { in: statuses } };
    if (langue) where.languageId = langue;

    const [data, total] = await Promise.all([
      prisma.audioContribution.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'asc' },
        include: CONTRIB_INCLUDE,
      }),
      prisma.audioContribution.count({ where }),
    ]);

    res.json({
      data,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/validation-committee/stats
 * Statistiques globales de certification
 */
const getStats = async (req, res, next) => {
  try {
    const [submitted, inReview, certified, revision, rejected] = await Promise.all([
      prisma.audioContribution.count({ where: { certificationStatus: 'SUBMITTED' } }),
      prisma.audioContribution.count({ where: { certificationStatus: 'IN_REVIEW' } }),
      prisma.audioContribution.count({ where: { certificationStatus: 'CERTIFIED_ILA' } }),
      prisma.audioContribution.count({ where: { certificationStatus: 'REVISION_REQUESTED' } }),
      prisma.audioContribution.count({ where: { certificationStatus: 'REJECTED' } }),
    ]);

    // Répartition par langue (certifiés uniquement)
    const byLanguage = await prisma.audioContribution.groupBy({
      by: ['languageId'],
      where: { certificationStatus: 'CERTIFIED_ILA' },
      _count: { id: true },
    });

    res.json({
      submitted,
      inReview,
      certified,
      revision,
      rejected,
      total: submitted + inReview + certified + revision + rejected,
      byLanguage,
    });
  } catch (err) { next(err); }
};

/**
 * POST /api/validation-committee/:id/vote
 * Un expert soumet son vote
 * Body : { vote: 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED', comment?: string }
 */
const castVote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vote, comment } = req.body;
    const expertId = req.user.id;

    if (!['APPROVED', 'REVISION_REQUESTED', 'REJECTED'].includes(vote)) {
      return res.status(400).json({ error: 'Vote invalide. Valeurs acceptées : APPROVED, REVISION_REQUESTED, REJECTED' });
    }
    if ((vote === 'REVISION_REQUESTED' || vote === 'REJECTED') && !comment?.trim()) {
      return res.status(400).json({ error: 'Un commentaire est obligatoire pour ce type de vote.' });
    }

    // Vérifier que la contribution existe et n'est pas déjà certifiée/rejetée définitivement
    const contrib = await prisma.audioContribution.findUnique({ where: { id } });
    if (!contrib) return res.status(404).json({ error: 'Contribution introuvable' });
    if (contrib.certificationStatus === 'CERTIFIED_ILA') {
      return res.status(409).json({ error: 'Cette contribution est déjà certifiée ILA.' });
    }
    if (contrib.certificationStatus === 'REJECTED') {
      return res.status(409).json({ error: 'Cette contribution a été rejetée définitivement.' });
    }

    // Upsert du vote (l'expert peut changer son avis)
    const existingVote = await prisma.validationVote.findUnique({
      where: { audioContributionId_expertId: { audioContributionId: id, expertId } },
    });

    let savedVote;
    if (existingVote) {
      savedVote = await prisma.validationVote.update({
        where: { id: existingVote.id },
        data: { vote, comment: comment?.trim() || null },
        include: { expert: { select: { id: true, prenom: true, nom: true } } },
      });
    } else {
      savedVote = await prisma.validationVote.create({
        data: {
          audioContributionId: id,
          expertId,
          vote,
          comment: comment?.trim() || null,
        },
        include: { expert: { select: { id: true, prenom: true, nom: true } } },
      });
    }

    // Recalculer le statut de certification
    const result = await recalculateCertification(id, expertId);

    // Retourner la contribution mise à jour
    const updated = await prisma.audioContribution.findUnique({
      where: { id },
      include: CONTRIB_INCLUDE,
    });

    res.json({
      vote: savedVote,
      certification: result,
      contribution: updated,
    });
  } catch (err) { next(err); }
};

/**
 * DELETE /api/validation-committee/:id/vote
 * Un expert retire son vote (avant certification)
 */
const removeVote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expertId = req.user.id;

    const existing = await prisma.validationVote.findUnique({
      where: { audioContributionId_expertId: { audioContributionId: id, expertId } },
    });
    if (!existing) return res.status(404).json({ error: 'Vote introuvable' });

    await prisma.validationVote.delete({ where: { id: existing.id } });
    await recalculateCertification(id, expertId);

    res.json({ ok: true });
  } catch (err) { next(err); }
};

/**
 * GET /api/validation-committee/:id
 * Détail d'une contribution avec tous ses votes
 */
const getSubmissionDetail = async (req, res, next) => {
  try {
    const contrib = await prisma.audioContribution.findUnique({
      where: { id: req.params.id },
      include: CONTRIB_INCLUDE,
    });
    if (!contrib) return res.status(404).json({ error: 'Contribution introuvable' });
    res.json(contrib);
  } catch (err) { next(err); }
};

/**
 * PATCH /api/validation-committee/:id/reset
 * ADMIN/SUPER_ADMIN uniquement — remet une contribution en SUBMITTED pour nouvelle révision
 */
const resetSubmission = async (req, res, next) => {
  try {
    await prisma.validationVote.deleteMany({ where: { audioContributionId: req.params.id } });
    const updated = await prisma.audioContribution.update({
      where: { id: req.params.id },
      data: {
        certificationStatus: 'SUBMITTED',
        certifiedAt: null,
        certifiedBy: null,
        isValidated: false,
      },
      include: CONTRIB_INCLUDE,
    });
    res.json(updated);
  } catch (err) { next(err); }
};

module.exports = {
  getSubmissions,
  getStats,
  castVote,
  removeVote,
  getSubmissionDetail,
  resetSubmission,
};
