import { FastifyInstance } from 'fastify';
import { delCommentById, patchCommentById, getCommentById } from '../controllers/comments.js';

const commentsRouter = async (app: FastifyInstance) => {
    app.delete('/:comment_id', delCommentById);
    
    app.patch('/:comment_id', patchCommentById);
    
    app.get('/:comment_id', getCommentById);
};

export default commentsRouter;