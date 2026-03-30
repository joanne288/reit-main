const jwt = require('jsonwebtoken');

// Verify JWT — attach user to req
function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token provided.' });

  const token = header.split(' ')[1];   // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Malformed token.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// Only allow admins
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}

module.exports = { authenticate, adminOnly };
