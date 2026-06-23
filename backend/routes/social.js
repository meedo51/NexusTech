const router = require('express').Router();
const { getAll, getById, create, update, remove, reorder } = require('../controllers/socialController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', auth, adminOnly, getById);
router.post('/', auth, adminOnly, create);
router.put('/:id', auth, adminOnly, update);
router.delete('/:id', auth, adminOnly, remove);
router.post('/reorder', auth, adminOnly, reorder);

module.exports = router;
