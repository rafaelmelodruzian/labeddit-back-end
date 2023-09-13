import { CommentDatabase } from '../database/CommentDatabase';
import { CreateCommentInputDTO } from '../dtos/comments/createComment.dto';
import { DeleteCommentInputDTO } from '../dtos/comments/deleteComment.dto';
import { EditCommentInputDTO } from '../dtos/comments/editComment.dto';
import {
	GetCommentsInputDTO,
	GetCommentsOutputDTO,
} from '../dtos/comments/getComment.dto';
import {
	LikeCommentInputDTO,
	LikeStatus,
} from '../dtos/comments/likeComment.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { CommentLikeDB, LikesDislikes } from '../models/LikeDislike';
import { Comment, CommentDB, CommentDBGet } from '../models/Comment';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export class CommentBusiness {
	constructor(
		private idGenerator: IdGenerator,
		private tokenManager: TokenManager,
		private commentDatabase: CommentDatabase
	) {}

	public getComments = async (
		input: GetCommentsInputDTO
	): Promise<GetCommentsOutputDTO> => {
		const { token, id } = input;
		const payload = this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const commentsDB: CommentDBGet[] =
			await this.commentDatabase.getComments(id);
		const comments = commentsDB.map((commentDB) => {
			const comment = new Comment(
				commentDB.id,
				commentDB.creator_id,
				commentDB.post_id,
				commentDB.content,
				commentDB.likes,
				commentDB.dislikes,
				commentDB.created_at
			);
			return comment.toBusinessModel(commentDB.nick);
		});

		const output: GetCommentsOutputDTO = comments;
		return output;
	};

	public createComment = async (
		input: CreateCommentInputDTO
	): Promise<void> => {
		const { postId, content, token } = input;

		const payload = this.tokenManager.getPayload(token);
		const id = this.idGenerator.generate();

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const newComment = new Comment(
			id,
			payload.id,
			postId,
			content,
			0,
			0,
			new Date().toISOString()
		);

		const newCommentDB = newComment.toDBModel();
		await this.commentDatabase.insertComment(newCommentDB);
	};

	public editComment = async (input: EditCommentInputDTO): Promise<void> => {
		const { id, token, content } = input;

		const payload = this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const comment: CommentDB = await this.commentDatabase.getCommentById(
			id
		);

		if (!comment) {
			throw new NotFoundError('Comment não encontrado');
		}

		if (payload.id !== comment.creator_id) {
			throw new BadRequestError(
				'Somente quem criou o comment pode editá-lo'
			);
		}

		const newComment = new Comment(
			comment.id,
			comment.creator_id,
			comment.post_id,
			content,
			comment.likes,
			comment.dislikes,
			comment.created_at
		);

		await this.commentDatabase.editComment(newComment.toDBModel());
	};

	public deleteComment = async (
		input: DeleteCommentInputDTO
	): Promise<void> => {
		const { id, token } = input;

		const payload = this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const comment: CommentDB = await this.commentDatabase.getCommentById(
			id
		);

		if (!comment) {
			throw new NotFoundError('Comment não encontrado');
		}

		if (payload.id !== comment.creator_id) {
			throw new BadRequestError('Só quem criou o comment pode deletá-lo');
		}

		await this.commentDatabase.deleteComment(id);
	};

	public likeComment = async (input: LikeCommentInputDTO): Promise<void> => {
		const { id, token, like } = input;

		const payload = this.tokenManager.getPayload(token);
		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const comment: CommentDB = await this.commentDatabase.getCommentById(
			id
		);
		if (!comment) {
			throw new NotFoundError('Comment não encontrado');
		}

		const intLike = like ? 1 : 0;
		const checkLike: CommentLikeDB =
			await this.commentDatabase.getLikesById(payload.id, id);

		if (!checkLike) {
			const newLike = new LikesDislikes(payload.id, id, like);
			const newLikeDB = newLike.toCommentDBModel();

			await this.commentDatabase.insertLikeDislike(newLikeDB);
		} else if (checkLike.like === intLike) {
			await this.commentDatabase.deleteLikeDislike(payload.id, id);
		} else {
			const newLike = new LikesDislikes(payload.id, id, like);
			const newLikeDB = newLike.toCommentDBModel();

			await this.commentDatabase.updateLikeDislike(newLikeDB);
		}
	};

	public checkLike = async (
		input: DeleteCommentInputDTO
	): Promise<LikeStatus> => {
		const { id, token } = input;

		const payload = this.tokenManager.getPayload(token);
		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const comment: CommentDB = await this.commentDatabase.getCommentById(
			id
		);
		if (!comment) {
			throw new NotFoundError('Comentário não encontrado');
		}

		const checkLike: CommentLikeDB =
			await this.commentDatabase.getLikesById(payload.id, id);

		if (!checkLike) {
			return LikeStatus.None;
		} else if (checkLike.like == 1) {
			return LikeStatus.Like;
		} else if (checkLike.like == 0) {
			return LikeStatus.Dislike;
		} else {
			throw new NotFoundError('Não encontrado');
		}
	};
}
