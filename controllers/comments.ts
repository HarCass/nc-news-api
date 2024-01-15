import { RequestHandler } from 'express';
import { removeCommentById, checkCommentIdExists, updateCommentById, selectCommentById } from '../models/comments';

export const delCommentById: RequestHandler = (req, res, next) => {
    const {comment_id} = req.params;
    return checkCommentIdExists(comment_id)
    .then(() => removeCommentById(comment_id))
    .then(() => res.status(204).send())
    .catch(next);
}

export const patchCommentById: RequestHandler = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    return updateCommentById(inc_votes, comment_id)
    .then(comment => res.status(200).send({comment}))
    .catch(next);
}

export const getCommentById: RequestHandler = (req, res, next) => {
    const {comment_id} = req.params;
    return selectCommentById(comment_id)
    .then(comment => res.status(200).send({comment}))
    .catch(next);
}