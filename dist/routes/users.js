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
const users_js_1 = require("../controllers/users.js");
const usersRouter = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get('/', users_js_1.getUsers);
    app.get('/:username', users_js_1.getUserById);
    app.get('/:username/comments', users_js_1.getCommentsByUser);
    app.post('/', users_js_1.postUser);
    app.delete('/:username', users_js_1.delUser);
    app.get('/:username/articles', users_js_1.getArticlesByUser);
});
exports.default = usersRouter;
