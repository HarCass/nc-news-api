const {removeCommentById, checkCommentIdExists} = require('../models/comments');

exports.delCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    return checkCommentIdExists(comment_id)
    .then(() => removeCommentById(comment_id))
    .then(() => res.status(204).send())
    .catch(next);
}