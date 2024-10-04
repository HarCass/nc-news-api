"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9090;
app_js_1.default.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server running on ${PORT} ...`);
});
