const router = require('express').Router();
const { getUsers, getUserById, getCommentsByUser, postUser, delUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:username', getUserById);

router.get('/:username/comments', getCommentsByUser);

router.post('/', postUser);

router.delete('/:username', delUser);

module.exports = router;