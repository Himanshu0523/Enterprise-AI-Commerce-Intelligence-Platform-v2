const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../utils/errors');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = config.jwt.secret;
    if (!secret) throw new Error('JWT_ACCESS_SECRET is not configured.');
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, roles/role, email, ... }
    req.userId = decoded.id;
    next();
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Insufficient permissions');
    }
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : (req.user.role ? [req.user.role] : []);
    const hasRole = roles.some(role => userRoles.includes(role));
    if (!hasRole) {
      throw new UnauthorizedError('Insufficient permissions');
    }
    next();
  };
}

module.exports = { authenticate, requireRole };