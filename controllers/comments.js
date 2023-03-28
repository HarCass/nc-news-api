const {removeCommentById} = require('../models/comments');

exports.delCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    return removeCommentById(comment_id)
    .then(() => res.status(204).send())
    .catch(next);
}