"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("../controllers/api");
const topics_1 = __importDefault(require("./topics"));
const articles_1 = __importDefault(require("./articles"));
const comments_1 = __importDefault(require("./comments"));
const users_1 = __importDefault(require("./users"));
const router = (0, express_1.Router)();
router.get('/', api_1.getEndpoints);
router.use('/topics', topics_1.default);
router.use('/articles', articles_1.default);
router.use('/comments', comments_1.default);
router.use('/users', users_1.default);
exports.default = router;
