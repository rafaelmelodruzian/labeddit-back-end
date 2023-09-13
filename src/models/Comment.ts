export interface CommentDB {
	id: string;
	creator_id: string;
    post_id: string;
	content: string;
	likes: number;
	dislikes: number;
	created_at: string;
}

export interface CommentDBGet {
	id: string;
	creator_id: string;
    post_id: string;
	content: string;
	likes: number;
	dislikes: number;
	created_at: string;
	nick: string;
}

export interface CommentModel {
	id: string;
    post_id: string;
	content: string;
	likes: number;
	dislikes: number;
	createdAt: string;
	creator: {
		id: string;
		nick: string;
	};
}

export class Comment {
	constructor(
		private id: string,
		private creatorId: string,
        private postId: string,
		private content: string,
		private likes: number,
		private dislikes: number,
		private createdAt: string
	) {}

	public getId(): string {
		return this.id;
	}
	public setId(value: string): void {
		this.id = value;
	}

	public getCreatorId(): string {
		return this.creatorId;
	}
	public setCreatorId(value: string): void {
		this.creatorId = value;
	}

    public getPostId(): string {
		return this.postId;
	}
	public setPostId(value: string): void {
		this.postId = value;
	}

	public getContent(): string {
		return this.content;
	}
	public setContent(value: string): void {
		this.content = value;
	}

	public getLikes(): number {
		return this.likes;
	}
	public setLikes(value: number): void {
		this.likes = value;
	}

	public getDislikes(): number {
		return this.dislikes;
	}
	public setDislikes(value: number): void {
		this.dislikes = value;
	}

	public getCreatedAt(): string {
		return this.createdAt;
	}
	public setCreatedAt(value: string): void {
		this.createdAt = value;
	}

	public toDBModel(): CommentDB {
		return {
			id: this.id,
			creator_id: this.creatorId,
            post_id: this.postId,
			content: this.content,
			likes: this.likes,
			dislikes: this.dislikes,
			created_at: this.createdAt,
		};
	}

	public toBusinessModel(creatorNick: string): CommentModel {
		return {
			id: this.id,
            post_id: this.postId,
			content: this.content,
			likes: this.likes,
			dislikes: this.dislikes,
			createdAt: this.createdAt,
			creator: {
				id: this.creatorId,
				nick: creatorNick,
			},
		};
	}
}
