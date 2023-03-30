const express = require('express');
const { getEndpoints } = require('./controllers/api');
const { psqlErrHandler, customErrHandler } = require('./controllers/errors');
const { topicsRouter, articlesRouter, commentsRouter, usersRouter } = require('./routes/index');

const app = express();

app.use(express.json());

app.get('/api', getEndpoints)

app.use('/api/topics', topicsRouter);

app.use('/api/articles', articlesRouter);

app.use('/api/comments', commentsRouter);

app.use('/api/users', usersRouter);

app.use(psqlErrHandler);

app.use(customErrHandler);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Internal Server Error'})
});

module.exports = app;