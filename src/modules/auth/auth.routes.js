const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../shared/middleware/validate');
const { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, googleLoginSchema } = require('./auth.validation');
const { protect } = require('./auth.middleware');

const router = express.Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', validate(googleLoginSchema), authController.googleLogin);
router.post('/refresh-token', authController.refresh);
router.post('/logout', authController.logout);
router.post('/verify-email', protect, authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
