module.exports = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Missing user ID' });
  }
  req.userId = userId;
  req.user = { id: userId, email: req.headers['x-user-email'], name: req.headers['x-user-name'] };
  next();
};