import z from 'zod';

export interface DeleteCommentInputDTO {
	id: string;
	token: string;
}

export const deleteCommentSchema = z.object({
	id: z.string().min(1, { message: 'Id inválido' }),
	token: z.string().min(1, { message: 'Token inválido' }),
});
