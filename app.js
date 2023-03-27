const express = require('express');
const {getTopics} = require('./controllers/topics');

const app = express();

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
});

module.exports = app;