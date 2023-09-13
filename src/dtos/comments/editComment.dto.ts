import z from 'zod';

export interface EditCommentInputDTO {
	id: string;
	token: string;
	content: string;
}

export const editCommentSchema = z.object({
	id: z.string().min(1, { message: 'Id inválido' }),
	token: z.string().min(1, { message: 'Token inválido' }),
	content: z
		.string()
		.min(1, { message: 'O Conteúdo deve ter no mínimo 1 caractere' }),
});
