const express = require('express');
const {getTopics} = require('./controllers/topics');
const {getArticleById} = require('./controllers/articles');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
});

module.exports = app;