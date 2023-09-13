import z from 'zod';

export interface SignupInputDTO {
	nick: string;
	email: string;
	password: string;
}

export const signupSchema = z
	.object({
		nick: z
			.string()
			.min(2, { message: 'O Apelido deve conter no mínimo 2 caracteres' })
			.max(32, {
				message: 'O Apelido deve conter no máximo 32 caracteres',
			}),
		email: z.string().email({ message: 'Email inválido' }),
		password: z
			.string()
			.min(4, { message: 'A senha deve ter no mínimo 4 caracteres' }),
	})
	.transform((data) => data as SignupInputDTO);
