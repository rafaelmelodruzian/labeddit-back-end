import { PostLikeDB } from '../models/LikeDislike';
import { PostDB, PostDBGet } from '../models/Post';
import { BaseDataBase } from './BaseDatabase';

export class PostDatabase extends BaseDataBase {
	public static TABLE_POSTS = 'posts';
	public static TABLE_COMMENTS = 'comments';
	public static TABLE_LIKES_DISLIKES = 'likes_dislikes';

	public async getPosts(): Promise<PostDBGet[]> {
		const posts: PostDBGet[] = await BaseDataBase.connection(
			PostDatabase.TABLE_POSTS
		)
			.select(
				'posts.id',
				'posts.creator_id',
				'posts.content',
				'posts.created_at',
				'users.nick',
				BaseDataBase.connection
					.count('comments.id as comments')
					.from(PostDatabase.TABLE_COMMENTS)
					.whereRaw('comments.post_id = posts.id')
					.as('comments'),
				BaseDataBase.connection
					.count('likes_dislikes.like as likes')
					.from('likes_dislikes')
					.whereRaw(
						'likes_dislikes.post_id = posts.id and likes_dislikes.like = 1'
					)
					.as('likes'),
				BaseDataBase.connection
					.count('likes_dislikes.like as dislikes')
					.from('likes_dislikes')
					.whereRaw(
						'likes_dislikes.post_id = posts.id and likes_dislikes.like = 0'
					)
					.as('dislikes')
			)
			.innerJoin('users', 'posts.creator_id', '=', 'users.id')
			.leftJoin('comments', 'posts.id', '=', 'comments.post_id')
			.leftJoin(
				'likes_dislikes',
				'posts.id',
				'=',
				'likes_dislikes.post_id'
			)
			.groupBy('posts.id');
		return posts;
	}

	public async getPostById(id: string): Promise<PostDBGet> {
		const [post]: PostDBGet[] = await BaseDataBase.connection(
			PostDatabase.TABLE_POSTS
		)
			.select(
				'posts.id',
				'posts.creator_id',
				'posts.content',
				'posts.created_at',
				'users.nick',
				BaseDataBase.connection
					.count('comments.id as comments')
					.from(PostDatabase.TABLE_COMMENTS)
					.whereRaw('comments.post_id = posts.id')
					.as('comments'),
				BaseDataBase.connection
					.count('likes_dislikes.like as likes')
					.from('likes_dislikes')
					.whereRaw(
						'likes_dislikes.post_id = posts.id and likes_dislikes.like = 1'
					)
					.as('likes'),
				BaseDataBase.connection
					.count('likes_dislikes.like as dislikes')
					.from('likes_dislikes')
					.whereRaw(
						'likes_dislikes.post_id = posts.id and likes_dislikes.like = 0'
					)
					.as('dislikes')
			)
			.innerJoin('users', 'posts.creator_id', '=', 'users.id')
			.leftJoin('comments', 'posts.id', '=', 'comments.post_id')
			.leftJoin(
				'likes_dislikes',
				'posts.id',
				'=',
				'likes_dislikes.post_id'
			)
			.groupBy('posts.id')
			.where('posts.id', '=', id);
		return post;
	}

	public async insertPost(newPostDB: PostDB): Promise<void> {
		await BaseDataBase.connection(PostDatabase.TABLE_POSTS).insert(
			newPostDB
		);
	}

	public async editPost(post: PostDB): Promise<void> {
		await BaseDataBase.connection(PostDatabase.TABLE_POSTS)
			.update(post)
			.where({ id: post.id });
	}

	public async deletePost(id: string, creatorId: string): Promise<void> {
		await BaseDataBase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
			.del()
			.where({ post_id: id });
		await BaseDataBase.connection(PostDatabase.TABLE_COMMENTS)
			.del()
			.where({ post_id: id });
		await BaseDataBase.connection(PostDatabase.TABLE_POSTS)
			.del()
			.where({ id, creator_id: creatorId });
	}

	public async getLikesById(
		userId: string,
		postId: string
	): Promise<PostLikeDB> {
		const [likes] = await BaseDataBase.connection(
			PostDatabase.TABLE_LIKES_DISLIKES
		)
			.where('user_id', '=', userId)
			.andWhere('post_id', '=', postId);
		return likes;
	}

	public async insertLikeDislike(newPostLike: PostLikeDB): Promise<void> {
		await BaseDataBase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
			newPostLike
		);
	}

	public async deleteLikeDislike(
		userId: string,
		postId: string
	): Promise<void> {
		await BaseDataBase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
			.del()
			.where('user_id', '=', userId)
			.andWhere('post_id', '=', postId);
	}

	public async updateLikeDislike(postLikeDB: PostLikeDB): Promise<void> {
		await BaseDataBase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
			.update(postLikeDB)
			.where('user_id', '=', postLikeDB.user_id)
			.andWhere('post_id', '=', postLikeDB.post_id);
	}
}
