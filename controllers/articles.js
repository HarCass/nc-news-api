const {selectArticleById, selectArticles, selectCommentsByArticleId} = require('../models/articles');

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then(article => res.status(200).send({article}))
    .catch(err => next(err));
}

exports.getArticles = (req, res, next) => {
    return selectArticles()
    .then(articles => res.status(200).send({articles}))
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    return selectCommentsByArticleId(article_id)
    .then(comments => res.status(200).send({comments}))
    .catch(next);
}