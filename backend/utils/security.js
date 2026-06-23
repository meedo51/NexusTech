const crypto = require('crypto');

exports.hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

exports.generateRandomToken = (length = 32) => crypto.randomBytes(length).toString('hex');

exports.sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.twoFactorBackupCodes;
  delete obj.refreshTokens;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

exports.validatePasswordStrength = (password) => {
  const checks = [];
  if (password.length < 12) checks.push('At least 12 characters');
  if (!/[A-Z]/.test(password)) checks.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) checks.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) checks.push('At least one number');
  if (!/[^A-Za-z0-9]/.test(password)) checks.push('At least one special character');
  return { isValid: checks.length === 0, requirements: checks };
};

exports.generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code.match(/.{1,4}/g).join('-'));
  }
  return codes;
};
