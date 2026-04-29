const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { getBadges, getBadge, createBadge, updateBadge, deleteBadge } = require('../controllers/badgeController');
const { sendNotification, getNotificationHistory } = require('../controllers/adminNotificationController');
const { getPhrases, createPhrase, updatePhrase, deletePhrase } = require('../controllers/phrasesAdminController');

router.use(authenticate, requireAdmin);

// ── Utilisateurs ─────────────────────────────────────────────
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ── Badges ───────────────────────────────────────────────────
router.get('/badges', getBadges);
router.get('/badges/:id', getBadge);
router.post('/badges', createBadge);
router.patch('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);

// ── Notifications admin ──────────────────────────────────────
router.post('/notifications/send', sendNotification);
router.get('/notifications/history', getNotificationHistory);

// ── Phrases utiles / SOS ─────────────────────────────────────
router.get('/phrases', getPhrases);
router.post('/phrases', createPhrase);
router.patch('/phrases/:id', updatePhrase);
router.delete('/phrases/:id', deletePhrase);

module.exports = router;
