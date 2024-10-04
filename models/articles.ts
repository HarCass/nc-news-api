import db from '../db/connection.js';
import { Article, ArticlesResponse, Comment, NewArticle, NewComment, Optional } from '../types/index.js';

export const selectArticleById = async (id: string) => {
    const sql = `
    SELECT articles.*, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.article_id = $1
    `;
    return db.query<Article>(sql, [id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

export const selectArticles = async (topic: Optional<string>, sort = 'created_at', order = 'desc', limit: string = '10', p = '1'): Promise<ArticlesResponse> => {
    if (!['created_at', 'author', 'article_id', 'title', 'topic', 'votes', 'article_img_url', 'comment_count'].includes(sort)) return Promise.reject({status: 400, msg: 'Invalid Sort'});

    if (!['asc', 'desc'].includes(order)) return Promise.reject({status: 400, msg: 'Invalid Order'});

    if(isNaN(+limit) && limit !== 'all') return Promise.reject({status: 400, msg: 'Invalid Limit'});

    if(isNaN(+p)) return Promise.reject({status: 400, msg: 'Invalid Page'});

    const queryParams = [];
    let articleSql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    `;
    if(topic) {
        articleSql += `\nHAVING topic = $1`;
        queryParams.push(topic);
    }

    articleSql += sort === 'comment_count' ? `\nORDER BY ${sort} ${order.toUpperCase()}` : `\nORDER BY articles.${sort} ${order.toUpperCase()}`;

    articleSql += `\nLIMIT ${limit}`;

    if (limit !== 'all') {
        articleSql += `\nOFFSET ${+limit * (+p - 1)}`;
    }

    let countSql = 'SELECT * FROM articles';
    if(topic) countSql += ' WHERE topic = $1';
    
    return Promise.all([db.query<Article>(articleSql, queryParams), db.query(countSql, queryParams)])
    .then(([{rows}, {rowCount}]) => ({articles: rows, total_count: rowCount!}));
}

export const selectCommentsByArticleId = async (id: string, limit: string = '10', p = '1') => {
    if (isNaN(+limit) && limit !== 'all') return Promise.reject({status: 400, msg: 'Invalid Limit'});
    
    if(isNaN(+p)) return Promise.reject({status: 400, msg: 'Invalid Page'});

    let sql = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT ${limit}`;

    if (limit !== 'all') sql += ` OFFSET ${+limit * (+p-1)}`;

    return db.query<Comment>(sql, [id])
    .then(({rows}) => rows);
}

export const insertCommentsByArticleId = async (id: string, data: NewComment) => {
    const valuesArr = [data.username, data.body, id];
    const sql = `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    return db.query<Comment>(sql, valuesArr)
    .then(({rows}) => rows[0]);
}

export const updateArticleById = async (id: string, inc_votes: number) => {
    if(isNaN(inc_votes)) return Promise.reject({status: 400, msg: 'Invalid Format'});
    return db.query<Article>('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, id])
    .then(({rows}) => {
        if(rows.length) return rows[0];
        else return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

export const checkTopicExists = async (topic: Optional<string>) => {
    await db.query('SELECT * FROM topics WHERE slug = $1', [topic])
    .then(({rows}) => {
        if (!rows.length) return Promise.reject({status: 404, msg: 'Topic Not Found'});
    });
}

export const insertArticle = async (data: NewArticle) => {
    const valuesArr = [data.author, data.title, data.body, data.topic];
    let sql = `
    WITH new_article
    AS
    (INSERT INTO articles
    (author, title, body, topic`;
    
    if(data.article_img_url) {
        sql += `, article_img_url)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *)
        `;
        valuesArr.push(data.article_img_url);
    } else {
        sql += `)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *)
        `;
    }

    sql += `
    SELECT new_article.*, CAST(COUNT(comments) AS INT) AS comment_count
    FROM new_article
    LEFT JOIN comments ON comments.article_id = new_article.article_id
    GROUP BY new_article.article_id, new_article.author, new_article.title, new_article.body, new_article.topic, new_article.article_img_url, new_article.votes, new_article.created_at
    `;
    return db.query<Article>(sql, valuesArr)
    .then(({rows}) => rows[0]);
}

export const removeArticleById = async (id: string) => {
    await db.query('DELETE FROM articles WHERE article_id = $1', [id]);
}

export const checkArticleIdExists = async (id: string) => {
    await db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status:404, msg: 'ID Not Found'});
    });
}