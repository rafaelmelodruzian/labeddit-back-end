import { BaseDatabase } from "./BaseDatabase";
import { CommentDB } from "../models/Comment";
import { NotFoundError } from "../errors/NotFoundError";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
      commentDB
    );
  };

  public getCommentsByPost = async (post_id: string): Promise<CommentDB[]> => {
    const comments = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select("comments.*", "users.name as creator_name")
      .join("users", "comments.creator_id", "users.id")
      .where({ post_id });

    return comments;
  };


  public deleteComment = async (id: string): Promise<void> => {
    const deletedCount = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id });

    if (deletedCount === 0) {
      throw new NotFoundError('Comentário não encontrado');
    }
  };


  public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select()
      .where({ id })
      .first();

    return result as CommentDB | undefined;
  };




}
