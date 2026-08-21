const { z } = require('zod');
const { DEPARTMENTS } = require('../users/user.constants');

const password = z.string().min(8, 'Password must have at least 8 characters').max(128);

const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    password,
    confirmPassword: z.string(),
    department: z.enum(DEPARTMENTS),
    avatar: z.string().url().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match', path: ['confirmPassword'],
  }).transform(({ confirmPassword: _confirmPassword, ...data }) => data),
  params: z.object({}),
  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    password,
  }),
  params: z.object({}),
  query: z.object({}),
});

const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().trim().email().transform((value) => value.toLowerCase()) }),
  params: z.object({}),
  query: z.object({}),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().regex(/^[a-f\d]{64}$/i, 'Invalid reset token'),
    password,
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match', path: ['confirmPassword'],
  }).transform(({ confirmPassword: _confirmPassword, ...data }) => data),
  params: z.object({}),
  query: z.object({}),
});

const googleLoginSchema = z.object({
  body: z.object({ credential: z.string().min(1, 'Google credential is required') }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, googleLoginSchema };
