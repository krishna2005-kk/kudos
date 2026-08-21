const { z } = require('zod');
const { REACTION_TYPES } = require('./reaction.constants');

const kudosId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid kudos id');

const addReactionSchema = z.object({
  body: z.object({ type: z.enum(REACTION_TYPES) }),
  params: z.object({ id: kudosId }),
  query: z.object({}),
});

const removeReactionSchema = z.object({
  body: z.any(),
  params: z.object({ id: kudosId, type: z.enum(REACTION_TYPES) }),
  query: z.object({}),
});

module.exports = { addReactionSchema, removeReactionSchema };
