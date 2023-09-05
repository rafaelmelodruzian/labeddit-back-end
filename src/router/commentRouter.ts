import express from 'express';
import { CommentController } from '../controller/CommentController';
import { CommentBusiness } from '../business/CommentBusiness';
import { CommentDatabase } from '../database/CommentDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export const commentRouter = express.Router();

const commentController = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

commentRouter.post("/:post_id", commentController.createComment)
commentRouter.get("/:post_id", commentController.getCommentsByPost)
commentRouter.delete("/:id", commentController.deleteComment)

export default commentRouter;
