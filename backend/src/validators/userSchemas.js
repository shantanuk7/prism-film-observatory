const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32).optional()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8)
  })
});

module.exports = { updateProfileSchema, changePasswordSchema };