"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkArticleIdExists = exports.removeArticleById = exports.insertArticle = exports.checkTopicExists = exports.updateArticleById = exports.insertCommentsByArticleId = exports.selectCommentsByArticleId = exports.selectArticles = exports.selectArticleById = void 0;
const connection_js_1 = __importDefault(require("../db/connection.js"));
const selectArticleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    SELECT articles.*, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.article_id = $1
    `;
    return connection_js_1.default.query(sql, [id])
        .then(({ rows }) => {
        if (rows.length)
            return rows[0];
        else
            return Promise.reject({ status: 404, msg: 'ID Not Found' });
    });
});
exports.selectArticleById = selectArticleById;
const selectArticles = (topic_1, ...args_1) => __awaiter(void 0, [topic_1, ...args_1], void 0, function* (topic, sort = 'created_at', order = 'desc', limit = '10', p = '1') {
    if (!['created_at', 'author', 'article_id', 'title', 'topic', 'votes', 'article_img_url', 'comment_count'].includes(sort))
        return Promise.reject({ status: 400, msg: 'Invalid Sort' });
    if (!['asc', 'desc'].includes(order))
        return Promise.reject({ status: 400, msg: 'Invalid Order' });
    if (isNaN(+limit) && limit !== 'all')
        return Promise.reject({ status: 400, msg: 'Invalid Limit' });
    if (isNaN(+p))
        return Promise.reject({ status: 400, msg: 'Invalid Page' });
    const queryParams = [];
    let articleSql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    `;
    if (topic) {
        articleSql += `\nHAVING topic = $1`;
        queryParams.push(topic);
    }
    articleSql += sort === 'comment_count' ? `\nORDER BY ${sort} ${order.toUpperCase()}` : `\nORDER BY articles.${sort} ${order.toUpperCase()}`;
    articleSql += `\nLIMIT ${limit}`;
    if (limit !== 'all') {
        articleSql += `\nOFFSET ${+limit * (+p - 1)}`;
    }
    let countSql = 'SELECT * FROM articles';
    if (topic)
        countSql += ' WHERE topic = $1';
    return Promise.all([connection_js_1.default.query(articleSql, queryParams), connection_js_1.default.query(countSql, queryParams)])
        .then(([{ rows }, { rowCount }]) => ({ articles: rows, total_count: rowCount }));
});
exports.selectArticles = selectArticles;
const selectCommentsByArticleId = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, limit = '10', p = '1') {
    if (isNaN(+limit) && limit !== 'all')
        return Promise.reject({ status: 400, msg: 'Invalid Limit' });
    if (isNaN(+p))
        return Promise.reject({ status: 400, msg: 'Invalid Page' });
    let sql = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT ${limit}`;
    if (limit !== 'all')
        sql += ` OFFSET ${+limit * (+p - 1)}`;
    return connection_js_1.default.query(sql, [id])
        .then(({ rows }) => rows);
});
exports.selectCommentsByArticleId = selectCommentsByArticleId;
const insertCommentsByArticleId = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const valuesArr = [data.username, data.body, id];
    const sql = `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    return connection_js_1.default.query(sql, valuesArr)
        .then(({ rows }) => rows[0]);
});
exports.insertCommentsByArticleId = insertCommentsByArticleId;
const updateArticleById = (id, inc_votes) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(inc_votes))
        return Promise.reject({ status: 400, msg: 'Invalid Format' });
    return connection_js_1.default.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, id])
        .then(({ rows }) => {
        if (rows.length)
            return rows[0];
        else
            return Promise.reject({ status: 404, msg: 'ID Not Found' });
    });
});
exports.updateArticleById = updateArticleById;
const checkTopicExists = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_js_1.default.query('SELECT * FROM topics WHERE slug = $1', [topic])
        .then(({ rows }) => {
        if (!rows.length)
            return Promise.reject({ status: 404, msg: 'Topic Not Found' });
    });
});
exports.checkTopicExists = checkTopicExists;
const insertArticle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const valuesArr = [data.author, data.title, data.body, data.topic];
    let sql = `
    WITH new_article
    AS
    (INSERT INTO articles
    (author, title, body, topic`;
    if (data.article_img_url) {
        sql += `, article_img_url)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *)
        `;
        valuesArr.push(data.article_img_url);
    }
    else {
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
    return connection_js_1.default.query(sql, valuesArr)
        .then(({ rows }) => rows[0]);
});
exports.insertArticle = insertArticle;
const removeArticleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_js_1.default.query('DELETE FROM articles WHERE article_id = $1', [id]);
});
exports.removeArticleById = removeArticleById;
const checkArticleIdExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_js_1.default.query('SELECT * FROM articles WHERE article_id = $1', [id])
        .then(({ rows }) => {
        if (!rows.length)
            return Promise.reject({ status: 404, msg: 'ID Not Found' });
    });
});
exports.checkArticleIdExists = checkArticleIdExists;
