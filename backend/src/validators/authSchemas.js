const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    role: z.enum(['OBSERVER', 'CONTRIBUTOR']).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128)
  })
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10)
  })
});

module.exports = { signupSchema, loginSchema, refreshSchema };