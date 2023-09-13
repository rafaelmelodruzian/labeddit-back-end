import z from 'zod';
import { CommentModel } from '../../models/Comment';

export interface GetCommentsInputDTO {
	id: string;
	token: string;
}

export type GetCommentsOutputDTO = CommentModel[];

export const getCommentsSchema = z
	.object({
		id: z.string().min(1, { message: 'Id inválido' }),
		token: z.string().min(1, { message: 'Token inválido' }),
	})
	.transform((data) => data as GetCommentsInputDTO);
