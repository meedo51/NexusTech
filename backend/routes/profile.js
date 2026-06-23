const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, adminOnly } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

const upload = multer({ dest: 'uploads/' });

router.use(auth);
router.use(adminOnly);

router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);
router.patch('/avatar', upload.single('avatar'), profileController.updateAvatar);
router.delete('/avatar', profileController.deleteAvatar);

router.patch('/email', profileController.changeEmail);
router.post('/email/verify', profileController.verifyEmailChange);

router.patch('/password', profileController.changePassword);
router.post('/password/validate', profileController.validatePassword);

router.get('/2fa/status', profileController.getTwoFactorStatus);
router.post('/2fa/enable', profileController.enableTwoFactor);
router.post('/2fa/verify', profileController.verifyTwoFactor);
router.post('/2fa/disable', profileController.disableTwoFactor);
router.get('/2fa/backup-codes', profileController.getBackupCodes);
router.post('/2fa/regenerate-codes', profileController.regenerateBackupCodes);

router.get('/sessions', profileController.getSessions);
router.delete('/sessions/:sessionId', profileController.terminateSession);
router.delete('/sessions', profileController.terminateAllSessions);

router.get('/activities', profileController.getActivityLog);

router.patch('/preferences', profileController.updatePreferences);

module.exports = router;
