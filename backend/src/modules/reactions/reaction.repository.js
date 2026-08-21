const Reaction = require('./reaction.model');

function create(data) {
  return Reaction.create(data);
}

function remove({ kudos, user, type }) {
  return Reaction.findOneAndDelete({ kudos, user, type });
}

function getSummaries(kudosIds, viewerId) {
  return Reaction.aggregate([
    { $match: { kudos: { $in: kudosIds } } },
    {
      $group: {
        _id: { kudos: '$kudos', type: '$type' },
        count: { $sum: 1 },
        viewerReacted: { $max: { $eq: ['$user', viewerId] } },
      },
    },
  ]);
}

module.exports = { create, remove, getSummaries };
