import { FastifyReply, FastifyRequest } from "fastify";
import { DatabaseError } from "pg";
import { CustomError } from "../types/index.js";

export const customErrorHandler = (err: Error | CustomError, _req: FastifyRequest, rep: FastifyReply) => {
    if ((err instanceof DatabaseError)) {
        if (err.code === '22P02') rep.status(400).send({msg: 'Invalid ID'});
        else if (err.code === '23502') rep.status(400).send({msg: 'Invalid Format'});
        else if (err.code === '23503') {
            if (err.constraint === 'comments_article_id_fkey') rep.status(404).send({msg: 'ID Not Found'});
            else if (err.constraint === 'articles_topic_fkey') rep.status(404).send({msg: 'Topic Not Found'});
            else rep.status(404).send({msg: 'Username Not Found'});
        }
        else if (err.code === '23505') rep.status(400).send({msg: 'Invalid Format'});
    }

    else if ('status' in err) rep.status(err.status).send({msg: err.msg});

    else {
        console.log(err);
        rep.status(500).send({msg: 'Internal Server Error'});
    }
}