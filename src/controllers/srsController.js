const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Moteur de répétition espacée — algorithme SM-2 (SuperMemo-2).
 *
 * Chaque mot appris devient une "carte" par utilisateur. Après chaque révision,
 * l'utilisateur note sa réponse (quality 0-5) et la carte est replanifiée :
 *   - quality < 3  → oubli : la carte revient demain, compteur remis à zéro
 *   - quality >= 3 → intervalle croissant : 1j, 6j, puis interval × easeFactor
 * L'easeFactor s'ajuste selon la difficulté ressentie (min 1.3).
 */

const NEW_CARDS_PER_DAY = 10;   // nouveaux mots introduits automatiquement par jour
const DEFAULT_DUE_LIMIT = 20;   // cartes max par session de révision

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Applique SM-2 à une carte et retourne les nouveaux champs. */
function sm2(card, quality) {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { repetitions, easeFactor, intervalDays, lapses } = card;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    if (repetitions === 0)      intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else                        intervalDays = Math.round(intervalDays * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + intervalDays);
  // Les révisions du jour même (q<3) reviennent dans 10 minutes, pas demain
  if (q < 3) {
    dueAt.setTime(Date.now() + 10 * 60 * 1000);
    intervalDays = 0;
  }

  return { repetitions, easeFactor, intervalDays, lapses, dueAt, lastQuality: q };
}

/** Hydrate des cartes DICTIONARY avec le contenu du mot. */
async function hydrateCards(cards) {
  const dictIds = cards.filter(c => c.itemType === 'DICTIONARY').map(c => c.itemId);
  const phraseIds = cards.filter(c => c.itemType === 'PHRASE').map(c => c.itemId);

  const [entries, phrases] = await Promise.all([
    dictIds.length
      ? prisma.dictionaryEntry.findMany({
          where: { id: { in: dictIds } },
          select: {
            id: true, mot: true, traduction: true, transcription: true,
            audioUrl: true, imageUrl: true, exemplePhrase: true,
            exempleTraduction: true, categorie: true,
          },
        })
      : [],
    phraseIds.length
      ? prisma.usefulPhrase.findMany({
          where: { id: { in: phraseIds } },
          select: { id: true, phrase: true, traduction: true, transcription: true, audioUrl: true },
        })
      : [],
  ]);

  const dictMap = Object.fromEntries(entries.map(e => [e.id, e]));
  const phraseMap = Object.fromEntries(phrases.map(p => [
    p.id,
    { id: p.id, mot: p.phrase, traduction: p.traduction, transcription: p.transcription, audioUrl: p.audioUrl },
  ]));

  return cards
    .map(c => ({ ...c, item: c.itemType === 'DICTIONARY' ? dictMap[c.itemId] : phraseMap[c.itemId] }))
    .filter(c => c.item); // écarter les cartes orphelines (mot supprimé)
}

// --------------------------------------------------------------------------
// GET /api/srs/due?languageCode=&limit=
// File de révision : cartes échues + introduction automatique de nouveaux mots
// (max NEW_CARDS_PER_DAY/jour) tirés du dictionnaire publié de la langue.
// --------------------------------------------------------------------------
async function getDue(req, res) {
  try {
    const userId = req.user.id;
    const { languageCode } = req.query;
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_DUE_LIMIT, 50);

    let language = null;
    if (languageCode) {
      language = await prisma.language.findUnique({ where: { code: languageCode } });
      if (!language) return res.status(404).json({ error: 'Langue inconnue.' });
    }

    const baseWhere = {
      userId,
      suspended: false,
      ...(language ? { languageId: language.id } : {}),
    };

    // 1. Cartes échues
    let cards = await prisma.srsCard.findMany({
      where: { ...baseWhere, dueAt: { lte: new Date() } },
      orderBy: { dueAt: 'asc' },
      take: limit,
    });

    // 2. Introduction de nouveaux mots si la file n'est pas pleine (par langue uniquement)
    if (language && cards.length < limit) {
      const introducedToday = await prisma.srsCard.count({
        where: { userId, languageId: language.id, createdAt: { gte: startOfToday() } },
      });
      const newBudget = Math.min(NEW_CARDS_PER_DAY - introducedToday, limit - cards.length);

      if (newBudget > 0) {
        const existing = await prisma.srsCard.findMany({
          where: { userId, languageId: language.id, itemType: 'DICTIONARY' },
          select: { itemId: true },
        });
        const knownIds = existing.map(e => e.itemId);

        const fresh = await prisma.dictionaryEntry.findMany({
          where: {
            languageId: language.id,
            status: 'PUBLISHED',
            ...(knownIds.length ? { id: { notIn: knownIds } } : {}),
          },
          orderBy: { createdAt: 'asc' },
          take: newBudget,
          select: { id: true },
        });

        if (fresh.length) {
          await prisma.srsCard.createMany({
            data: fresh.map(f => ({
              userId,
              languageId: language.id,
              itemType: 'DICTIONARY',
              itemId: f.id,
            })),
            skipDuplicates: true,
          });
          cards = await prisma.srsCard.findMany({
            where: { ...baseWhere, dueAt: { lte: new Date() } },
            orderBy: { dueAt: 'asc' },
            take: limit,
          });
        }
      }
    }

    const hydrated = await hydrateCards(cards);
    res.json({ cards: hydrated, count: hydrated.length });
  } catch (err) {
    console.error('srs getDue:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// POST /api/srs/review  { cardId, quality (0-5) }
// Applique SM-2 et crédite un petit bonus XP en cas de réussite.
// --------------------------------------------------------------------------
async function review(req, res) {
  try {
    const userId = req.user.id;
    const { cardId, quality } = req.body;
    if (!cardId || quality === undefined) {
      return res.status(400).json({ error: 'cardId et quality (0-5) requis.' });
    }

    const card = await prisma.srsCard.findUnique({ where: { id: cardId } });
    if (!card || card.userId !== userId) {
      return res.status(404).json({ error: 'Carte introuvable.' });
    }

    const next = sm2(card, quality);
    const updated = await prisma.srsCard.update({ where: { id: cardId }, data: next });

    // Bonus XP : +2 si bonne réponse fluide, +1 si laborieuse
    const xp = next.lastQuality >= 4 ? 2 : next.lastQuality === 3 ? 1 : 0;
    if (xp > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { bonusXp: { increment: xp } },
      });
    }

    res.json({ card: updated, xpGained: xp });
  } catch (err) {
    console.error('srs review:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// GET /api/srs/stats?languageCode=
// Compteurs pour le badge d'accueil et l'écran de révision.
// --------------------------------------------------------------------------
async function getStats(req, res) {
  try {
    const userId = req.user.id;
    const { languageCode } = req.query;

    let languageId;
    if (languageCode) {
      const language = await prisma.language.findUnique({ where: { code: languageCode } });
      if (!language) return res.status(404).json({ error: 'Langue inconnue.' });
      languageId = language.id;
    }

    const baseWhere = { userId, suspended: false, ...(languageId ? { languageId } : {}) };

    const [dueNow, dueToday, total, learned, newToday] = await Promise.all([
      prisma.srsCard.count({ where: { ...baseWhere, dueAt: { lte: new Date() } } }),
      prisma.srsCard.count({ where: { ...baseWhere, dueAt: { lte: endOfToday() } } }),
      prisma.srsCard.count({ where: baseWhere }),
      prisma.srsCard.count({ where: { ...baseWhere, intervalDays: { gte: 21 } } }),
      prisma.srsCard.count({ where: { ...baseWhere, createdAt: { gte: startOfToday() } } }),
    ]);

    res.json({ dueNow, dueToday, total, learned, newToday, newBudgetPerDay: NEW_CARDS_PER_DAY });
  } catch (err) {
    console.error('srs getStats:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

// --------------------------------------------------------------------------
// POST /api/srs/cards  { itemType?, itemId }
// Ajout manuel d'un mot/phrase au paquet de révision (ex: bouton dans le dictionnaire).
// --------------------------------------------------------------------------
async function addCard(req, res) {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;
    const itemType = req.body.itemType === 'PHRASE' ? 'PHRASE' : 'DICTIONARY';
    if (!itemId) return res.status(400).json({ error: 'itemId requis.' });

    let languageId;
    if (itemType === 'DICTIONARY') {
      const entry = await prisma.dictionaryEntry.findUnique({ where: { id: itemId }, select: { languageId: true } });
      if (!entry) return res.status(404).json({ error: 'Mot introuvable.' });
      languageId = entry.languageId;
    } else {
      const phrase = await prisma.usefulPhrase.findUnique({ where: { id: itemId }, select: { languageId: true } });
      if (!phrase) return res.status(404).json({ error: 'Phrase introuvable.' });
      languageId = phrase.languageId;
    }

    const card = await prisma.srsCard.upsert({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
      update: { suspended: false },
      create: { userId, languageId, itemType, itemId },
    });

    res.status(201).json({ card });
  } catch (err) {
    console.error('srs addCard:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

module.exports = { getDue, review, getStats, addCard };
