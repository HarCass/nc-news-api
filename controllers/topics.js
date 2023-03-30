const {selectTopics, insertTopic} = require('../models/topics');

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then(topics => res.status(200).send({topics}))
    .catch(err => next(err));
}

exports.postTopic = (req, res, next) => {
    const {slug, description} = req.body;
    return insertTopic(slug, description)
    .then(topic => res.status(201).send({topic}))
    .catch(next);
}