import z from 'zod';

export interface DeletePostInputDTO {
	id: string;
	token: string;
}

export const deletePostSchema = z.object({
	id: z.string().min(1, { message: 'Id inválido' }),
	token: z.string().min(1, { message: 'Token inválido' }),
});
