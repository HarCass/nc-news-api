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
const articles_js_1 = require("../controllers/articles.js");
const articlesRouter = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get('/:article_id', articles_js_1.getArticleById);
    app.get('/', articles_js_1.getArticles);
    app.get('/:article_id/comments', articles_js_1.getCommentsByArticleId);
    app.post('/:article_id/comments', articles_js_1.postCommentsByArticleId);
    app.patch('/:article_id', articles_js_1.patchArticleById);
    app.post('/', articles_js_1.postArticle);
    app.delete('/:article_id', articles_js_1.delArticleById);
});
exports.default = articlesRouter;
