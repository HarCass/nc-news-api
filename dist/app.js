"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const api_js_1 = __importDefault(require("./routes/api.js"));
const errors_js_1 = require("./controllers/errors.js");
const app = (0, fastify_1.default)();
app.register(cors_1.default);
app.register(api_js_1.default, { prefix: '/api' });
app.setErrorHandler(errors_js_1.customErrorHandler);
exports.default = app;
