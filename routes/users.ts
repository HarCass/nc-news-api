import { FastifyInstance } from 'fastify';
import { getUsers, getUserById, getCommentsByUser, postUser, delUser, getArticlesByUser } from '../controllers/users.js';

const usersRouter = async (app: FastifyInstance) => {
    app.get('/', getUsers);
    
    app.get('/:username', getUserById);
    
    app.get('/:username/comments', getCommentsByUser);
    
    app.post('/', postUser);
    
    app.delete('/:username', delUser);
    
    app.get('/:username/articles', getArticlesByUser);
};

export default usersRouter;