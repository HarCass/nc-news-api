const { use } = require('../app');
const { selectUsers, selectUserById, selectCommentsByUser, checkUsernameExists } = require('../models/users');

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