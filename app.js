const express = require('express');
const { psqlErrHandler, customErrHandler } = require('./controllers/errors');
const apiRouter = require('./routes/api');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use(psqlErrHandler);

app.use(customErrHandler);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Internal Server Error'})
});

module.exports = app;