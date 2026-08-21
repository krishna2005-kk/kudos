const express = require('express');
const { protect } = require('../auth/auth.middleware');
const reactionController = require('./reaction.controller');
const validate = require('../../shared/middleware/validate');
const {
  addReactionSchema,
  removeReactionSchema,
} = require('./reaction.validation');

const router = express.Router();

router.use(protect);
router.post(
  '/:id/reactions',
  validate(addReactionSchema),
  reactionController.addReaction
);
router.delete(
  '/:id/reactions/:type',
  validate(removeReactionSchema),
  reactionController.removeReaction
);

module.exports = router;
