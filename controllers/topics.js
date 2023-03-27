const { response } = require('../app');
const {selectTopics} = require('../models/topics');

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then(topics => res.status(200).send({topics}))
    .catch(err => next(err));
}