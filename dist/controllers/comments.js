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
exports.getCommentById = exports.patchCommentById = exports.delCommentById = void 0;
const comments_js_1 = require("../models/comments.js");
const delCommentById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    yield (0, comments_js_1.checkCommentIdExists)(comment_id);
    yield (0, comments_js_1.removeCommentById)(comment_id);
    rep.status(204).send();
});
exports.delCommentById = delCommentById;
const patchCommentById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const comment = yield (0, comments_js_1.updateCommentById)(inc_votes, comment_id);
    rep.send({ comment });
});
exports.patchCommentById = patchCommentById;
const getCommentById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const comment = yield (0, comments_js_1.selectCommentById)(comment_id);
    rep.send({ comment });
});
exports.getCommentById = getCommentById;
