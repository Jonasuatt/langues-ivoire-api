/**
 * Routes RÉPÉTO — /api/repetitor
 * Compagnon Vocal ILA — Phase 1 : Mode Écho
 */
const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getMots,
  createMot,
  updateMot,
  deleteMot,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  getStats,
} = require('../controllers/repetitorController');

// ── Mots du jeu (admin CMS) ──────────────────────────────────────────────────
router.get('/mots',         authenticate, requireAdmin, getMots);
router.post('/mots',        authenticate, requireAdmin, createMot);
router.patch('/mots/:id',   authenticate, requireAdmin, updateMot);
router.delete('/mots/:id',  authenticate, requireAdmin, deleteMot);

// ── Sessions (lecture/modération admin — écriture publique pour l'app mobile) ─
router.get('/stats',           authenticate, requireAdmin, getStats);
router.get('/sessions',        authenticate, requireAdmin, getSessions);
router.post('/sessions',       createSession);           // public : l'app mobile enregistre sans auth
router.patch('/sessions/:id',  authenticate, requireAdmin, updateSession);
router.delete('/sessions/:id', authenticate, requireAdmin, deleteSession);

// ── Endpoint public : liste des mots actifs pour une langue (app mobile) ─────
router.get('/mots-publics', getMots);  // filtre par ?languageId=&actif=true côté client

module.exports = router;
