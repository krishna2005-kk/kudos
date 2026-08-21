const Kudos = require('../kudos/kudos.model');
const reactionRepository = require('./reaction.repository');
const AppError = require('../../shared/errors/AppError');
const { REACTION_TYPES } = require('./reaction.constants');

function emptySummary() {
  return {
    counts: Object.fromEntries(REACTION_TYPES.map((type) => [type, 0])),
    viewerReactions: [],
  };
}

async function getReactionSummaries(kudosIds, viewerId) {
  if (kudosIds.length === 0) return new Map();
  const rows = await reactionRepository.getSummaries(kudosIds, viewerId);
  const summaries = new Map(kudosIds.map((id) => [id.toString(), emptySummary()]));

  for (const row of rows) {
    const summary = summaries.get(row._id.kudos.toString());
    summary.counts[row._id.type] = row.count;
    if (row.viewerReacted) summary.viewerReactions.push(row._id.type);
  }
  return summaries;
}

async function addReaction(userId, { kudosId, type }) {
  const kudosExists = await Kudos.exists({ _id: kudosId });
  if (!kudosExists) throw new AppError('Kudos not found', 404);

  try {
    const reaction = await reactionRepository.create({ kudos: kudosId, user: userId, type });
    const summary = (await getReactionSummaries([reaction.kudos], userId)).get(reaction.kudos.toString());
    return { reaction, summary };
  } catch (error) {
    if (error.code === 11000) throw new AppError('You have already added this reaction', 409);
    throw error;
  }
}

async function removeReaction(userId, { kudosId, type }) {
  const reaction = await reactionRepository.remove({ kudos: kudosId, user: userId, type });
  if (!reaction) throw new AppError('Reaction not found', 404);
  const summary = (await getReactionSummaries([reaction.kudos], userId)).get(reaction.kudos.toString());
  return { summary };
}

module.exports = { addReaction, removeReaction, getReactionSummaries };
