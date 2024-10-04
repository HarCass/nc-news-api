"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrorHandler = void 0;
const pg_1 = require("pg");
const customErrorHandler = (err, _req, rep) => {
    if ((err instanceof pg_1.DatabaseError)) {
        if (err.code === '22P02')
            rep.status(400).send({ msg: 'Invalid ID' });
        else if (err.code === '23502')
            rep.status(400).send({ msg: 'Invalid Format' });
        else if (err.code === '23503') {
            if (err.constraint === 'comments_article_id_fkey')
                rep.status(404).send({ msg: 'ID Not Found' });
            else if (err.constraint === 'articles_topic_fkey')
                rep.status(404).send({ msg: 'Topic Not Found' });
            else
                rep.status(404).send({ msg: 'Username Not Found' });
        }
        else if (err.code === '23505')
            rep.status(400).send({ msg: 'Invalid Format' });
    }
    else if ('status' in err)
        rep.status(err.status).send({ msg: err.msg });
    else {
        console.log(err);
        rep.status(500).send({ msg: 'Internal Server Error' });
    }
};
exports.customErrorHandler = customErrorHandler;
