import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { Request, Response } from 'express';
import { PostBusiness } from '../business/PostBusiness';
import { getPostsSchema } from '../dtos/posts/getPosts.dto';
import { createPostSchema } from '../dtos/posts/createPost.dto';
import { editPostSchema } from '../dtos/posts/editPost.dto';
import { deletePostSchema } from '../dtos/posts/deletePost.dto';
import { likePostChema } from '../dtos/posts/likePost.dto';

export class PostController {
	constructor(private postBusiness: PostBusiness) {}

	public getPosts = async (req: Request, res: Response) => {
		try {
			const token = getPostsSchema.parse({
				token: req.headers.authorization,
			});

			const output = await this.postBusiness.getPosts(token);

			res.status(200).send(output);
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public getPostById = async (req: Request, res: Response) => {
		try {
			const input = deletePostSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
			});

			const output = await this.postBusiness.getPostById(input);

			res.status(200).send(output);
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public createPost = async (req: Request, res: Response) => {
		try {
			const input = createPostSchema.parse({
				content: req.body.content,
				token: req.headers.authorization,
			});

			await this.postBusiness.createPost(input);

			res.status(201).send();
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public editPost = async (req: Request, res: Response): Promise<void> => {
		try {
			const input = editPostSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
				content: req.body.content,
			});

			await this.postBusiness.editPost(input);

			res.status(200).send();
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public deletePost = async (req: Request, res: Response): Promise<void> => {
		try {
			const input = deletePostSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
			});

			await this.postBusiness.deletePost(input);

			res.status(200).send();
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public likePost = async (req: Request, res: Response): Promise<void> => {
		try {
			const input = likePostChema.parse({
				id: req.params.id,
				token: req.headers.authorization,
				like: req.body.like,
			});

			await this.postBusiness.likePost(input);

			res.status(200).send();
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public checkLike = async (req: Request, res: Response) => {
		try {
			const input = deletePostSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
			});

			const response = await this.postBusiness.checkLike(input);

			res.status(200).send(response);
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};
}
