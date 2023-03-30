const db = require('../db/connection');

exports.selectArticleById = (id) => {
    const sql = `
    SELECT articles.*, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.article_id = $1
    `
    return db.query(sql, [id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

exports.selectArticles = (topic, sort = 'created_at', order = 'desc') => {
    if (!['created_at', 'author', 'article_id', 'title', 'topic', 'votes', 'article_img_url', 'comment_count'].includes(sort)) return Promise.reject({status: 400, msg: 'Invalid Sort'});

    if (!['asc', 'desc'].includes(order)) return Promise.reject({status: 400, msg: 'Invalid Order'});

    const queryParams = [];
    let sql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    `
    if(topic) {
        sql += '\nHAVING topic = $1';
        queryParams.push(topic);
    }

    sql += `\nORDER BY articles.${sort} ${order.toUpperCase()}`;
    
    return db.query(sql, queryParams)
    .then(({rows}) => rows);
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

exports.updateArticleById = (id, inc_votes) => {
    if(isNaN(inc_votes)) return Promise.reject({status: 400, msg: 'Invalid Format'});
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

exports.checkTopicExists = (topic) => {
    return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
    .then(({rows}) => {
        if (!rows.length) return Promise.reject({status: 404, msg: 'Topic Not Found'});
    });
}

exports.insertArticle = (data) => {
    const valuesArr = [data.author, data.title, data.body, data.topic];
    let sql = `
    WITH new_article
    AS
    (INSERT INTO articles
    (author, title, body, topic`
    
    if(data.article_img_url) {
        sql += `, article_img_url)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *)
        `
        valuesArr.push(data.article_img_url);
    } else {
        sql += `)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *)
        `
    }

    sql += `
    SELECT new_article.*, CAST(COUNT(comments) AS INT) AS comment_count
    FROM new_article
    LEFT JOIN comments ON comments.article_id = new_article.article_id
    GROUP BY new_article.article_id, new_article.author, new_article.title, new_article.body, new_article.topic, new_article.article_img_url, new_article.votes, new_article.created_at
    `
    return db.query(sql, valuesArr)
    .then(({rows}) => rows[0]);
}