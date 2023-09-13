import express from 'express';
import { CommentController } from '../controller/CommentController';
import { CommentBusiness } from '../business/CommentBusiness';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentDatabase } from '../database/CommentDatabase';

export const commentRouter = express.Router();

const commentController = new CommentController(
	new CommentBusiness(new IdGenerator(), new TokenManager(), new CommentDatabase())
);

commentRouter.get('/:id', commentController.getComments);
commentRouter.post('/:id', commentController.createComment);
commentRouter.put('/:id', commentController.editComment);
commentRouter.delete('/:id', commentController.deleteComment);
commentRouter.put('/:id/like', commentController.likeComment);
commentRouter.get('/:id/checklike', commentController.checkLike)
