const router = require('express').Router();
const { getAll, getBySlug, getById, create, update, remove, updateViews } = require('../controllers/appController');
const { auth, adminOnly } = require('../middleware/auth');
const { validate, appSchema } = require('../middleware/validate');

router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:id', getById);
router.post('/', auth, adminOnly, validate(appSchema), create);
router.put('/:id', auth, adminOnly, validate(appSchema), update);
router.delete('/:id', auth, adminOnly, remove);
router.patch('/:id/views', updateViews);

module.exports = router;
