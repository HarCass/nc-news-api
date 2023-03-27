const db = require('../db/connection');

exports.selectArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

exports.selectArticles = () => {
    const sql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `
    return db.query(sql)
    .then(({rows}) => rows)
    .catch(err => err);
}

exports.selectCommentsByArticleId = (id) => {
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC', [id])
    .then(({rows}) => {
        if(rows.length) return rows;
        else return Promise.all([db.query('SELECT * FROM articles WHERE article_id = $1', [id]), rows])
        .then(([{rows}, comments]) => {
            if (rows.length) return comments
            else return Promise.reject({status: 404, msg: 'Comments Not Found'})
        });
    });
}

exports.insertCommentsByArticleId = (id, data) => {
    const valuesArr = [data.username, data.body, id];
    const sql = `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    return db.query(sql, valuesArr)
    .then(({rows}) => rows[0]);
}