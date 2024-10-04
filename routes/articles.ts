import { FastifyInstance } from 'fastify';
import { getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, postArticle, delArticleById } from '../controllers/articles.js';

const articlesRouter = async (app: FastifyInstance) => {
    app.get('/:article_id', getArticleById);
    
    app.get('/', getArticles);
    
    app.get('/:article_id/comments', getCommentsByArticleId);
    
    app.post('/:article_id/comments', postCommentsByArticleId);
    
    app.patch('/:article_id', patchArticleById);
    
    app.post('/', postArticle);
    
    app.delete('/:article_id', delArticleById);
};

export default articlesRouter;