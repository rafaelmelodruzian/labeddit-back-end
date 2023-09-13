import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { signupSchema } from '../dtos/users/signup.dto';
import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { loginSchema } from '../dtos/users/login.dto';
import { getUserIdSchema } from '../dtos/users/getUserId.dto';

export class UserController {
	constructor(private userBusiness: UserBusiness) {}

	public signup = async (req: Request, res: Response) => {
		try {
			const input = signupSchema.parse({
				nick: req.body.nick,
				email: req.body.email,
				password: req.body.password,
			});

			const output = await this.userBusiness.signup(input);
			res.status(200).send(output);
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public login = async (req: Request, res: Response) => {
		try {
			const input = loginSchema.parse({
				email: req.body.email,
				password: req.body.password,
			});

			const output = await this.userBusiness.login(input);

			res.status(200).send(output);
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};

	public getUserId = async (req: Request, res: Response) => {
		try {
			const input = getUserIdSchema.parse({
				token: req.headers.authorization,
			});

			const output = await this.userBusiness.getUserId(input);

			res.status(200).send(output);
		} catch (error) {
			console.log(error);

			if (error instanceof ZodError) {
				res.status(400).send(error.issues[0].message);
			} else if (error instanceof BaseError) {
				res.status(error.statusCode).send(error.message);
			} else {
				res.status(500).send('Erro inesperado');
			}
		}
	};
}
