const { z } = require('zod');

const monthQuerySchema = z.object({
  body: z.any(),
  params: z.object({}),
  query: z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must use YYYY-MM format').optional() }),
});

module.exports = { monthQuerySchema };
