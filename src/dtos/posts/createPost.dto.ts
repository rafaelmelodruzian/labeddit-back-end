import z from 'zod';

export interface CreatePostInputDTO {
	content: string;
	token: string;
}

export const createPostSchema = z.object({
	content: z.string().min(1, {message: 'O Conteúdo deve ter no mínimo 1 caractere'}),
	token: z.string().min(1, {message: 'Token inválido'}),
});
