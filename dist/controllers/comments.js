"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentById = exports.patchCommentById = exports.delCommentById = void 0;
const comments_1 = require("../models/comments");
const delCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    return (0, comments_1.checkCommentIdExists)(comment_id)
        .then(() => (0, comments_1.removeCommentById)(comment_id))
        .then(() => res.status(204).send())
        .catch(next);
};
exports.delCommentById = delCommentById;
const patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    return (0, comments_1.updateCommentById)(inc_votes, comment_id)
        .then(comment => res.status(200).send({ comment }))
        .catch(next);
};
exports.patchCommentById = patchCommentById;
const getCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    return (0, comments_1.selectCommentById)(comment_id)
        .then(comment => res.status(200).send({ comment }))
        .catch(next);
};
exports.getCommentById = getCommentById;
