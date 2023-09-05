import { Request, Response } from 'express';
import { CreateCommentInputDTO } from '../dtos/comment/createComment';
import { CommentBusiness } from '../business/CommentBusiness';
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { LikeOrDislikeCommentSchema } from '../dtos/comment/likeOrDislikeComment';

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}

  public createComment = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const { content } = req.body;
      const { post_id } = req.params;

      const input: CreateCommentInputDTO = { content, token, post_id };

      await this.commentBusiness.createComment(input);

      res.status(201).send({ message: 'Comentário criado com sucesso' });
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public getCommentsByPost = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;

      const comments = await this.commentBusiness.getCommentsByPost(post_id);

      res.status(200).send(comments);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };


public deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization as string; // Obtém o token do cabeçalho da solicitação

    await this.commentBusiness.deleteComment(id, token); // Passe o token como segundo argumento

    res.status(204).send();
  } catch (error) {
    console.log(error);

    if (error instanceof BaseError) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send("Erro inesperado");
    }
  }
};


public likeOrDislikeComment = async (req: Request, res: Response) => {
  try {
    const input = LikeOrDislikeCommentSchema.parse({
      token: req.headers.authorization,
      commentId: req.params.id,
      like: req.body.like
    })

    const output = await this.commentBusiness.likeOrDislikeComment(input)

    res.status(200).send(output)
    
  } catch (error) {
    console.log(error)

    if (error instanceof ZodError) {
      res.status(400).send(error.issues)
    } else if (error instanceof BaseError) {
      res.status(error.statusCode).send(error.message)
    } else {
      res.status(500).send("Erro inesperado")
    }
  }
}




}
