const router = require('express').Router();
const { validate } = require('../../middleware/validateRequest');
const { signupSchema, loginSchema, refreshSchema } = require('../../validators/authSchemas');
const { authRequired } = require('../../middleware/auth');
const { signupController, loginController, refreshController, logoutController } = require('./auth.controller');

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);
router.post('/refresh', validate(refreshSchema), refreshController);
router.post('/logout', authRequired, validate(refreshSchema), logoutController);

module.exports = router;
