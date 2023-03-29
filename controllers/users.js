const { selectUsers, selectUserById } = require('../models/users');

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