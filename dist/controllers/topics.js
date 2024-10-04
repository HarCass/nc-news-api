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
exports.postTopic = exports.getTopics = void 0;
const topics_js_1 = require("../models/topics.js");
const getTopics = (_req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield (0, topics_js_1.selectTopics)();
    rep.send({ topics });
});
exports.getTopics = getTopics;
const postTopic = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug, description } = req.body;
    const topic = yield (0, topics_js_1.insertTopic)(slug, description);
    rep.status(201).send({ topic });
});
exports.postTopic = postTopic;
