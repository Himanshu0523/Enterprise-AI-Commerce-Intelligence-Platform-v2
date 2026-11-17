const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, roles: user.roles },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};