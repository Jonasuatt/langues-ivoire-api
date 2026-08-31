/**
 * Cerveau Numérique — mémoire des réponses.
 *
 * Une question déjà répondue ne doit plus jamais être facturée. Chaque appel
 * payant alimente donc le patrimoine : au fil des mois, la part servie
 * localement augmente pendant que la facture diminue.
 *
 * Prudence : on ne mémorise que les questions AUTONOMES. Une réponse qui
 * dépendait d'un historique de conversation serait absurde hors contexte.
 */
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { normalize } = require('./brainTranslate');

/** Empreinte stable de la question dans son contexte. */
function makeKey({ scope, languageId, tutorId, question }) {
  const base = [scope, languageId || '-', tutorId || '-', normalize(question)].join('|');
  return crypto.createHash('sha1').update(base).digest('hex');
}

/**
 * Cherche une réponse déjà connue. Incrémente le compteur de réutilisation
 * (qui mesure les économies) sans bloquer la réponse.
 * @returns {Promise<string|null>}
 */
async function recall(ctx) {
  const question = (ctx.question || '').trim();
  if (!question) return null;
  try {
    const hit = await prisma.brainAnswer.findUnique({ where: { cacheKey: makeKey(ctx) } });
    if (!hit || !hit.isActive) return null;
    prisma.brainAnswer
      .update({ where: { id: hit.id }, data: { hits: { increment: 1 }, lastUsedAt: new Date() } })
      .catch(() => {});
    return hit.reponse;
  } catch (e) {
    console.error('[Brain] recall:', e.message);
    return null; // la mémoire ne doit jamais empêcher de répondre
  }
}

/** Mémorise une réponse fraîchement produite (best-effort, non bloquant). */
async function remember(ctx, reponse, modele) {
  const question = (ctx.question || '').trim();
  if (!question || !reponse || reponse.length < 2) return;
  const cacheKey = makeKey(ctx);
  try {
    await prisma.brainAnswer.upsert({
      where:  { cacheKey },
      update: { reponse, modele, updatedAt: new Date() },
      create: {
        cacheKey,
        scope:        ctx.scope,
        question,
        questionNorm: normalize(question),
        reponse,
        languageId:   ctx.languageId || null,
        tutorId:      ctx.tutorId || null,
        modele:       modele || null,
      },
    });
  } catch (e) {
    console.error('[Brain] remember:', e.message);
  }
}

module.exports = { makeKey, recall, remember };
