module.exports = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Missing user ID' });
  }
  req.userId = userId;
  let roles = [];
  try { roles = JSON.parse(req.headers['x-user-roles'] || '[]'); } catch { roles = []; }
  req.user = { id: userId, email: req.headers['x-user-email'], name: req.headers['x-user-name'], roles, role: roles[0] || 'customer' };
  next();
};