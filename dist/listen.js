"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const { PORT = 9090 } = process.env;
app_1.default.listen(PORT)
    .on('listening', () => {
    console.log(`Server listening on Port ${PORT}...`);
})
    .on('error', (err) => {
    console.log(err);
});
