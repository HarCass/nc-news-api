const {selectArticleById, selectCommentsByArticleId} = require('../models/articles');

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then(article => res.status(200).send({article}))
    .catch(err => next(err));
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    return selectCommentsByArticleId(article_id)
    .then(comments => res.status(200).send({comments}));
}