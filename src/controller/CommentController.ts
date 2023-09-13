import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { getCommentsSchema } from "../dtos/comments/getComment.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { createCommentSchema } from "../dtos/comments/createComment.dto";
import { editCommentSchema } from "../dtos/comments/editComment.dto";
import { deleteCommentSchema } from "../dtos/comments/deleteComment.dto";
import { likeCommentChema } from "../dtos/comments/likeComment.dto";

export class CommentController {
    constructor(private commentBusiness: CommentBusiness) {}

	public getComments = async (req: Request, res: Response) => {
		try {
			const input = getCommentsSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
			});

			const output = await this.commentBusiness.getComments(input);

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

	public createComment = async (req: Request, res: Response) => {
		try {
			const input = createCommentSchema.parse({
				postId: req.params.id,
				content: req.body.content,
				token: req.headers.authorization,
			});

			await this.commentBusiness.createComment(input);

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

	public editComment = async (req: Request, res: Response): Promise<void> => {
		try {
			const input = editCommentSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
				content: req.body.content,
			});

			await this.commentBusiness.editComment(input);

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

	public deleteComment = async (req: Request, res: Response): Promise<void> => {
		try {
			const input = deleteCommentSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
			});

			await this.commentBusiness.deleteComment(input);

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

	public likeComment = async (req: Request, res: Response): Promise<void> => {
		try {
			const input = likeCommentChema.parse({
				id: req.params.id,
				token: req.headers.authorization,
				like: req.body.like,
			});

			await this.commentBusiness.likeComment(input);

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
			const input = deleteCommentSchema.parse({
				id: req.params.id,
				token: req.headers.authorization,
			});

			const response = await this.commentBusiness.checkLike(input);

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