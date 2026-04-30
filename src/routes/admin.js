const router = require('express').Router();
const { authenticate, requireAdmin, requireEditor } = require('../middleware/auth');
const { getUsers, updateUser, deleteUser, createMember } = require('../controllers/adminController');
const { getBadges, getBadge, createBadge, updateBadge, deleteBadge } = require('../controllers/badgeController');
const { sendNotification, getNotificationHistory } = require('../controllers/adminNotificationController');
const { getPhrases, createPhrase, updatePhrase, deletePhrase } = require('../controllers/phrasesAdminController');

// Toutes les routes nécessitent d'être authentifié
router.use(authenticate);

// ── Utilisateurs — ADMIN uniquement ──────────────────────────
router.get('/users',           requireAdmin, getUsers);
router.post('/users/create',   requireAdmin, createMember);
router.patch('/users/:id',     requireAdmin, updateUser);
router.delete('/users/:id',    requireAdmin, deleteUser);

// ── Badges — EDITOR et plus ───────────────────────────────────
router.get('/badges',          requireEditor, getBadges);
router.get('/badges/:id',      requireEditor, getBadge);
router.post('/badges',         requireEditor, createBadge);
router.patch('/badges/:id',    requireEditor, updateBadge);
router.delete('/badges/:id',   requireAdmin,  deleteBadge);  // suppression = admin

// ── Notifications — ADMIN uniquement ─────────────────────────
router.post('/notifications/send',    requireAdmin, sendNotification);
router.get('/notifications/history',  requireAdmin, getNotificationHistory);

// ── Phrases utiles / SOS — EDITOR et plus ────────────────────
router.get('/phrases',         requireEditor, getPhrases);
router.post('/phrases',        requireEditor, createPhrase);
router.patch('/phrases/:id',   requireEditor, updatePhrase);
router.delete('/phrases/:id',  requireAdmin,  deletePhrase);  // suppression = admin

module.exports = router;
