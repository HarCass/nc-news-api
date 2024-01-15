import { selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentsByArticleId, updateArticleById, checkTopicExists, insertArticle, removeArticleById, checkArticleIdExists } from '../models/articles';
import { RequestHandler } from 'express';
import { ArticlesResponse, GetArticlesParams, NewArticle, NewVote, getCommentsParams } from '../types';

export const getArticleById: RequestHandler = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then(article => res.status(200).send({article}))
    .catch(next);
}

export const getArticles: RequestHandler = (req, res, next) => {
    const {topic, sort_by, order, limit, p}: GetArticlesParams = req.query as GetArticlesParams;
    const promiseArr: (Promise<ArticlesResponse> | Promise<void>)[] = [selectArticles(topic, sort_by, order, limit, p)];
    if (topic) promiseArr.push(checkTopicExists(topic));
    return Promise.all(promiseArr)
    .then(([articlesResponse]) => res.status(200).send(articlesResponse))
    .catch(next);
}

export const getCommentsByArticleId: RequestHandler = (req, res, next) => {
    const {article_id} = req.params;
    const {limit, p} = req.query as getCommentsParams;
    return Promise.all([selectCommentsByArticleId(article_id, limit, p), checkArticleIdExists(article_id)])
    .then(([comments]) => res.status(200).send({comments}))
    .catch(next);
}

export const postCommentsByArticleId: RequestHandler = (req, res, next) => {
    const {article_id} = req.params;
    const {body} = req;
    return insertCommentsByArticleId(article_id, body)
    .then(comment => res.status(201).send({comment}))
    .catch(next);
}

export const patchArticleById: RequestHandler = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body as NewVote;
    return updateArticleById(article_id, inc_votes)
    .then(article =>res.status(200).send({article}))
    .catch(next);
}

export const postArticle: RequestHandler = (req, res, next) => {
    const data = req.body as NewArticle;
    return insertArticle(data)
    .then(article => res.status(201).send({article}))
    .catch(next);
}

export const delArticleById: RequestHandler = (req, res, next) => {
    const {article_id} = req.params;
    return checkArticleIdExists(article_id)
    .then(() => removeArticleById(article_id))
    .then(() => res.status(204).send())
    .catch(next);
}