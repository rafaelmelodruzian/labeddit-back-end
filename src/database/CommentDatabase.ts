import { BaseDatabase } from "./BaseDatabase";
import { COMMENT_LIKE, CommentDB, CommentDBWithCreatorName } from "../models/Comment";
import { NotFoundError } from "../errors/NotFoundError";
import { LikeDislikeDBComment } from "../models/Comment";
import { UserDatabase } from "./UserDatabase";


export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DILIKES_COMMENTS = "likes_dislikes_comments"

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


  public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select()
      .where({ id })
      .first();

    return result as CommentDB | undefined;
  };


  public deleteComment = async (id: string): Promise<void> => {
    const deletedCount = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id });

    if (deletedCount === 0) {
      throw new NotFoundError('Comentário não encontrado');
    }
  };



  //LIKE OR DISLIKE 


  public updateComment = async (
    CommentDB: CommentDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .update(CommentDB)
      .where({ id: CommentDB.id })
  }

  public findPostsWithCreatorNameById =
    async (id: string): Promise<CommentDBWithCreatorName | undefined> => {

      const [result] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
          `${CommentDatabase.TABLE_COMMENTS}.id`,
          `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
          `${CommentDatabase.TABLE_COMMENTS}.content`,
          `${CommentDatabase.TABLE_COMMENTS}.likes`,
          `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
          `${CommentDatabase.TABLE_COMMENTS}.created_at`,
          `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
          `${UserDatabase.TABLE_USERS}.name as creator_name`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        )
        .where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id })

      return result as CommentDBWithCreatorName | undefined
    }


  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDBComment
  ): Promise<COMMENT_LIKE | undefined> => {

    const [result]: Array<LikeDislikeDBComment | undefined> = await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DILIKES_COMMENTS)
      .select()
      .where({
        user_id: likeDislikeDB.user,
        comment_id: likeDislikeDB.post_id
      })

    if (result === undefined) {
      return undefined

    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED

    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED
    }
  }

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDBComment
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DILIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user,
        comment_id: likeDislikeDB.post_id
      })
  }


  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDBComment
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DILIKES_COMMENTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user,
        comment_id: likeDislikeDB.post_id
      })
  }

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDBComment
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DILIKES_COMMENTS)
      .insert(likeDislikeDB)

  }


}
