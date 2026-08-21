const express = require('express');
const { protect } = require('../auth/auth.middleware');
const validate = require('../../shared/middleware/validate');
const { leaderboardSchema } = require('./leaderboard.validation');
const leaderboardController = require('./leaderboard.controller');

const router = express.Router();

router.get('/', protect, validate(leaderboardSchema), leaderboardController.getLeaderboard);

module.exports = router;
