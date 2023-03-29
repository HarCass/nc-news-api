const db = require('../db/connection');

exports.removeCommentById = (id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1', [id]);
}

exports.checkCommentIdExists = (id) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1', [id])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status:404, msg: 'ID Not Found'});
    })
}

exports.updateCommentById = (inc_votes, id) => {
    if(isNaN(inc_votes)) return Promise.reject({status: 400, msg: 'Invalid Format'});
    return db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *', [inc_votes, id])
    .then(({rows}) => {
        if (rows.length) return rows[0];
        return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}