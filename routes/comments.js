const router = require('express').Router();
const { delCommentById, patchCommentById, getCommentById } = require('../controllers/comments');

router.delete('/:comment_id', delCommentById);

router.patch('/:comment_id', patchCommentById);

router.get('/:comment_id', getCommentById)

module.exports = router;