import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentDatabase } from "../database/CommentDatabase";
import { CreateCommentInputDTO } from "../dtos/comment/createComment";
import { Comment, CommentDB } from "../models/Comment";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<void> => {
    const { post_id, content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const comment = new Comment(
      id,
      payload.id,
      post_id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.name
    );

    const commentDB = comment.toDBModel();
    await this.commentDatabase.insertComment(commentDB);
  };

  public getCommentsByPost = async (post_id: string) => {
    const comments = await this.commentDatabase.getCommentsByPost(post_id);
    return comments;
  };

  public deleteComment = async (id: string, token: string) => {
    const commentDB = await this.commentDatabase.findCommentById(id);
  
    if (!commentDB) {
      throw new NotFoundError('Comentário não encontrado');
    }
  
    const payload = this.tokenManager.getPayload(token);
  
    if (!payload) {
      throw new UnauthorizedError();
    }
  
    if (payload.id !== commentDB.creator_id) {
      throw new UnauthorizedError('Você não tem permissão para excluir este comentário');
    }
  
    await this.commentDatabase.deleteComment(id);
  };

}



