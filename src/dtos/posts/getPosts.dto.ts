import z from 'zod';
import { PostModel } from '../../models/Post';

export interface GetPostsInputDTO {
	token: string;
}

export type GetPostsOutputDTO = PostModel[]

export const getPostsSchema = z
	.object({
		token: z.string().min(1, {message: 'Token inválido'}),
	})
	.transform((data) => data as GetPostsInputDTO);
