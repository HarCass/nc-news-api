"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articles_js_1 = __importDefault(require("./articles.js"));
const comments_js_1 = __importDefault(require("./comments.js"));
const topics_js_1 = __importDefault(require("./topics.js"));
const users_js_1 = __importDefault(require("./users.js"));
const devData = {
    articleData: articles_js_1.default,
    commentData: comments_js_1.default,
    topicData: topics_js_1.default,
    userData: users_js_1.default
};
exports.default = devData;
