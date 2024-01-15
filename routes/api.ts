import { Router } from 'express';
import { getEndpoints } from '../controllers/api';
import topicsRouter from './topics';
import articlesRouter from './articles';
import commentsRouter from './comments';
import usersRouter from './users';

const router = Router();

router.get('/', getEndpoints);

router.use('/topics', topicsRouter);

router.use('/articles', articlesRouter);

router.use('/comments', commentsRouter);

router.use('/users', usersRouter);

export default router;