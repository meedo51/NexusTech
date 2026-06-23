const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const { sanitizeUser } = require('../utils/security');

const generateToken = (user, sessionId) => {
  return jwt.sign({ id: user._id, role: user.role, sessionId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const generateTempToken = (user) => {
  return jwt.sign({ id: user._id, purpose: '2fa' }, process.env.JWT_SECRET, { expiresIn: '5m' });
};

const addSession = (user, req) => {
  const session = {
    token: crypto.randomBytes(32).toString('hex'),
    device: req.headers['user-agent']?.slice(0, 100) || 'Unknown',
    ip: req.ip,
    userAgent: req.headers['user-agent']?.slice(0, 200) || '',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };
  user.refreshTokens.push(session);
  if (user.refreshTokens.length > 10) user.refreshTokens = user.refreshTokens.slice(-10);
  return user.refreshTokens[user.refreshTokens.length - 1];
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.isLocked) return res.status(423).json({ error: 'Account locked. Try again later.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) user.lockUntil = Date.now() + 30 * 60 * 1000;
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      const tempToken = generateTempToken(user);
      return res.json({ requiresTwoFactor: true, tempToken });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    const session = addSession(user, req);
    user.activityLog.push({ action: 'LOGIN', details: {}, ip: req.ip, userAgent: req.headers['user-agent']?.slice(0, 200) || '' });
    if (user.activityLog.length > 200) user.activityLog = user.activityLog.slice(-200);
    await user.save();

    const token = generateToken(user, session._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyTwoFactorLogin = async (req, res) => {
  try {
    const { tempToken, code } = req.body;
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (decoded.purpose !== '2fa') return res.status(401).json({ error: 'Invalid token' });

    const user = await User.findById(decoded.id).select('+password +twoFactorSecret');
    if (!user || !user.twoFactorEnabled) return res.status(401).json({ error: '2FA not enabled' });

    const backupIndex = user.twoFactorBackupCodes.findIndex(bc => bc.code === code && !bc.used);
    let verified = false;
    if (backupIndex !== -1) {
      user.twoFactorBackupCodes[backupIndex].used = true;
      verified = true;
    } else {
      verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: code, window: 1 });
    }

    if (!verified) return res.status(401).json({ error: 'Invalid 2FA code' });

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    const session = addSession(user, req);
    user.activityLog.push({ action: 'LOGIN', details: { twoFactor: true }, ip: req.ip, userAgent: req.headers['user-agent']?.slice(0, 200) || '' });
    if (user.activityLog.length > 200) user.activityLog = user.activityLog.slice(-200);
    await user.save();

    const token = generateToken(user, session._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const user = await User.create({ username, email, password, fullName: fullName || username });
    const session = addSession(user, req);
    const token = generateToken(user, session._id);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
