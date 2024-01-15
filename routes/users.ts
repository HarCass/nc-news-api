import { Router } from "express";
import { getUsers, getUserById, getCommentsByUser, postUser, delUser, getArticlesByUser } from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/:username', getUserById);

router.get('/:username/comments', getCommentsByUser);

router.post('/', postUser);

router.delete('/:username', delUser);

router.get('/:username/articles', getArticlesByUser);

export default router;