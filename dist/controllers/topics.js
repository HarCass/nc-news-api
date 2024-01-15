"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTopic = exports.getTopics = void 0;
const topics_1 = require("../models/topics");
const getTopics = (_req, res, next) => {
    return (0, topics_1.selectTopics)()
        .then(topics => res.status(200).send({ topics }))
        .catch(next);
};
exports.getTopics = getTopics;
const postTopic = (req, res, next) => {
    const { slug, description } = req.body;
    return (0, topics_1.insertTopic)(slug, description)
        .then(topic => res.status(201).send({ topic }))
        .catch(next);
};
exports.postTopic = postTopic;
