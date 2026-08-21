const { z } = require('zod');

const runResetSchema = z.object({
  body: z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must use YYYY-MM format').optional() }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = { runResetSchema };
