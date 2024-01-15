import express from 'express';
import { psqlErrHandler, customErrHandler } from './controllers/errors';
import apiRouter from './routes/api';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use(psqlErrHandler);

app.use(customErrHandler);

export default app;