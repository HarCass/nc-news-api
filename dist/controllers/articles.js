"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delArticleById = exports.postArticle = exports.patchArticleById = exports.postCommentsByArticleId = exports.getCommentsByArticleId = exports.getArticles = exports.getArticleById = void 0;
const articles_1 = require("../models/articles");
const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return (0, articles_1.selectArticleById)(article_id)
        .then(article => res.status(200).send({ article }))
        .catch(next);
};
exports.getArticleById = getArticleById;
const getArticles = (req, res, next) => {
    const { topic, sort_by, order, limit, p } = req.query;
    const promiseArr = [(0, articles_1.selectArticles)(topic, sort_by, order, limit, p)];
    if (topic)
        promiseArr.push((0, articles_1.checkTopicExists)(topic));
    return Promise.all(promiseArr)
        .then(([articlesResponse]) => res.status(200).send(articlesResponse))
        .catch(next);
};
exports.getArticles = getArticles;
const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { limit, p } = req.query;
    return Promise.all([(0, articles_1.selectCommentsByArticleId)(article_id, limit, p), (0, articles_1.checkArticleIdExists)(article_id)])
        .then(([comments]) => res.status(200).send({ comments }))
        .catch(next);
};
exports.getCommentsByArticleId = getCommentsByArticleId;
const postCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;
    return (0, articles_1.insertCommentsByArticleId)(article_id, body)
        .then(comment => res.status(201).send({ comment }))
        .catch(next);
};
exports.postCommentsByArticleId = postCommentsByArticleId;
const patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    return (0, articles_1.updateArticleById)(article_id, inc_votes)
        .then(article => res.status(200).send({ article }))
        .catch(next);
};
exports.patchArticleById = patchArticleById;
const postArticle = (req, res, next) => {
    const data = req.body;
    return (0, articles_1.insertArticle)(data)
        .then(article => res.status(201).send({ article }))
        .catch(next);
};
exports.postArticle = postArticle;
const delArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return (0, articles_1.checkArticleIdExists)(article_id)
        .then(() => (0, articles_1.removeArticleById)(article_id))
        .then(() => res.status(204).send())
        .catch(next);
};
exports.delArticleById = delArticleById;
