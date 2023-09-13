export interface PostDB {
	id: string;
	creator_id: string;
	content: string;
	likes: number;
	dislikes: number;
	created_at: string;
}

export interface PostDBGet {
	id: string;
	creator_id: string;
	content: string;
	likes: number;
	dislikes: number;
	created_at: string;
	comments: number;
	nick: string;
}

export interface PostModel {
	id: string;
	content: string;
	likes: number;
	dislikes: number;
	createdAt: string;
	creator: {
		id: string;
		nick: string;
	};
	comments: number;
}

export class Post {
	constructor(
		private id: string,
		private creatorId: string,
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

	public toDBModel(): PostDB {
		return {
			id: this.id,
			creator_id: this.creatorId,
			content: this.content,
			likes: this.likes,
			dislikes: this.dislikes,
			created_at: this.createdAt,
		};
	}

	public toBusinessModel(creatorNick: string, comments: number): PostModel {
		return {
			id: this.id,
			content: this.content,
			likes: this.likes,
			dislikes: this.dislikes,
			createdAt: this.createdAt,
			creator: {
				id: this.creatorId,
				nick: creatorNick,
			},
			comments: comments,
		};
	}
}
