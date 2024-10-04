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
exports.selectArticlesByUser = exports.removeUser = exports.insertUser = exports.checkUsernameExists = exports.selectCommentsByUser = exports.selectUserById = exports.selectUsers = void 0;
const connection_js_1 = __importDefault(require("../db/connection.js"));
const selectUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return connection_js_1.default.query('SELECT * FROM users')
        .then(({ rows }) => rows);
});
exports.selectUsers = selectUsers;
const selectUserById = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return connection_js_1.default.query('SELECT * FROM users WHERE username = $1', [username])
        .then(({ rows }) => {
        if (!rows.length)
            return Promise.reject({ status: 404, msg: 'User Not Found' });
        return rows[0];
    });
});
exports.selectUserById = selectUserById;
const selectCommentsByUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return connection_js_1.default.query('SELECT * FROM comments WHERE author = $1', [username])
        .then(({ rows }) => rows);
});
exports.selectCommentsByUser = selectCommentsByUser;
const checkUsernameExists = (username) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_js_1.default.query('SELECT * FROM users WHERE username = $1', [username])
        .then(({ rows }) => {
        if (!rows.length)
            return Promise.reject({ status: 404, msg: 'Username Not Found' });
    });
});
exports.checkUsernameExists = checkUsernameExists;
const insertUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    INSERT INTO users
    (username, name, avatar_url)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;
    return connection_js_1.default.query(sql, [data.username, data.name, data.avatar_url])
        .then(({ rows }) => rows[0]);
});
exports.insertUser = insertUser;
const removeUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_js_1.default.query('DELETE FROM users WHERE username = $1', [username]);
});
exports.removeUser = removeUser;
const selectArticlesByUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.author = $1
    `;
    return connection_js_1.default.query(sql, [username])
        .then(({ rows }) => rows);
});
exports.selectArticlesByUser = selectArticlesByUser;
