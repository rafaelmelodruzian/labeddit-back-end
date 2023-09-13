import express from 'express';
import { PostController } from '../controller/PostController';
import { PostBusiness } from '../business/PostBusiness';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { PostDatabase } from '../database/PostDatabase';

export const postRouter = express.Router();

const postController = new PostController(
	new PostBusiness(new IdGenerator(), new TokenManager(), new PostDatabase())
);

postRouter.get('/', postController.getPosts);
postRouter.get('/:id', postController.getPostById);
postRouter.post('/', postController.createPost);
postRouter.put('/:id', postController.editPost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likePost);
postRouter.get('/:id/checklike', postController.checkLike);
