const db = require('../db/connection');

exports.selectArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}