import z from 'zod';

export interface LoginInputDTO {
	email: string;
	password: string;
}

export const loginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(4, 'A senha deve conter 4 caracteres ou mais'),
});
