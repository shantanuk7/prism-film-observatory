const router = require('express').Router();
const { authRequired } = require('../../middleware/auth');
const { validate } = require('../../middleware/validateRequest');
const { updateProfileSchema, changePasswordSchema } = require('../../validators/userSchemas');
const { memoryUpload, getMeController, updateMeController, changePasswordController } = require('./user.controller');

router.get('/me', authRequired, getMeController);
router.put('/me', authRequired, memoryUpload, validate(updateProfileSchema), updateMeController);
router.put('/me/password', authRequired, validate(changePasswordSchema), changePasswordController);

module.exports = router;