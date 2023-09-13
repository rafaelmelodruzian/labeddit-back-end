export interface CommentLikeDB {
	user_id: string;
	comment_id: string;
	like: number;
}

export interface PostLikeDB {
	user_id: string;
	post_id: string;
	like: number;
}

export class LikesDislikes {
	constructor(
		private userId: string,
		private postId: string,
		private like: boolean
	) {}

	public getUserId(): string {
		return this.userId;
	}
	public setUserId(value: string): void {
		this.userId = value;
	}

	public getPostId(): string {
		return this.postId;
	}
	public setPostId(value: string): void {
		this.postId = value;
	}

	public getLike(): boolean {
		return this.like;
	}
	public setLike(value: boolean): void {
		this.like = value;
	}

	public toDBModel(): PostLikeDB {
		return {
			user_id: this.userId,
			post_id: this.postId,
			like: this.like === true ? 1 : 0,
		};
	}

	public toCommentDBModel(): CommentLikeDB {
		return {
			user_id: this.userId,
			comment_id: this.postId,
			like: this.like === true ? 1 : 0,
		};
	}
}
