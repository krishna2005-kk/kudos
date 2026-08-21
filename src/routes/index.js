const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../modules/users/user.routes');
const authRoutes = require('../modules/auth/auth.routes');
const kudosRoutes = require('../modules/kudos/kudos.routes');
const reactionRoutes = require('../modules/reactions/reaction.routes');
const leaderboardRoutes = require('../modules/leaderboard/leaderboard.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const monthlyResetRoutes = require('../modules/monthlyResets/monthlyReset.routes');
const userAdminRoutes = require('../modules/users/user.admin.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kudos API is healthy',
    data: { status: 'ok' },
  });
});

router.get('/ready', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    message: databaseReady ? 'Kudos API is ready' : 'Kudos API database is unavailable',
    data: { database: databaseReady ? 'connected' : 'disconnected' },
  });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/kudos', kudosRoutes);
router.use('/kudos', reactionRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', monthlyResetRoutes);
router.use('/admin', userAdminRoutes);

module.exports = router;
