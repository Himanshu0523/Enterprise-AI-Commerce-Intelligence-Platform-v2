const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation
const registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];
const loginValidation = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
];

// ─── Traditional auth routes ────────────────────────
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// ─── Password reset ─────────────────────────────────
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// ─── Google OAuth ────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  authController.googleCallback
);

// ─── MFA ────────────────────────────────────────────
router.post('/mfa/setup', authMiddleware, authController.setupMFA);
router.post('/mfa/verify-enable', authMiddleware, authController.verifyAndEnableMFA);
router.post('/mfa/verify-login', authController.verifyMFA);   // no auth middleware needed
router.post('/mfa/disable', authMiddleware, authController.disableMFA);

// ─── Token validation (for other services) ──────────
router.post('/validate', authController.validateToken);

module.exports = router;