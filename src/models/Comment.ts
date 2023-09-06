export enum COMMENT_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export interface CommentDB {
  id: string;
  creator_id: string;
  post_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface CommentDBWithCreatorName {
  id: string;
  creator_id: string;
  post_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator_name: string;
}

export interface CommentModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
  };
}

export class Comment {
  constructor(
    private id: string,
    private creator_id: string,
    private post_id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private created_at: string,
    private updated_at: string,
    private creatorName: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getCreatorId(): string {
    return this.creator_id;
  }

  public getPostId(): string {
    return this.post_id;
  }

  public getContent(): string {
    return this.content;
  }

  public getLikes(): number {
    return this.likes;
  }

  public addLike(): void {
    this.likes++;
  }

  public removeLike(): void {
    this.likes--;
  }

  public getDislikes(): number {
    return this.dislikes;
  }

  public addDislike(): void {
    this.dislikes++;
  }

  public removeDislike(): void {
    this.dislikes--;
  }

  public getCreatedAt(): string {
    return this.created_at;
  }

  public getUpdatedAt(): string {
    return this.updated_at;
  }

  public getCreatorName(): string {
    return this.creatorName;
  }

  public setCreatorName(value: string): void {
    this.creatorName = value;
  }

  public toDBModel(): CommentDB {
    return {
      id: this.id,
      creator_id: this.creator_id,
      post_id: this.post_id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  public toBusinessModel(): CommentModel {
    return {
      id: this.id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      creator: {
        id: this.creator_id,
        name: this.creatorName,
      },
    };
  }
}


export interface LikeDislikeDBComment {
  user_id: string,
  comment_id: string,
  like: number
}

