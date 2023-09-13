import z from 'zod';

export interface GetUserIdInputDTO {
	token: string;
}

export const getUserIdSchema = z.object({
	token: z.string().min(1, 'Token inválido'),
});
