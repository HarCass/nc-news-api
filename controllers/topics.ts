import { RequestHandler } from 'express';
import { selectTopics, insertTopic } from '../models/topics';
import { Topic } from '../types';

export const getTopics: RequestHandler = (_req, res, next) => {
    return selectTopics()
    .then(topics => res.status(200).send({topics}))
    .catch(next);
}

export const postTopic: RequestHandler = (req, res, next) => {
    const {slug, description} = req.body as Topic;
    return insertTopic(slug, description)
    .then(topic => res.status(201).send({topic}))
    .catch(next);
}