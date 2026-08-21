const reactionService = require('./reaction.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

const addReaction = asyncHandler(async (req, res) => {
  const { reaction, summary } = await reactionService.addReaction(req.user._id, {
    kudosId: req.validated.params.id,
    type: req.validated.body.type,
  });
  res.status(201).json({ success: true, message: 'Reaction added', data: { reaction, reactionSummary: summary } });
});

const removeReaction = asyncHandler(async (req, res) => {
  const { summary } = await reactionService.removeReaction(req.user._id, {
    kudosId: req.validated.params.id,
    type: req.validated.params.type,
  });
  res.status(200).json({ success: true, message: 'Reaction removed', data: { reactionSummary: summary } });
});

module.exports = { addReaction, removeReaction };
