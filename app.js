const express = require('express');
const {getTopics} = require('./controllers/topics');
const {getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById} = require('./controllers/articles');
const {getUsers} = require('./controllers/users');
const {psqlErrHandler, customErrHandler} = require('./controllers/errors');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentsByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/users', getUsers);

app.use(psqlErrHandler);

app.use(customErrHandler);

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
});

module.exports = app;