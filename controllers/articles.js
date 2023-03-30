const {
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    insertCommentsByArticleId,
    updateArticleById,
    checkTopicExists,
    insertArticle,
    removeArticleById,
    checkArticleIdExists
} = require('../models/articles');

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then(article => res.status(200).send({article}))
    .catch(err => next(err));
}

exports.getArticles = (req, res, next) => {
    const {topic, sort_by, order, limit, p} = req.query;
    const promiseArr = [selectArticles(topic, sort_by, order, limit, p)];
    if (topic) promiseArr.push(checkTopicExists(topic));
    return Promise.all(promiseArr)
    .then(([[articles, total_count]]) => res.status(200).send({articles, total_count}))
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {limit, p} = req.query;
    return Promise.all([selectCommentsByArticleId(article_id, limit, p), checkArticleIdExists(article_id)])
    .then(([comments]) => res.status(200).send({comments}))
    .catch(next);
}

exports.postCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {body} = req
    return insertCommentsByArticleId(article_id, body)
    .then(comment => res.status(201).send({comment}))
    .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    return updateArticleById(article_id, inc_votes)
    .then(article =>res.status(200).send({article}))
    .catch(next);
}

exports.postArticle = (req, res, next) => {
    const data = req.body;
    return insertArticle(data)
    .then(article => res.status(201).send({article}))
    .catch(next);
}

exports.delArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return checkArticleIdExists(article_id)
    .then(() => removeArticleById(article_id))
    .then(() => res.status(204).send())
    .catch(next);
}