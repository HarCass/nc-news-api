const {
    selectUsers,
    selectUserById,
    selectCommentsByUser,
    checkUsernameExists,
    insertUser,
    removeUser,
    selectArticlesByUser
} = require('../models/users');

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then(users => res.status(200).send({users}))
    .catch(next);
}

exports.getUserById = (req, res, next) => {
    const {username} = req.params;
    return selectUserById(username)
    .then(user => res.status(200).send({user}))
    .catch(next);
}

exports.getCommentsByUser = (req, res, next) => {
    const {username} = req.params;
    return Promise.all([selectCommentsByUser(username), checkUsernameExists(username)])
    .then(([comments]) => res.status(200).send({comments}))
    .catch(next);
}

exports.postUser = (req, res, next) => {
    const data = req.body;
    return insertUser(data)
    .then(user => res.status(201).send({user}))
    .catch(next);
}

exports.delUser = (req, res, next) => {
    const {username} = req.params;
    return checkUsernameExists(username)
    .then(() => removeUser(username))
    .then(() => res.status(204).send())
    .catch(next);
}

exports.getArticlesByUser = (req, res, next) => {
    const {username} = req.params;
    return Promise.all([selectArticlesByUser(username), checkUsernameExists(username)])
    .then(([articles]) => res.status(200).send({articles}))
    .catch(next);
}