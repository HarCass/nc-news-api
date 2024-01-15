import { Router } from "express";
import { delCommentById, patchCommentById, getCommentById } from '../controllers/comments';

const router = Router();

router.delete('/:comment_id', delCommentById);

router.patch('/:comment_id', patchCommentById);

router.get('/:comment_id', getCommentById);

export default router;