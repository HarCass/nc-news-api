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
exports.selectCommentById = exports.updateCommentById = exports.checkCommentIdExists = exports.removeCommentById = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const removeCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query('DELETE FROM comments WHERE comment_id = $1', [id]);
});
exports.removeCommentById = removeCommentById;
const checkCommentIdExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query('SELECT * FROM comments WHERE comment_id = $1', [id])
        .then(({ rows }) => {
        if (!rows.length)
            return Promise.reject({ status: 404, msg: 'ID Not Found' });
    });
});
exports.checkCommentIdExists = checkCommentIdExists;
const updateCommentById = (inc_votes, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(+inc_votes))
        return Promise.reject({ status: 400, msg: 'Invalid Format' });
    return connection_1.default.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *', [inc_votes, id])
        .then(({ rows }) => {
        if (rows.length)
            return rows[0];
        return Promise.reject({ status: 404, msg: 'ID Not Found' });
    });
});
exports.updateCommentById = updateCommentById;
const selectCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return connection_1.default.query('SELECT * FROM comments WHERE comment_id = $1', [id])
        .then(({ rows }) => {
        if (rows.length)
            return rows[0];
        return Promise.reject({ status: 404, msg: 'ID Not Found' });
    });
});
exports.selectCommentById = selectCommentById;
