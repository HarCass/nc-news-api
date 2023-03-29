const { removeCommentById, checkCommentIdExists, updateCommentById } = require('../models/comments');

exports.delCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    return checkCommentIdExists(comment_id)
    .then(() => removeCommentById(comment_id))
    .then(() => res.status(204).send())
    .catch(next);
}

exports.patchCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    return updateCommentById(inc_votes, comment_id)
    .then(comment => res.status(200).send({comment}))
    .catch(next);
}