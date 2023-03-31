const router = require('express').Router();
const { getUsers, getUserById, getCommentsByUser, postUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:username', getUserById);

router.get('/:username/comments', getCommentsByUser);

router.post('/', postUser);

module.exports = router;