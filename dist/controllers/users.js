"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticlesByUser = exports.delUser = exports.postUser = exports.getCommentsByUser = exports.getUserById = exports.getUsers = void 0;
const users_1 = require("../models/users");
const getUsers = (_req, res, next) => {
    return (0, users_1.selectUsers)()
        .then(users => res.status(200).send({ users }))
        .catch(next);
};
exports.getUsers = getUsers;
const getUserById = (req, res, next) => {
    const { username } = req.params;
    return (0, users_1.selectUserById)(username)
        .then(user => res.status(200).send({ user }))
        .catch(next);
};
exports.getUserById = getUserById;
const getCommentsByUser = (req, res, next) => {
    const { username } = req.params;
    return Promise.all([(0, users_1.selectCommentsByUser)(username), (0, users_1.checkUsernameExists)(username)])
        .then(([comments]) => res.status(200).send({ comments }))
        .catch(next);
};
exports.getCommentsByUser = getCommentsByUser;
const postUser = (req, res, next) => {
    const data = req.body;
    return (0, users_1.insertUser)(data)
        .then(user => res.status(201).send({ user }))
        .catch(next);
};
exports.postUser = postUser;
const delUser = (req, res, next) => {
    const { username } = req.params;
    return (0, users_1.checkUsernameExists)(username)
        .then(() => (0, users_1.removeUser)(username))
        .then(() => res.status(204).send())
        .catch(next);
};
exports.delUser = delUser;
const getArticlesByUser = (req, res, next) => {
    const { username } = req.params;
    return Promise.all([(0, users_1.selectArticlesByUser)(username), (0, users_1.checkUsernameExists)(username)])
        .then(([articles]) => res.status(200).send({ articles }))
        .catch(next);
};
exports.getArticlesByUser = getArticlesByUser;
