const router = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:username', getUserById);

module.exports = router;