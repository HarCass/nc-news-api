const db = require('../db/connection');

exports.selectArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

exports.selectCommentsByArticleId = (id) => {
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC', [id])
    .then(({rows}) => {
        if(rows.length) return rows;
        else return Promise.reject({status: 404, msg: 'Comments Not Found'})
    });
}