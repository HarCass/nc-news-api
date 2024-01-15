"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_1 = require("../controllers/comments");
const router = (0, express_1.Router)();
router.delete('/:comment_id', comments_1.delCommentById);
router.patch('/:comment_id', comments_1.patchCommentById);
router.get('/:comment_id', comments_1.getCommentById);
exports.default = router;
