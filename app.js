const express = require('express');
const {getTopics} = require('./controllers/topics');
const {getArticleById, getArticles, getCommentsByArticleId} = require('./controllers/articles');
const {psqlErrHandler, customErrHandler} = require('./controllers/errors');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use(psqlErrHandler);

app.use(customErrHandler);

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
});

module.exports = app;