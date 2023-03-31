const router = require('express').Router();
const { getUsers, getUserById, getCommentsByUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:username', getUserById);

router.get('/:username/comments', getCommentsByUser);

module.exports = router;