const mongoose = require('mongoose');
const { REACTION_TYPES } = require('./reaction.constants');

const reactionSchema = new mongoose.Schema(
  {
    kudos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kudos',
      required: true,
      immutable: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: REACTION_TYPES,
      required: true,
      immutable: true,
    },
  },
  { timestamps: true, versionKey: false }
);

reactionSchema.index({ kudos: 1, user: 1, type: 1 }, { unique: true });
reactionSchema.index({ kudos: 1, type: 1 });

module.exports = mongoose.model('Reaction', reactionSchema);
