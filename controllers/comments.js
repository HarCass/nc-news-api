const {removeCommentById, checkCommentIdExists} = require('../models/comments');

exports.delCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    return Promise.all([removeCommentById(comment_id), checkCommentIdExists(comment_id)])
    .then(() => res.status(204).send())
    .catch(next);
}