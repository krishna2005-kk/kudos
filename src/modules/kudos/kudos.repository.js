const Kudos = require('./kudos.model');

function create(data, session) {
  return Kudos.create([data], { session }).then(([kudos]) => kudos);
}

function findById(kudosId) {
  return Kudos.findById(kudosId)
    .populate('sender', 'name avatar department')
    .populate('receiver', 'name avatar department');
}

function findFeed(filter, limit) {
  return Kudos.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .populate('sender', 'name avatar department')
    .populate('receiver', 'name avatar department')
    .lean();
}

module.exports = { create, findById, findFeed };
