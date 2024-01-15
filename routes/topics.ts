import { Router } from 'express';
import { getTopics, postTopic } from '../controllers/topics';

const router = Router();

router.get('/', getTopics);

router.post('/', postTopic);

export default router;