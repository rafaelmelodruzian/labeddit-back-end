import { BaseDataBase } from '../../src/database/BaseDatabase';
import { PostLikeDB } from '../../src/models/LikeDislike';
import { PostDB, PostDBGet } from '../../src/models/Post';

const postsMock: PostDBGet[] = [
	{
		id: 'id-mock-postUm',
		creator_id: 'id-mock-hashirama',
		content: 'Senju são o melhor clã',
		likes: 0,
		dislikes: 2,
		created_at: new Date().toISOString(),
		comments: 2,
		nick: 'Hashirama',
	},
	{
		id: 'id-mock-postDois',
		creator_id: 'id-mock-madara',
		content: 'Uchiga são o melhor clã',
		likes: 2,
		dislikes: 0,
		created_at: new Date().toISOString(),
		comments: 1,
		nick: 'Madara',
	},
];

const likesMock: PostLikeDB[] = [
	{
		user_id: 'id-mock-hashirama',
		post_id: 'id-mock-postUm',
		like: 1,
	},
	{
		user_id: 'id-mock-madara',
		post_id: 'id-mock-postUm',
		like: 0,
	},
];

export class PostDatabaseMock extends BaseDataBase {
	public async getPosts(): Promise<PostDBGet[]> {
		return postsMock;
	}

	public async getPostById(id: string): Promise<PostDBGet> {
		const [post]: PostDBGet[] = postsMock.filter(
			(postEdit) => postEdit.id === id
		);
		return post;
	}

	public async insertPost(newPostDB: PostDB): Promise<void> {}

	public async editPost(post: PostDB): Promise<void> {}

	public async deletePost(id: string, creatorId: string): Promise<void> {}

	public async getLikesById(
		userId: string,
		postId: string
	): Promise<PostLikeDB> {
		const [like] = likesMock.filter(
			(like) => like.user_id === userId && like.post_id === postId
		);
		return like;
	}

	public async insertLikeDislike(newPostLike: PostLikeDB): Promise<void> {}

	public async deleteLikeDislike(
		userId: string,
		postId: string
	): Promise<void> {}

	public async updateLikeDislike(postLikeDB: PostLikeDB): Promise<void> {}
}
