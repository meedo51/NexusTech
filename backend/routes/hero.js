const router = require('express').Router();
const { getActive, getAll, getById, create, update, remove } = require('../controllers/heroController');
const { auth, adminOnly } = require('../middleware/auth');
const { validate, heroSchema } = require('../middleware/validate');

router.get('/active', getActive);
router.get('/', auth, adminOnly, getAll);
router.get('/:id', auth, adminOnly, getById);
router.post('/', auth, adminOnly, validate(heroSchema), create);
router.put('/:id', auth, adminOnly, validate(heroSchema), update);
router.delete('/:id', auth, adminOnly, remove);

module.exports = router;
