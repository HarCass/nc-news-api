"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrHandler = exports.psqlErrHandler = void 0;
const psqlErrHandler = (err, _req, res, next) => {
    if (err.code === '22P02')
        res.status(400).send({ msg: 'Invalid ID' });
    else if (err.code === '23502')
        res.status(400).send({ msg: 'Invalid Format' });
    else if (err.code === '23503') {
        if (err.constraint === 'comments_article_id_fkey')
            res.status(404).send({ msg: 'ID Not Found' });
        else if (err.constraint === 'articles_topic_fkey')
            res.status(404).send({ msg: 'Topic Not Found' });
        else
            res.status(404).send({ msg: 'Username Not Found' });
    }
    else if (err.code === '23505')
        res.status(400).send({ msg: 'Invalid Format' });
    else
        next(err);
};
exports.psqlErrHandler = psqlErrHandler;
const customErrHandler = (err, _req, res, _next) => {
    if (err.status)
        res.status(err.status).send({ msg: err.msg });
    else {
        console.log(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
};
exports.customErrHandler = customErrHandler;
