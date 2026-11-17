const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET or JWT_SECRET must be configured for auth-service.');
  }
  return secret;
};

const getRefreshSecret = () => {
  // A dedicated refresh secret is preferred; JWT_SECRET keeps existing Render
  // deployments compatible until JWT_REFRESH_SECRET is configured.
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET or JWT_SECRET must be configured for auth-service.');
  }
  return secret;
};

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, roles: user.roles },
    getAccessSecret(),
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    getRefreshSecret(),
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessSecret());
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};

exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


// Short-lived proof that the password step succeeded; never grants API access.
exports.generateMfaChallenge = (user) => jwt.sign(
  { id: user._id.toString(), purpose: 'mfa_challenge' },
  getAccessSecret(),
  { expiresIn: '5m', issuer: 'commerce-auth' }
);

exports.verifyMfaChallenge = (token) => {
  const decoded = jwt.verify(token, getAccessSecret(), { issuer: 'commerce-auth' });
  if (decoded.purpose !== 'mfa_challenge' || !decoded.id) {
    throw new Error('Invalid MFA challenge');
  }
  return decoded;
};
