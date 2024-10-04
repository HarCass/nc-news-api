import { FastifyInstance } from 'fastify';
import { getEndpoints } from '../controllers/api.js';
import topicsRouter from './topics.js';
import articlesRouter from './articles.js';
import commentsRouter from './comments.js';
import usersRouter from './users.js';

const apiRouter = async (app: FastifyInstance) => {
    app.get('/', getEndpoints);
    
    app.register(topicsRouter, {prefix: '/topics'});
    
    app.register(articlesRouter, {prefix: '/articles'});
    
    app.register(commentsRouter, {prefix: '/comments'});
    
    app.register(usersRouter, {prefix: '/users'});
};

export default apiRouter;