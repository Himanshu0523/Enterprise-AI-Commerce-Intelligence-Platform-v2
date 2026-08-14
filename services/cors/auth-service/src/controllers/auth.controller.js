const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { validationResult } = require('express-validator');
const tokenUtils = require('../utils/tokenUtils');
const emailService = require('../utils/emailService');
const { publishEvent } = require('../events/kafka');

// ─── REGISTRATION ────────────────────────────────────
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    await publishEvent('UserRegistered', {
      userId: user._id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      timestamp: new Date(),
    });

    // Save refresh token in DB
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(201).json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, roles: user.roles } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ─── LOGIN ──────────────────────────────────────────
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password +mfaEnabled');
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (user.googleId && !user.password) {
      return res.status(400).json({ msg: 'This account uses Google login. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // If MFA enabled, require second factor (don't issue tokens yet)
    if (user.mfaEnabled) {
      return res.json({ requireMFA: true, userId: user._id, msg: 'MFA required' });
    }

    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    await publishEvent('UserLoggedIn', {
      userId: user._id,
      email: user.email,
      timestamp: new Date(),
      ip: req.ip,
    });

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ─── TOKEN REFRESH ──────────────────────────────────
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ msg: 'Refresh token required' });

  try {
    // Verify the token itself is valid
    const decoded = tokenUtils.verifyRefreshToken(refreshToken);
    // Check in DB
    const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
    if (!storedToken) return res.status(401).json({ msg: 'Invalid refresh token' });

    // Revoke the old token (rotation)
    storedToken.revoked = true;
    await storedToken.save();

    // Issue new pair
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'User not found' });

    const newAccessToken = tokenUtils.generateAccessToken(user);
    const newRefreshToken = tokenUtils.generateRefreshToken(user);

    await RefreshToken.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Invalid refresh token' });
  }
};

// ─── LOGOUT ─────────────────────────────────────────
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ msg: 'Refresh token required' });

await publishEvent('UserLoggedOut', {
  userId: req.user.id,
  timestamp: new Date(),
});

  try {
    // Revoke the token
    await RefreshToken.updateOne({ token: refreshToken }, { revoked: true });
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ─── PASSWORD RESET ─────────────────────────────────
// Step 1: Request reset link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ msg: 'If that email exists, a reset link has been sent.' }); // ambiguous response for security

    const resetToken = tokenUtils.generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await emailService.sendResetEmail(email, resetUrl);

    res.json({ msg: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Step 2: Verify token & reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ msg: 'Token and new password required' });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke all existing refresh tokens for security
    await RefreshToken.updateMany({ user: user._id }, { revoked: true });

    res.json({ msg: 'Password reset successful. Please log in again.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ─── GOOGLE OAUTH ───────────────────────────────────
// (handled by Passport, so just the callback controller)
exports.googleCallback = (req, res) => {
  // After Passport authenticates, req.user is set
  const user = req.user;
  if (!user) return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);

  // Generate tokens
  const accessToken = tokenUtils.generateAccessToken(user);
  const refreshToken = tokenUtils.generateRefreshToken(user);

  // Save refresh token
  RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Redirect to frontend with tokens in query (or set cookies)
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?access=${accessToken}&refresh=${refreshToken}`);
};

// ─── MFA ────────────────────────────────────────────
// Setup MFA: returns secret and QR code
exports.setupMFA = async (req, res) => {
  const userId = req.user.id;   // from auth middleware
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  // Generate a new secret only if not already set
  const secret = speakeasy.generateSecret({ length: 20, name: `YourEcommerce:${user.email}` });
  user.mfaSecret = secret.base32;
  await user.save();

  // Generate QR code for Authenticator app
  const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  res.json({ secret: secret.base32, qrCode: qrCodeDataUrl });
};

// Verify the MFA token and enable MFA
exports.verifyAndEnableMFA = async (req, res) => {
  const userId = req.user.id;
  const { token } = req.body;
  if (!token) return res.status(400).json({ msg: 'OTP token required' });

  try {
    const user = await User.findById(userId).select('+mfaSecret');
    if (!user || !user.mfaSecret) return res.status(400).json({ msg: 'MFA not set up. Call /setup-mfa first.' });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 1, // allow 30 sec drift
    });

    if (!verified) return res.status(400).json({ msg: 'Invalid OTP' });

    user.mfaEnabled = true;
    await user.save();

    res.json({ msg: 'MFA enabled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify MFA during login (after password is correct)
exports.verifyMFA = async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).json({ msg: 'User ID and OTP token required' });

  try {
    const user = await User.findById(userId).select('+mfaSecret +mfaEnabled');
    if (!user) return res.status(400).json({ msg: 'User not found' });

    if (!user.mfaEnabled) return res.status(400).json({ msg: 'MFA is not enabled for this account' });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) return res.status(400).json({ msg: 'Invalid OTP' });

    // Now issue tokens
    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Disable MFA
exports.disableMFA = async (req, res) => {
  const userId = req.user.id;
  const { token } = req.body; // require current OTP to disable
  if (!token) return res.status(400).json({ msg: 'OTP token required' });

  try {
    const user = await User.findById(userId).select('+mfaSecret +mfaEnabled');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) return res.status(400).json({ msg: 'Invalid OTP' });

    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save();

    res.json({ msg: 'MFA disabled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ─── TOKEN VALIDATION ENDPOINT (used by API Gateway) ─
exports.validateToken = async (req, res) => {
  // req.body: { token: accessToken }
  const { token } = req.body;
  if (!token) return res.status(400).json({ msg: 'Token required' });

  try {
    const decoded = tokenUtils.verifyAccessToken(token);
    // Optionally check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'User not found' });

    res.json({ valid: true, user: { id: user._id, email: user.email, roles: user.roles } });
  } catch (err) {
    res.status(401).json({ valid: false, msg: 'Invalid or expired token' });
  }
};