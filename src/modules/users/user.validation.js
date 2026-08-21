const { z } = require('zod');
const { DEPARTMENTS } = require('./user.constants');

const listUsersSchema = z.object({
  body: z.any(),
  params: z.object({}),
  query: z.object({
    department: z.enum(DEPARTMENTS).optional(),
    search: z.string().trim().max(80).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
});

const userIdSchema = z.object({
  body: z.any(),
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user id') }),
  query: z.object({}),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    avatar: z.string().url().nullable().optional(),
  }).refine((data) => Object.keys(data).length > 0, 'Provide at least one profile field to update'),
  params: z.object({}),
  query: z.object({}),
});

const adminUpdateUserSchema = z.object({
  body: z.object({
    department: z.enum(DEPARTMENTS).optional(),
    role: z.enum(['employee', 'admin']).optional(),
  }).refine((data) => Object.keys(data).length > 0, 'Provide a department or role to update'),
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user id') }),
  query: z.object({}),
});

const adminListUsersSchema = z.object({
  body: z.any(),
  params: z.object({}),
  query: z.object({
    department: z.enum(DEPARTMENTS).optional(),
    search: z.string().trim().max(80).optional(),
  }),
});

const adjustUserPointsSchema = z.object({
  body: z.object({
    amount: z.coerce.number().int().refine((value) => value === 100, 'Admins can award exactly 100 points'),
  }),
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user id') }),
  query: z.object({}),
});

module.exports = { listUsersSchema, userIdSchema, updateProfileSchema, adminUpdateUserSchema, adminListUsersSchema, adjustUserPointsSchema };
