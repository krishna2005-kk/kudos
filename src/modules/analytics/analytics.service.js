const Kudos = require('../kudos/kudos.model');
const { getMonthRange } = require('../../shared/utils/month');

function monthMatch(start, end) {
  return { $match: { createdAt: { $gte: start, $lt: end } } };
}

function employeeRankingPipeline(field) {
  return [
    { $group: { _id: `$${field}`, kudosCount: { $sum: 1 }, points: { $sum: '$points' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $sort: { points: -1, kudosCount: -1, 'user.name': 1 } },
    { $limit: 5 },
    { $project: { _id: 0, user: { id: '$user._id', name: '$user.name', department: '$user.department', avatar: '$user.avatar' }, points: 1, kudosCount: 1 } },
  ];
}

async function getOverview(month) {
  const { selected, start, end } = getMonthRange(month);
  const [totals, mostActiveEmployees, mostRecognizedEmployees] = await Promise.all([
    Kudos.aggregate([monthMatch(start, end), { $group: { _id: null, totalKudos: { $sum: 1 }, totalPoints: { $sum: '$points' } } }]),
    Kudos.aggregate([monthMatch(start, end), ...employeeRankingPipeline('sender')]),
    Kudos.aggregate([monthMatch(start, end), ...employeeRankingPipeline('receiver')]),
  ]);

  return {
    month: selected,
    totals: totals[0] ? { totalKudos: totals[0].totalKudos, totalPoints: totals[0].totalPoints } : { totalKudos: 0, totalPoints: 0 },
    mostActiveEmployees,
    mostRecognizedEmployees,
  };
}

async function getDepartmentAnalytics(month) {
  const { selected, start, end } = getMonthRange(month);
  const departments = await Kudos.aggregate([
    monthMatch(start, end),
    { $lookup: { from: 'users', localField: 'receiver', foreignField: '_id', as: 'receiver' } },
    { $unwind: '$receiver' },
    { $group: { _id: '$receiver.department', totalKudosReceived: { $sum: 1 }, totalPointsReceived: { $sum: '$points' } } },
    { $sort: { totalPointsReceived: -1, _id: 1 } },
    { $project: { _id: 0, department: '$_id', totalKudosReceived: 1, totalPointsReceived: 1 } },
  ]);
  return { month: selected, departments };
}

async function getCompanyValueAnalytics(month) {
  const { selected, start, end } = getMonthRange(month);
  const companyValues = await Kudos.aggregate([
    monthMatch(start, end),
    { $group: { _id: '$companyValue', totalKudos: { $sum: 1 }, totalPoints: { $sum: '$points' } } },
    { $sort: { totalKudos: -1, totalPoints: -1, _id: 1 } },
    { $project: { _id: 0, companyValue: '$_id', totalKudos: 1, totalPoints: 1 } },
  ]);
  return { month: selected, companyValues };
}

module.exports = { getOverview, getDepartmentAnalytics, getCompanyValueAnalytics };
