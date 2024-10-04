"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delArticleById = exports.postArticle = exports.patchArticleById = exports.postCommentsByArticleId = exports.getCommentsByArticleId = exports.getArticles = exports.getArticleById = void 0;
const articles_js_1 = require("../models/articles.js");
const getArticleById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    const article = yield (0, articles_js_1.selectArticleById)(article_id);
    rep.send({ article });
});
exports.getArticleById = getArticleById;
const getArticles = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, sort_by, order, limit, p } = req.query;
    const promiseArr = [(0, articles_js_1.selectArticles)(topic, sort_by, order, limit, p)];
    if (topic)
        promiseArr.push((0, articles_js_1.checkTopicExists)(topic));
    const [articlesResponse] = yield Promise.all(promiseArr);
    rep.send(articlesResponse);
});
exports.getArticles = getArticles;
const getCommentsByArticleId = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    const { limit, p } = req.query;
    const [comments] = yield Promise.all([(0, articles_js_1.selectCommentsByArticleId)(article_id, limit, p), (0, articles_js_1.checkArticleIdExists)(article_id)]);
    rep.status(200).send({ comments });
});
exports.getCommentsByArticleId = getCommentsByArticleId;
const postCommentsByArticleId = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    const { body } = req;
    const comment = yield (0, articles_js_1.insertCommentsByArticleId)(article_id, body);
    rep.status(201).send({ comment });
});
exports.postCommentsByArticleId = postCommentsByArticleId;
const patchArticleById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const article = yield (0, articles_js_1.updateArticleById)(article_id, inc_votes);
    rep.send({ article });
});
exports.patchArticleById = patchArticleById;
const postArticle = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const article = yield (0, articles_js_1.insertArticle)(data);
    rep.status(201).send({ article });
});
exports.postArticle = postArticle;
const delArticleById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    yield (0, articles_js_1.checkArticleIdExists)(article_id);
    yield (0, articles_js_1.removeArticleById)(article_id);
    rep.status(204).send();
});
exports.delArticleById = delArticleById;
