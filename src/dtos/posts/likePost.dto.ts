import z from 'zod';

export enum LikeStatus {
	None = 'none',
	Like = 'like',
	Dislike = 'dislike',
}

export interface LikePostInputDTO {
	id: string;
	token: string;
	like: boolean;
}

export const likePostChema = z
	.object({
		id: z.string().min(1, { message: 'Id inválido' }),
		token: z.string().min(1, { message: 'Token inválido' }),
		like: z.boolean(),
	})
	.transform((data) => data as LikePostInputDTO);
