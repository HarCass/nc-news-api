const router = require('express').Router();
const {
    getArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentsByArticleId,
    patchArticleById,
    postArticle
} = require('../controllers/articles');

router.get('/:article_id', getArticleById);

router.get('/', getArticles);

router.get('/:article_id/comments', getCommentsByArticleId);

router.post('/:article_id/comments', postCommentsByArticleId);

router.patch('/:article_id', patchArticleById);

router.post('/', postArticle);

module.exports = router;