const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const cc = require('../controllers/contactController');

router.get('/public', cc.getPublicContact);

router.use(auth);

router.get('/', cc.getContact);
router.patch('/', cc.updateContact);
router.put('/', cc.replaceContact);

router.get('/social', cc.getSocialMedia);
router.post('/social', cc.addSocialMedia);
router.patch('/social/:platform', cc.updateSocialMedia);
router.delete('/social/:platform', cc.deleteSocialMedia);
router.patch('/social/reorder', cc.reorderSocialMedia);

router.patch('/hours', cc.updateBusinessHours);
router.patch('/form', cc.updateFormSettings);
router.patch('/location', cc.updateLocation);
router.patch('/emergency', cc.updateEmergencyContact);

module.exports = router;
