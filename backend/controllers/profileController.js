const User = require('../models/User');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { validatePasswordStrength, generateBackupCodes, sanitizeUser } = require('../utils/security');
const { sendEmail } = require('../utils/email');

const logActivity = (user, action, details = {}, req) => {
  user.activityLog.push({ action, details, ip: req.ip, userAgent: req.headers['user-agent'] });
};

exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ status: 'success', data: { user: sanitizeUser(user) } });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { fullName, username, preferences } = req.body;
  const updateData = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (username !== undefined) updateData.username = username;
  if (preferences !== undefined) updateData.preferences = preferences;

  const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
  logActivity(user, 'PROFILE_UPDATED', { fields: Object.keys(updateData) }, req);
  await user.save({ validateBeforeSave: false });
  res.json({ status: 'success', data: { user: sanitizeUser(user) } });
});

exports.updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));
  const user = await User.findByIdAndUpdate(req.user.id, { avatar: `/uploads/${req.file.filename}` }, { new: true });
  logActivity(user, 'AVATAR_UPDATED', {}, req);
  await user.save({ validateBeforeSave: false });
  res.json({ status: 'success', data: { user: sanitizeUser(user) } });
});

exports.deleteAvatar = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { avatar: null }, { new: true });
  res.json({ status: 'success', data: { user: sanitizeUser(user) } });
});

exports.changeEmail = catchAsync(async (req, res, next) => {
  const { newEmail, password } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(password))) return next(new AppError('Current password is incorrect', 401));

  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser && existingUser.id !== req.user.id) return next(new AppError('Email already in use', 400));

  user.email = newEmail;
  user.pendingEmail = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  logActivity(user, 'EMAIL_CHANGED', {}, req);
  await user.save({ validateBeforeSave: false });

  res.json({ status: 'success', message: 'Email updated successfully' });
});

exports.verifyEmailChange = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError('Invalid or expired verification token', 400));

  user.email = user.pendingEmail;
  user.pendingEmail = null;
  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();
  res.json({ status: 'success', message: 'Email verified successfully' });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) return next(new AppError('Passwords do not match', 400));

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) return next(new AppError('Current password is incorrect', 401));

  const strength = validatePasswordStrength(newPassword);
  if (!strength.isValid) return next(new AppError(strength.requirements.join('; '), 400));

  user.password = newPassword;
  user.loginAttempts = 0;
  logActivity(user, 'PASSWORD_CHANGED', {}, req);
  await user.save();

  res.json({ status: 'success', message: 'Password changed successfully' });
});

exports.validatePassword = catchAsync(async (req, res) => {
  const { password } = req.body;
  const strength = validatePasswordStrength(password);
  res.json({ status: 'success', data: strength });
});

exports.getTwoFactorStatus = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('+twoFactorSecret');
  res.json({
    status: 'success',
    data: { enabled: user.twoFactorEnabled, verified: !!req.headers['x-2fa-verified'] }
  });
});

exports.enableTwoFactor = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+twoFactorSecret');
  const secret = speakeasy.generateSecret({ name: `NexusTech:${user.email}` });
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  user.twoFactorSecret = secret.base32;
  await user.save({ validateBeforeSave: false });
  res.json({ status: 'success', data: { secret: secret.base32, qrCode, otpauthUrl: secret.otpauth_url } });
});

exports.verifyTwoFactor = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const user = await User.findById(req.user.id).select('+twoFactorSecret');
  const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: code });
  if (!verified) return next(new AppError('Invalid verification code', 400));

  user.twoFactorEnabled = true;
  const backupCodes = generateBackupCodes();
  user.twoFactorBackupCodes = backupCodes.map(c => ({ code: c, used: false }));
  logActivity(user, 'TWO_FACTOR_ENABLED', {}, req);
  await user.save();

  res.json({ status: 'success', message: '2FA enabled', data: { backupCodes } });
});

exports.disableTwoFactor = catchAsync(async (req, res, next) => {
  const { password, code } = req.body;
  const user = await User.findById(req.user.id).select('+password +twoFactorSecret');
  if (!(await user.comparePassword(password))) return next(new AppError('Invalid password', 401));

  if (user.twoFactorEnabled && code) {
    const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: code });
    if (!verified) return next(new AppError('Invalid 2FA code', 400));
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  user.twoFactorBackupCodes = [];
  logActivity(user, 'TWO_FACTOR_DISABLED', {}, req);
  await user.save();
  res.json({ status: 'success', message: '2FA disabled' });
});

exports.getBackupCodes = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.twoFactorEnabled) return next(new AppError('2FA is not enabled', 400));
  const unused = user.twoFactorBackupCodes.filter(c => !c.used).map(c => c.code);
  res.json({ status: 'success', data: { backupCodes: unused } });
});

exports.regenerateBackupCodes = catchAsync(async (req, res, next) => {
  const { password, code } = req.body;
  const user = await User.findById(req.user.id).select('+password +twoFactorSecret');
  if (!(await user.comparePassword(password))) return next(new AppError('Invalid password', 401));
  if (user.twoFactorEnabled && code) {
    const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: code });
    if (!verified) return next(new AppError('Invalid 2FA code', 400));
  }
  const newCodes = generateBackupCodes();
  user.twoFactorBackupCodes = newCodes.map(c => ({ code: c, used: false }));
  await user.save();
  res.json({ status: 'success', data: { backupCodes: newCodes } });
});

exports.getSessions = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ status: 'success', data: { sessions: user.refreshTokens } });
});

exports.terminateSession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;
  const user = await User.findById(req.user.id);
  const session = user.refreshTokens.id(sessionId);
  if (!session) return next(new AppError('Session not found', 404));
  session.deleteOne();
  logActivity(user, 'SESSION_TERMINATED', { sessionId }, req);
  await user.save();
  res.json({ status: 'success', message: 'Session terminated' });
});

exports.terminateAllSessions = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(password))) return next(new AppError('Invalid password', 401));
  user.refreshTokens = [];
  logActivity(user, 'ALL_SESSIONS_TERMINATED', {}, req);
  await user.save();
  res.json({ status: 'success', message: 'All sessions terminated' });
});

exports.getActivityLog = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  const limit = parseInt(req.query.limit) || 50;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const activities = user.activityLog.slice().reverse().slice(skip, skip + limit);
  res.json({
    status: 'success',
    data: { activities, total: user.activityLog.length, page, limit }
  });
});

exports.updatePreferences = catchAsync(async (req, res) => {
  const { theme, notifications, language } = req.body;
  const update = {};
  if (theme !== undefined) update['preferences.theme'] = theme;
  if (notifications !== undefined) update['preferences.notifications'] = notifications;
  if (language !== undefined) update['preferences.language'] = language;
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true });
  res.json({ status: 'success', data: { preferences: user.preferences } });
});
