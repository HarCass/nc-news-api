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
exports.insertTopic = exports.selectTopics = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const selectTopics = () => __awaiter(void 0, void 0, void 0, function* () {
    return connection_1.default.query('SELECT * FROM topics')
        .then(({ rows }) => rows);
});
exports.selectTopics = selectTopics;
const insertTopic = (slug, description) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *
    `;
    return connection_1.default.query(sql, [slug, description])
        .then(({ rows }) => rows[0]);
});
exports.insertTopic = insertTopic;
