import { FastifyReply, FastifyRequest } from 'fastify';
import { selectTopics, insertTopic } from '../models/topics.js';
import { Topic } from '../types/index.js';

export const getTopics = async (_req: FastifyRequest, rep: FastifyReply) => {
    const topics = await selectTopics();
    rep.send({topics});
}

export const postTopic = async (req: FastifyRequest<{Body: Topic}>, rep: FastifyReply) => {
    const {slug, description} = req.body;
    const topic = await insertTopic(slug, description);
    rep.status(201).send({topic});
}