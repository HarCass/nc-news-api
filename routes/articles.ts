import { Router } from 'express';
import { getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, postArticle, delArticleById } from '../controllers/articles';

const router = Router();

router.get('/:article_id', getArticleById);

router.get('/', getArticles);

router.get('/:article_id/comments', getCommentsByArticleId);

router.post('/:article_id/comments', postCommentsByArticleId);

router.patch('/:article_id', patchArticleById);

router.post('/', postArticle);

router.delete('/:article_id', delArticleById);

export default router;