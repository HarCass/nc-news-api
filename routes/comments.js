const router = require('express').Router();
const { delCommentById, patchCommentById } = require('../controllers/comments');

router.delete('/:comment_id', delCommentById);

router.patch('/:comment_id', patchCommentById);

module.exports = router;