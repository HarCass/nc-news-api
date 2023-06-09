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

exports.insertUser = (data) => {
    const sql = `
    INSERT INTO users
    (username, name, avatar_url)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    return db.query(sql, [data.username, data.name, data.avatar_url])
    .then(({rows}) => rows[0]);
}

exports.removeUser = (username) => {
    return db.query('DELETE FROM users WHERE username = $1', [username]);
}

exports.selectArticlesByUser = (username) => {
    const sql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.author = $1
    `
    return db.query(sql, [username])
    .then(({rows}) => rows);
}