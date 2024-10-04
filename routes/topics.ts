import { FastifyInstance } from 'fastify';
import { getTopics, postTopic } from '../controllers/topics.js';

const topicsRouter = async (app: FastifyInstance) => {
    app.get('/', getTopics);
    
    app.post('/', postTopic);
};


export default topicsRouter;