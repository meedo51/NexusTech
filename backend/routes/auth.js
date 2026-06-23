const router = require('express').Router();
const { login, register, me, verifyTwoFactorLogin } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/login', login);
router.post('/verify-2fa', verifyTwoFactorLogin);
router.post('/register', register);
router.get('/me', auth, me);

module.exports = router;
