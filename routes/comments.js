const router = require('express').Router();
const {delCommentById} = require('../controllers/comments');

router.delete('/:comment_id', delCommentById);

module.exports = router;