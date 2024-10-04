import { FastifyReply, FastifyRequest } from 'fastify';
import { removeCommentById, checkCommentIdExists, updateCommentById, selectCommentById } from '../models/comments.js';

export const delCommentById = async (req: FastifyRequest<{Params: {comment_id: string}}>, rep: FastifyReply) => {
    const {comment_id} = req.params;
    await checkCommentIdExists(comment_id);
    await removeCommentById(comment_id);
    rep.status(204).send();
}

export const patchCommentById = async (req: FastifyRequest<{Params: {comment_id: string}, Body: {inc_votes: string}}>, rep: FastifyReply) => {
    const {comment_id} = req.params;
    const {inc_votes} = req.body;
    const comment = await updateCommentById(inc_votes, comment_id);
    rep.send({comment});
}

export const getCommentById = async (req: FastifyRequest<{Params: {comment_id: string}}>, rep: FastifyReply) => {
    const {comment_id} = req.params;
    const comment = await selectCommentById(comment_id);
    rep.send({comment});
}