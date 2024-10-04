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
const pg_format_1 = __importDefault(require("pg-format"));
const connection_js_1 = __importDefault(require("../connection.js"));
const utils_js_1 = require("./utils.js");
const seed = ({ topicData, userData, articleData, commentData }) => __awaiter(void 0, void 0, void 0, function* () {
    return connection_js_1.default
        .query(`DROP TABLE IF EXISTS comments;`)
        .then(() => {
        return connection_js_1.default.query(`DROP TABLE IF EXISTS articles;`);
    })
        .then(() => {
        return connection_js_1.default.query(`DROP TABLE IF EXISTS users;`);
    })
        .then(() => {
        return connection_js_1.default.query(`DROP TABLE IF EXISTS topics;`);
    })
        .then(() => {
        const topicsTablePromise = connection_js_1.default.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);
        const usersTablePromise = connection_js_1.default.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR
      );`);
        return Promise.all([topicsTablePromise, usersTablePromise]);
    })
        .then(() => {
        return connection_js_1.default.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
        .then(() => {
        return connection_js_1.default.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
        .then(() => {
        const insertTopicsQueryStr = (0, pg_format_1.default)('INSERT INTO topics (slug, description) VALUES %L;', topicData.map(({ slug, description }) => [slug, description]));
        const topicsPromise = connection_js_1.default.query(insertTopicsQueryStr);
        const insertUsersQueryStr = (0, pg_format_1.default)('INSERT INTO users ( username, name, avatar_url) VALUES %L;', userData.map(({ username, name, avatar_url }) => [
            username,
            name,
            avatar_url,
        ]));
        const usersPromise = connection_js_1.default.query(insertUsersQueryStr);
        return Promise.all([topicsPromise, usersPromise]);
    })
        .then(() => {
        const formattedArticleData = articleData.map(article => (0, utils_js_1.convertTimestampToDate)(article));
        const insertArticlesQueryStr = (0, pg_format_1.default)('INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;', formattedArticleData.map(({ title, topic, author, body, created_at, votes, article_img_url, }) => [title, topic, author, body, created_at, votes, article_img_url]));
        return connection_js_1.default.query(insertArticlesQueryStr);
    })
        .then(() => {
        const formattedCommentData = commentData.map(comment => (0, utils_js_1.convertTimestampToDate)(comment));
        const insertCommentsQueryStr = (0, pg_format_1.default)('INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;', formattedCommentData.map(({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
        ]));
        return connection_js_1.default.query(insertCommentsQueryStr);
    });
});
exports.default = seed;
