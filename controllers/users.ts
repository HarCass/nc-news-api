import { RequestHandler } from 'express';
import { selectUsers, selectUserById, selectCommentsByUser, checkUsernameExists, insertUser, removeUser, selectArticlesByUser } from '../models/users';

export const getUsers: RequestHandler = (_req, res, next) => {
    return selectUsers()
    .then(users => res.status(200).send({users}))
    .catch(next);
}

export const getUserById: RequestHandler = (req, res, next) => {
    const {username} = req.params;
    return selectUserById(username)
    .then(user => res.status(200).send({user}))
    .catch(next);
}

export const getCommentsByUser: RequestHandler = (req, res, next) => {
    const {username} = req.params;
    return Promise.all([selectCommentsByUser(username), checkUsernameExists(username)])
    .then(([comments]) => res.status(200).send({comments}))
    .catch(next);
}

export const postUser: RequestHandler = (req, res, next) => {
    const data = req.body;
    return insertUser(data)
    .then(user => res.status(201).send({user}))
    .catch(next);
}

export const delUser: RequestHandler = (req, res, next) => {
    const {username} = req.params;
    return checkUsernameExists(username)
    .then(() => removeUser(username))
    .then(() => res.status(204).send())
    .catch(next);
}

export const getArticlesByUser: RequestHandler = (req, res, next) => {
    const {username} = req.params;
    return Promise.all([selectArticlesByUser(username), checkUsernameExists(username)])
    .then(([articles]) => res.status(200).send({articles}))
    .catch(next);
}