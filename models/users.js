const db = require('../db/connection');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users')
    .then(({rows}) => rows);
}

exports.selectUserById = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then(({rows}) =>  {
        if (!rows.length) return Promise.reject({status: 404, msg: 'User Not Found'});
        return rows[0];
    });
}

exports.selectCommentsByUser = (username) => {
    return db.query('SELECT * FROM comments WHERE author = $1', [username])
    .then(({rows}) => rows);
}

exports.checkUsernameExists = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status:404, msg: 'Username Not Found'});
    });
}