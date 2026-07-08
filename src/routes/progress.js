const router = require('express').Router();
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');
const { getUserProgress, completeLesson, getUserBadges, addXp, getLeaderboard } = require('../controllers/progressController');

// Enregistrement du token Expo Push de l'appareil (notifications serveur)
router.post('/me/push-token', authenticate, async (req, res, next) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken || typeof pushToken !== 'string') {
      return res.status(400).json({ error: 'pushToken requis.' });
    }
    await prisma.user.update({ where: { id: req.user.id }, data: { pushToken } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get('/me/progress', authenticate, getUserProgress);
router.post('/me/lessons/:id/complete', authenticate, completeLesson);
router.get('/me/badges', authenticate, getUserBadges);
router.post('/me/xp', authenticate, addXp);
router.get('/leaderboard', authenticate, getLeaderboard);

module.exports = router;
