const router = require('express').Router();
const upload = require('../middleware/upload');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, upload.single('file'), uploadImage);
router.delete('/:filename', auth, adminOnly, deleteImage);

module.exports = router;
