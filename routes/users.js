const router = require('express').Router();
const { getUsers, getUserById, getCommentsByUser, postUser, delUser, getArticlesByUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:username', getUserById);

router.get('/:username/comments', getCommentsByUser);

router.post('/', postUser);

router.delete('/:username', delUser);

router.get('/:username/articles', getArticlesByUser);

module.exports = router;