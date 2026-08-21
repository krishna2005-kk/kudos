const leaderboardService = require('./leaderboard.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

const getLeaderboard = asyncHandler(async (req, res) => {
  const data = await leaderboardService.getLeaderboard(req.validated.query);
  res.status(200).json({ success: true, message: 'Leaderboard retrieved', data });
});

module.exports = { getLeaderboard };
