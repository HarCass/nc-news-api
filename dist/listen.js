"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
app_js_1.default.listen({ port: 9090 }, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Server running ...");
});
