const { z } = require('zod');
const { DEPARTMENTS } = require('../users/user.constants');

const leaderboardSchema = z.object({
  body: z.any(),
  params: z.object({}),
  query: z.object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must use YYYY-MM format').optional(),
    department: z.enum(DEPARTMENTS).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

module.exports = { leaderboardSchema };
