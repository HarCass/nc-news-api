const router = require('express').Router();
const { getEndpoints } = require('../controllers/api');
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');


router.get('/', getEndpoints);

router.use('/topics', topicsRouter);

router.use('/articles', articlesRouter);

router.use('/comments', commentsRouter);

router.use('/users', usersRouter);

module.exports = router;