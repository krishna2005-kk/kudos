const Kudos = require('../kudos/kudos.model');
const { getMonthRange } = require('../../shared/utils/month');

async function getLeaderboard(query) {
  const { selected, start, end } = getMonthRange(query.month);
  const pipeline = [
    { $match: { createdAt: { $gte: start, $lt: end } } },
    { $group: { _id: '$receiver', receivedPoints: { $sum: '$points' }, kudosCount: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    ...(query.department ? [{ $match: { 'user.department': query.department } }] : []),
    { $sort: { receivedPoints: -1, kudosCount: -1, 'user.name': 1 } },
    { $limit: query.limit },
    {
      $project: {
        _id: 0,
        user: { id: '$user._id', name: '$user.name', avatar: '$user.avatar', department: '$user.department' },
        receivedPoints: 1,
        kudosCount: 1,
      },
    },
  ];

  const results = await Kudos.aggregate(pipeline);
  let lastPoints = null;
  let rank = 0;
  const entries = results.map((entry) => {
    if (entry.receivedPoints !== lastPoints) rank += 1;
    lastPoints = entry.receivedPoints;
    return { rank, ...entry };
  });

  return { month: selected, department: query.department || null, entries };
}

module.exports = { getLeaderboard };
