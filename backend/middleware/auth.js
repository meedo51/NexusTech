const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.isPasswordChanged(decoded.iat)) {
      return res.status(401).json({ error: 'Password changed recently. Please log in again' });
    }

    if (decoded.sessionId) {
      const sessionStillValid = user.refreshTokens.some(s => s._id.toString() === decoded.sessionId);
      if (!sessionStillValid) {
        return res.status(401).json({ error: 'Session has been terminated' });
      }
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) return next();
  res.status(403).json({ error: 'Admin access required' });
};

module.exports = { auth, adminOnly };
