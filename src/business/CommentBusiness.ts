import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentDatabase } from "../database/CommentDatabase";
import { CreateCommentInputDTO } from "../dtos/comment/createComment";
import { COMMENT_LIKE, Comment, CommentDB, LikeDislikeDBComment } from "../models/Comment";
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from "../dtos/comment/likeOrDislikeComment";
import { LikeDislikeDB } from "../models/Post";

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


  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { token, like, commentId } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const CommentDBWithCreatorName =
      await this.commentDatabase.findPostsWithCreatorNameById(commentId)

    if (!CommentDBWithCreatorName) {
      throw new NotFoundError("Não existe post com esse id")
    }

    const comment = new Comment(
      CommentDBWithCreatorName.id,
      CommentDBWithCreatorName.creator_id,
      CommentDBWithCreatorName.post_id,
      CommentDBWithCreatorName.content,
      CommentDBWithCreatorName.likes,   
      CommentDBWithCreatorName.dislikes,
      CommentDBWithCreatorName.created_at,
      CommentDBWithCreatorName.updated_at,     
      CommentDBWithCreatorName.creator_name,      
    ) 
     {}



    const likeSQlite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeDBComment = {
      user: payload.id,
      post_id: commentId,
      like: likeSQlite
    }

    const likeDislikeExists =
      await this.commentDatabase.findLikeDislike(likeDislikeDB)
      
    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB)
        comment.removeLike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB)
        comment.removeLike()
        comment.addDislike()
      }

    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB)
        comment.removeDislike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB)
        comment.removeDislike()
        comment.addLike()
      }

    } else {
      await this.commentDatabase.insertLikeDislike(likeDislikeDB)
      like ? comment.addLike() : comment.addDislike()
    }

    const updatedCommentDB = comment.toDBModel()
    await this.commentDatabase.updateComment(updatedCommentDB)

    const output: LikeOrDislikeCommentOutputDTO = undefined

    return output
  }


}



