const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Only admin/editor may change site content; athletes are read-only.
function staff(req, res, next) {
  if (!['admin', 'editor'].includes(req.user?.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { auth, staff };
