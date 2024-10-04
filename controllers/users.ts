import { FastifyReply, FastifyRequest } from 'fastify';
import { selectUsers, selectUserById, selectCommentsByUser, checkUsernameExists, insertUser, removeUser, selectArticlesByUser } from '../models/users.js';
import { User } from '../types/index.js';

export const getUsers = async (_req: FastifyRequest, rep: FastifyReply) => {
    const users = await selectUsers();
    rep.send({users});
}

export const getUserById = async (req: FastifyRequest<{Params: {username: string}}>, rep: FastifyReply) => {
    const {username} = req.params;
    const user = await selectUserById(username);
    rep.send({user});
}

export const getCommentsByUser = async (req: FastifyRequest<{Params: {username: string}}>, rep: FastifyReply) => {
    const {username} = req.params;
    const [comments] = await Promise.all([selectCommentsByUser(username), checkUsernameExists(username)]);
    rep.send({comments});
}

export const postUser = async (req: FastifyRequest<{Body: User}>, rep: FastifyReply) => {
    const data = req.body;
    const user = await insertUser(data);
    rep.status(201).send({user});
}

export const delUser = async (req: FastifyRequest<{Params: {username: string}}>, rep: FastifyReply) => {
    const {username} = req.params;
    await checkUsernameExists(username);
    await removeUser(username);
    rep.status(204).send();
}

export const getArticlesByUser = async (req: FastifyRequest<{Params: {username: string}}>, rep: FastifyReply) => {
    const {username} = req.params;
    const [articles] = await Promise.all([selectArticlesByUser(username), checkUsernameExists(username)]);
    rep.send({articles});
}