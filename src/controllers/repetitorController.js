/**
 * repetitorController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * RÉPÉTO — Le Compagnon Vocal ILA
 * Phase 1 : Mode Écho
 *
 * Ce module gère :
 *   - les mots du jeu (configurés par l'admin CMS, associés à un audio certifié)
 *   - les sessions enregistrées par les apprenants depuis l'application mobile
 *
 * Notre objectif : après constitution d'un corpus audio suffisamment large grâce
 * à nos locuteurs et apprenants, nous passerons à la Phase 2 — Reconnaissance
 * Vocale ILA : une IA entraînée spécifiquement sur les langues ethniques
 * ivoiriennes, capable de valider la prononciation en temps réel.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────── MOTS ────────────────────────────────────

/**
 * GET /api/repetitor/mots
 * Liste des mots du jeu — filtrés par langue et/ou niveau
 */
const getMots = async (req, res) => {
  try {
    const { languageId, niveau, actif, limit = 100, offset = 0 } = req.query;
    const where = {};
    if (languageId) where.languageId = languageId;
    if (niveau)     where.niveau = niveau;
    if (actif !== undefined) where.actif = actif === 'true';

    const [mots, total] = await Promise.all([
      prisma.repetitorMot.findMany({
        where,
        orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.repetitorMot.count({ where }),
    ]);

    res.json({ data: mots, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (err) {
    console.error('[repetitor] getMots error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * POST /api/repetitor/mots
 * Ajouter un mot au jeu RÉPÉTO
 */
const createMot = async (req, res) => {
  try {
    const { languageId, languageNom, mot, traduction, audioUrl, genreVoix, emoji, categorie, niveau, ordre } = req.body;
    if (!languageId || !mot || !audioUrl) {
      return res.status(400).json({ error: 'languageId, mot et audioUrl sont requis.' });
    }

    const newMot = await prisma.repetitorMot.create({
      data: {
        languageId,
        languageNom: languageNom ?? null,
        mot: mot.trim(),
        traduction: traduction?.trim() ?? null,
        audioUrl,
        genreVoix:  genreVoix ?? null,
        emoji:      emoji ?? null,
        categorie:  categorie ?? 'general',
        niveau:     niveau ?? 'debutant',
        ordre:      ordre ? parseInt(ordre) : 0,
        actif:      true,
      },
    });

    res.status(201).json(newMot);
  } catch (err) {
    console.error('[repetitor] createMot error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * PATCH /api/repetitor/mots/:id
 * Mettre à jour un mot (ordre, audio, actif/inactif)
 */
const updateMot = async (req, res) => {
  try {
    const { id } = req.params;
    const { mot, traduction, audioUrl, genreVoix, emoji, categorie, niveau, ordre, actif } = req.body;

    const existing = await prisma.repetitorMot.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Mot introuvable.' });

    const updated = await prisma.repetitorMot.update({
      where: { id },
      data: {
        ...(mot        !== undefined && { mot: mot.trim() }),
        ...(traduction !== undefined && { traduction: traduction?.trim() ?? null }),
        ...(audioUrl   !== undefined && { audioUrl }),
        ...(genreVoix  !== undefined && { genreVoix: genreVoix || null }),
        ...(emoji      !== undefined && { emoji }),
        ...(categorie  !== undefined && { categorie }),
        ...(niveau     !== undefined && { niveau }),
        ...(ordre      !== undefined && { ordre: parseInt(ordre) }),
        ...(actif      !== undefined && { actif }),
        updatedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('[repetitor] updateMot error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * DELETE /api/repetitor/mots/:id
 * Supprimer un mot du jeu
 */
const deleteMot = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.repetitorMot.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Mot introuvable.' });

    await prisma.repetitorMot.delete({ where: { id } });
    res.json({ message: 'Mot supprimé.' });
  } catch (err) {
    console.error('[repetitor] deleteMot error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ─────────────────────────────── SESSIONS ────────────────────────────────────

/**
 * GET /api/repetitor/sessions
 * Liste des sessions enregistrées — admin CMS uniquement
 */
const getSessions = async (req, res) => {
  try {
    const { languageId, statut, ageGroupe, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (languageId) where.languageId = languageId;
    if (statut)     where.statut = statut;
    if (ageGroupe)  where.ageGroupe = ageGroupe;

    const [sessions, total] = await Promise.all([
      prisma.repetitorSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.repetitorSession.count({ where }),
    ]);

    res.json({ data: sessions, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (err) {
    console.error('[repetitor] getSessions error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * POST /api/repetitor/sessions
 * Enregistrer une nouvelle session depuis l'application mobile (pas d'auth requise
 * pour permettre aux jeunes apprenants de jouer sans compte)
 */
const createSession = async (req, res) => {
  try {
    const {
      repetitorMotId, languageId, languageNom,
      motCible, traduction, audioNatifUrl, audioEnfantUrl,
      dureeMs, ageGroupe, deviceId,
    } = req.body;

    if (!motCible || !audioEnfantUrl) {
      return res.status(400).json({ error: 'motCible et audioEnfantUrl sont requis.' });
    }

    const session = await prisma.repetitorSession.create({
      data: {
        repetitorMotId: repetitorMotId ?? null,
        languageId:     languageId ?? null,
        languageNom:    languageNom ?? null,
        motCible:       motCible.trim(),
        traduction:     traduction ?? null,
        audioNatifUrl:  audioNatifUrl ?? null,
        audioEnfantUrl,
        dureeMs:        dureeMs ? parseInt(dureeMs) : null,
        ageGroupe:      ageGroupe ?? 'INCONNU',
        statut:         'BRUT',
        deviceId:       deviceId ?? null,
      },
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('[repetitor] createSession error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * PATCH /api/repetitor/sessions/:id
 * Mettre à jour le statut d'une session (ex: BRUT → SOUMIS_ILA → ARCHIVE)
 */
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, scoreProximite } = req.body;

    const existing = await prisma.repetitorSession.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Session introuvable.' });

    const STATUTS_VALIDES = ['BRUT', 'SOUMIS_ILA', 'ARCHIVE'];
    if (statut && !STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ error: `Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(', ')}` });
    }

    const updated = await prisma.repetitorSession.update({
      where: { id },
      data: {
        ...(statut         !== undefined && { statut }),
        ...(scoreProximite !== undefined && { scoreProximite: parseFloat(scoreProximite) }),
        updatedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('[repetitor] updateSession error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * DELETE /api/repetitor/sessions/:id
 * Supprimer une session (données personnelles à expiration)
 */
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.repetitorSession.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Session introuvable.' });

    await prisma.repetitorSession.delete({ where: { id } });
    res.json({ message: 'Session supprimée.' });
  } catch (err) {
    console.error('[repetitor] deleteSession error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ──────────────────────────────── STATS ──────────────────────────────────────

/**
 * GET /api/repetitor/stats
 * Statistiques globales du module RÉPÉTO pour le tableau de bord CMS
 */
const getStats = async (req, res) => {
  try {
    const [
      totalSessions,
      totalMots,
      motsByLangue,
      sessionsByLangue,
      sessionsByStatut,
      sessionsByAge,
      recentes,
    ] = await Promise.all([
      prisma.repetitorSession.count(),
      prisma.repetitorMot.count({ where: { actif: true } }),
      prisma.repetitorMot.groupBy({
        by: ['languageId', 'languageNom'],
        where: { actif: true },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.repetitorSession.groupBy({
        by: ['languageId', 'languageNom'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.repetitorSession.groupBy({
        by: ['statut'],
        _count: { id: true },
      }),
      prisma.repetitorSession.groupBy({
        by: ['ageGroupe'],
        _count: { id: true },
      }),
      prisma.repetitorSession.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          motCible: true,
          languageNom: true,
          ageGroupe: true,
          statut: true,
          audioEnfantUrl: true,
          createdAt: true,
        },
      }),
    ]);

    // Construire map statut → count
    const statutMap = {};
    sessionsByStatut.forEach(s => { statutMap[s.statut] = s._count.id; });

    res.json({
      totalSessions,
      totalMots,
      soumisILA:    statutMap['SOUMIS_ILA'] ?? 0,
      archives:     statutMap['ARCHIVE']    ?? 0,
      languesActives: [...new Set([
        ...motsByLangue.map(m => m.languageId),
        ...sessionsByLangue.map(s => s.languageId),
      ].filter(Boolean))].length,
      motsByLangue: motsByLangue.map(m => ({
        languageId:  m.languageId,
        languageNom: m.languageNom ?? m.languageId,
        count:       m._count.id,
      })),
      sessionsByLangue: sessionsByLangue.map(s => ({
        languageId:  s.languageId ?? 'Inconnu',
        languageNom: s.languageNom ?? 'Langue inconnue',
        count:       s._count.id,
      })),
      sessionsByAge: sessionsByAge.map(a => ({
        ageGroupe: a.ageGroupe,
        count: a._count.id,
      })),
      recentes,
    });
  } catch (err) {
    console.error('[repetitor] getStats error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getMots,
  createMot,
  updateMot,
  deleteMot,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getStats,
};
