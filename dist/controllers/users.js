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
exports.getArticlesByUser = exports.delUser = exports.postUser = exports.getCommentsByUser = exports.getUserById = exports.getUsers = void 0;
const users_js_1 = require("../models/users.js");
const getUsers = (_req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, users_js_1.selectUsers)();
    rep.send({ users });
});
exports.getUsers = getUsers;
const getUserById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const user = yield (0, users_js_1.selectUserById)(username);
    rep.send({ user });
});
exports.getUserById = getUserById;
const getCommentsByUser = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const [comments] = yield Promise.all([(0, users_js_1.selectCommentsByUser)(username), (0, users_js_1.checkUsernameExists)(username)]);
    rep.send({ comments });
});
exports.getCommentsByUser = getCommentsByUser;
const postUser = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = yield (0, users_js_1.insertUser)(data);
    rep.status(201).send({ user });
});
exports.postUser = postUser;
const delUser = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    yield (0, users_js_1.checkUsernameExists)(username);
    yield (0, users_js_1.removeUser)(username);
    rep.status(204).send();
});
exports.delUser = delUser;
const getArticlesByUser = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const [articles] = yield Promise.all([(0, users_js_1.selectArticlesByUser)(username), (0, users_js_1.checkUsernameExists)(username)]);
    rep.send({ articles });
});
exports.getArticlesByUser = getArticlesByUser;
