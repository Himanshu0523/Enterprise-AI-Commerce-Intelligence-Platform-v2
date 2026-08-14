const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userHeader = req.headers['x-user-id'];

  if (userHeader) {
    req.user = { id: userHeader, email: req.headers['x-user-email'], name: req.headers['x-user-name'] };
    return next();
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key');
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
  }

  return res.status(401).json({ msg: 'Authorization required' });
};
