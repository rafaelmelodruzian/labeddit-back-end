import { PostDatabase } from '../database/PostDatabase';
import { CreatePostInputDTO } from '../dtos/posts/createPost.dto';
import { DeletePostInputDTO } from '../dtos/posts/deletePost.dto';
import { EditPostInputDTO } from '../dtos/posts/editPost.dto';
import {
	GetPostsInputDTO,
	GetPostsOutputDTO,
} from '../dtos/posts/getPosts.dto';
import { LikePostInputDTO, LikeStatus } from '../dtos/posts/likePost.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { LikesDislikes, PostLikeDB } from '../models/LikeDislike';
import { Post, PostDB, PostDBGet, PostModel } from '../models/Post';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export class PostBusiness {
	constructor(
		private idGenerator: IdGenerator,
		private tokenManager: TokenManager,
		private postDatabase: PostDatabase
	) {}

	public getPosts = async (
		input: GetPostsInputDTO
	): Promise<GetPostsOutputDTO> => {
		const payload = this.tokenManager.getPayload(input.token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const postsDB: PostDBGet[] = await this.postDatabase.getPosts();
		const posts = postsDB.map((postDB) => {
			const post = new Post(
				postDB.id,
				postDB.creator_id,
				postDB.content,
				postDB.likes,
				postDB.dislikes,
				postDB.created_at
			);
			return post.toBusinessModel(postDB.nick, postDB.comments);
		});

		const output: GetPostsOutputDTO = posts;
		return output;
	};

	public createPost = async (input: CreatePostInputDTO): Promise<void> => {
		const { content, token } = input;

		const payload = this.tokenManager.getPayload(token);
		const id = this.idGenerator.generate();

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const newPost = new Post(
			id,
			payload.id,
			content,
			0,
			0,
			new Date().toISOString()
		);

		const newPostDB = newPost.toDBModel();
		await this.postDatabase.insertPost(newPostDB);
	};

	public editPost = async (input: EditPostInputDTO): Promise<void> => {
		const { id, token, content } = input;

		const payload = this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);

		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		if (payload.id !== post.creator_id) {
			throw new BadRequestError(
				'Somente quem criou o post pode editá-lo'
			);
		}

		const newPost = new Post(
			post.id,
			post.creator_id,
			content,
			post.likes,
			post.dislikes,
			post.created_at
		);

		await this.postDatabase.editPost(newPost.toDBModel());
	};

	public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
		const { id, token } = input;

		const payload = this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);

		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		if (payload.id !== post.creator_id) {
			throw new BadRequestError('Só quem criou o post pode deletá-lo');
		}

		await this.postDatabase.deletePost(id, payload.id);
	};

	public likePost = async (input: LikePostInputDTO): Promise<void> => {
		const { id, token, like } = input;

		const payload = this.tokenManager.getPayload(token);
		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);
		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		const intLike = like ? 1 : 0;
		const checkLike: PostLikeDB = await this.postDatabase.getLikesById(
			payload.id,
			id
		);

		if (!checkLike) {
			const newLike = new LikesDislikes(payload.id, id, like);
			const newLikeDB = newLike.toDBModel();

			await this.postDatabase.insertLikeDislike(newLikeDB);
		} else if (checkLike.like === intLike) {
			await this.postDatabase.deleteLikeDislike(payload.id, id);
		} else {
			const newLike = new LikesDislikes(payload.id, id, like);
			const newLikeDB = newLike.toDBModel();

			await this.postDatabase.updateLikeDislike(newLikeDB);
		}
	};

	public checkLike = async (
		input: DeletePostInputDTO
	): Promise<LikeStatus> => {
		const { id, token } = input;

		const payload = this.tokenManager.getPayload(token);
		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);
		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		const checkLike: PostLikeDB = await this.postDatabase.getLikesById(
			payload.id,
			id
		);

		if (!checkLike) {
			return LikeStatus.None;
		} else if (checkLike.like == 1) {
			return LikeStatus.Like;
		} else {
			return LikeStatus.Dislike;
		}
	};

	public getPostById = async (
		input: DeletePostInputDTO
	): Promise<PostModel> => {
		const { id, token } = input;

		const payload = this.tokenManager.getPayload(token);
		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const postDB: PostDBGet = await this.postDatabase.getPostById(id);
		if (!postDB) {
			throw new NotFoundError('Post não encontrado');
		}

		const post = new Post(
			postDB.id,
			postDB.creator_id,
			postDB.content,
			postDB.likes,
			postDB.dislikes,
			postDB.created_at
		);
		return post.toBusinessModel(postDB.nick, postDB.comments);
	};
}
