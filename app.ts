import Fastify from "fastify";
import cors from "@fastify/cors";
import apiRouter from "./routes/api.js";
import { customErrorHandler } from "./controllers/errors.js";

const app = Fastify();

app.register(cors);

app.register(apiRouter, {prefix: '/api'});

app.setErrorHandler(customErrorHandler);

export default app;