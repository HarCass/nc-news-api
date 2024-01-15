"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topics_1 = require("../controllers/topics");
const router = (0, express_1.Router)();
router.get('/', topics_1.getTopics);
router.post('/', topics_1.postTopic);
exports.default = router;
