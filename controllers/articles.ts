import { FastifyReply, FastifyRequest } from "fastify";
import { selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentsByArticleId, updateArticleById, checkTopicExists, insertArticle, removeArticleById, checkArticleIdExists } from '../models/articles.js';
import { ArticlesResponse, GetArticlesParams, NewArticle, NewComment, NewVote, getCommentsParams } from '../types/index.js';

export const getArticleById = async (req: FastifyRequest<{Params: {article_id: string}}>, rep: FastifyReply) => {
    const {article_id} = req.params;
    const article = await selectArticleById(article_id);
    rep.send({article});
}

export const getArticles = async (req: FastifyRequest<{Querystring: GetArticlesParams}>, rep: FastifyReply) => {
    const {topic, sort_by, order, limit, p}: GetArticlesParams = req.query;
    const promiseArr: (Promise<ArticlesResponse> | Promise<void>)[] = [selectArticles(topic, sort_by, order, limit, p)];
    if (topic) promiseArr.push(checkTopicExists(topic));
    const [articlesResponse] = await Promise.all(promiseArr);
    rep.send(articlesResponse);
}

export const getCommentsByArticleId = async (req: FastifyRequest<{Params: {article_id: string}, Querystring: getCommentsParams}>, rep: FastifyReply) => {
    const {article_id} = req.params;
    const {limit, p} = req.query;
    const [comments] = await Promise.all([selectCommentsByArticleId(article_id, limit, p), checkArticleIdExists(article_id)]);
    rep.status(200).send({comments});
}

export const postCommentsByArticleId = async (req:FastifyRequest<{Params: {article_id: string}, Body: NewComment}>, rep: FastifyReply) => {
    const {article_id} = req.params;
    const {body} = req;
    const comment = await insertCommentsByArticleId(article_id, body);
    rep.status(201).send({comment});
}

export const patchArticleById = async (req: FastifyRequest<{Params: {article_id: string}, Body: NewVote}>, rep: FastifyReply) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    const article = await updateArticleById(article_id, inc_votes);
    rep.send({article});
}

export const postArticle = async (req: FastifyRequest<{Body: NewArticle}>, rep: FastifyReply) => {
    const data = req.body;
    const article = await insertArticle(data);
    rep.status(201).send({article});
}

export const delArticleById = async (req: FastifyRequest<{Params: {article_id: string}}>, rep: FastifyReply) => {
    const {article_id} = req.params;
    await checkArticleIdExists(article_id);
    await removeArticleById(article_id);
    rep.status(204).send();
}