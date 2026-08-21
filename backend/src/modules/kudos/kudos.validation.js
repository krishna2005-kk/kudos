const { z } = require('zod');
const { ALLOWED_POINTS, COMPANY_VALUES } = require('./kudos.constants');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const giveKudosSchema = z.object({
  body: z.object({
    receiverId: objectId,
    points: z.coerce.number().int().refine((value) => ALLOWED_POINTS.includes(value), {
      message: 'Points must be 10, 20, or 50',
    }),
    message: z.string().trim().min(3).max(500),
    companyValue: z.enum(COMPANY_VALUES),
  }),
  params: z.object({}),
  query: z.object({}),
});

const kudosIdSchema = z.object({
  body: z.any(),
  params: z.object({ id: objectId }),
  query: z.object({}),
});

const feedSchema = z.object({
  body: z.any(),
  params: z.object({}),
  query: z.object({
    cursor: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    companyValue: z.enum(COMPANY_VALUES).optional(),
  }),
});

module.exports = { giveKudosSchema, kudosIdSchema, feedSchema };
