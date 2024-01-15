import db from '../db/connection';
import { Article, Comment, DbRows, User } from '../types';

export const selectUsers = async () => {
    return db.query('SELECT * FROM users')
    .then(({rows}: DbRows<User>) => rows);
}

export const selectUserById = async (username: string) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then(({rows}: DbRows<User>) =>  {
        if (!rows.length) return Promise.reject({status: 404, msg: 'User Not Found'});
        return rows[0];
    });
}

export const selectCommentsByUser = async (username: string) => {
    return db.query('SELECT * FROM comments WHERE author = $1', [username])
    .then(({rows}: DbRows<Comment>) => rows);
}

export const checkUsernameExists = async (username: string) => {
    await db.query('SELECT * FROM users WHERE username = $1', [username])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status:404, msg: 'Username Not Found'});
    });
}

export const insertUser = async (data: User) => {
    const sql = `
    INSERT INTO users
    (username, name, avatar_url)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    return db.query(sql, [data.username, data.name, data.avatar_url])
    .then(({rows}: DbRows<User>) => rows[0]);
}

export const removeUser = async (username: string) => {
    await db.query('DELETE FROM users WHERE username = $1', [username]);
}

export const selectArticlesByUser = async (username: string) => {
    const sql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.author = $1
    `
    return db.query(sql, [username])
    .then(({rows}: DbRows<Article>) => rows);
}