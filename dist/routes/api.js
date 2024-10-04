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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_js_1 = require("../controllers/api.js");
const topics_js_1 = __importDefault(require("./topics.js"));
const articles_js_1 = __importDefault(require("./articles.js"));
const comments_js_1 = __importDefault(require("./comments.js"));
const users_js_1 = __importDefault(require("./users.js"));
const apiRouter = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get('/', api_js_1.getEndpoints);
    app.register(topics_js_1.default, { prefix: '/topics' });
    app.register(articles_js_1.default, { prefix: '/articles' });
    app.register(comments_js_1.default, { prefix: '/comments' });
    app.register(users_js_1.default, { prefix: '/users' });
});
exports.default = apiRouter;
