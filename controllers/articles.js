const {selectArticleById, selectArticles, insertCommentsByArticleId} = require('../models/articles');

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

exports.postCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {body} = req
    return insertCommentsByArticleId(article_id, body)
    .then(comment => res.status(201).send({comment}));
}