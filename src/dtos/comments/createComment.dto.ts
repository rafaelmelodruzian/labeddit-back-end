import z from 'zod';

export interface CreateCommentInputDTO {
	postId: string,
	content: string;
	token: string;
}

export const createCommentSchema = z.object({
	postId: z.string().min(1, {message: "Id do post inválido"}),
	content: z.string().min(1, {message: 'O Conteúdo deve ter no mínimo 1 caractere'}),
	token: z.string().min(1, {message: 'Token inválido'}),
});
