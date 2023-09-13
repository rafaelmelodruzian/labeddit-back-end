import { CommentLikeDB } from '../models/LikeDislike';
import { CommentDB, CommentDBGet } from '../models/Comment';
import { BaseDataBase } from './BaseDatabase';

export class CommentDatabase extends BaseDataBase {
	public static TABLE_COMMENTS = 'comments';
	public static TABLE_LIKES_DISLIKES = 'comments_likes_dislikes';

	public async getComments(id: string): Promise<CommentDBGet[]> {
		const comment: CommentDBGet[] = await BaseDataBase.connection(
			CommentDatabase.TABLE_COMMENTS
		)
			.select(
				'comments.id',
				'comments.post_id',
				'comments.creator_id',
				'comments.content',
				'comments.created_at',
				'users.nick',
				BaseDataBase.connection
					.count('comments_likes_dislikes.like as likes')
					.from('comments_likes_dislikes')
					.whereRaw(
						'comments_likes_dislikes.comment_id = comments.id and comments_likes_dislikes.like = 1'
					)
					.as('likes'),
				BaseDataBase.connection
					.count('comments_likes_dislikes.like as dislikes')
					.from('comments_likes_dislikes')
					.whereRaw(
						'comments_likes_dislikes.comment_id = comments.id and comments_likes_dislikes.like = 0'
					)
					.as('dislikes')
			)
			.innerJoin('users', 'comments.creator_id', '=', 'users.id')
			.leftJoin(
				'comments_likes_dislikes',
				'comments.id',
				'=',
				'comments_likes_dislikes.comment_id'
			)
			.groupBy('comments.id')
			.where('comments.post_id', '=', id);
		return comment;
	}

	public async getCommentById(id: string): Promise<CommentDB> {
		const [comment]: CommentDB[] = await BaseDataBase.connection(
			CommentDatabase.TABLE_COMMENTS
		).where({ id });
		return comment;
	}

	public async insertComment(newCommentDB: CommentDB): Promise<void> {
		await BaseDataBase.connection(CommentDatabase.TABLE_COMMENTS).insert(
			newCommentDB
		);
	}

	public async editComment(comment: CommentDB): Promise<void> {
		await BaseDataBase.connection(CommentDatabase.TABLE_COMMENTS)
			.update(comment)
			.where({ id: comment.id });
	}

	public async deleteComment(id: string): Promise<void> {
		await BaseDataBase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
			.del()
			.where('comment_id', '=', id);
		await BaseDataBase.connection(CommentDatabase.TABLE_COMMENTS)
			.del()
			.where({ id });
	}

	public async getLikesById(
		userId: string,
		commentId: string
	): Promise<CommentLikeDB> {
		const [likes] = await BaseDataBase.connection(
			CommentDatabase.TABLE_LIKES_DISLIKES
		)
			.where('user_id', '=', userId)
			.andWhere('comment_id', '=', commentId);
		return likes;
	}

	public async insertLikeDislike(
		newCommentLike: CommentLikeDB
	): Promise<void> {
		await BaseDataBase.connection(
			CommentDatabase.TABLE_LIKES_DISLIKES
		).insert(newCommentLike);
	}

	public async deleteLikeDislike(
		userId: string,
		commentId: string
	): Promise<void> {
		await BaseDataBase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
			.del()
			.where('user_id', '=', userId)
			.andWhere('comment_id', '=', commentId);
	}

	public async updateLikeDislike(
		commentLikeDB: CommentLikeDB
	): Promise<void> {
		await BaseDataBase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
			.update(commentLikeDB)
			.where('user_id', '=', commentLikeDB.user_id)
			.andWhere('comment_id', '=', commentLikeDB.comment_id);
	}
}
