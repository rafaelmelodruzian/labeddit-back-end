import { UserDatabase } from '../database/UserDatabase';
import { GetUserIdInputDTO } from '../dtos/users/getUserId.dto';
import { LoginInputDTO } from '../dtos/users/login.dto';
import { SignupInputDTO } from '../dtos/users/signup.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { TokenPayload, User } from '../models/User';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export class UserBusiness {
	constructor(
		private userDatabase: UserDatabase,
		private idGenerator: IdGenerator,
		private hashManager: HashManager,
		private tokenManager: TokenManager
	) {}

	public signup = async (input: SignupInputDTO): Promise<string> => {
		const { nick, email, password } = input;

		const hash = await this.hashManager.hash(password);
		const id = this.idGenerator.generate();

		const userEmailExists = await this.userDatabase.findUserByEmail(email);

		if (userEmailExists) {
			throw new BadRequestError("O 'email' já existe");
		}

		const newUser = new User(
			id,
			nick,
			email,
			hash,
			new Date().toISOString()
		);
		const newUserDB = newUser.toDBModel();
		await this.userDatabase.insertUser(newUserDB);

		const TokenPayload: TokenPayload = {
			id: newUser.getId(),
			nick: newUser.getNick(),
		};
		const token = this.tokenManager.createToken(TokenPayload);

		return token;
	};

	public login = async (input: LoginInputDTO): Promise<string> => {
		const { email, password } = input;
		const userDB = await this.userDatabase.findUserByEmail(email);

		if (!userDB) {
			throw new NotFoundError('Email não encontrado');
		}

		const isPasswordCorrect = await this.hashManager.compare(
			password,
			userDB.password
		);

		if (!isPasswordCorrect) {
			throw new BadRequestError("'Email' ou 'Senha' incorretos");
		}

		const user = new User(
			userDB.id,
			userDB.nick,
			userDB.email,
			userDB.password,
			userDB.created_at
		);

		const TokenPayload: TokenPayload = {
			id: user.getId(),
			nick: user.getNick(),
		};

		const token = this.tokenManager.createToken(TokenPayload);

		return token;
	};

	public getUserId = async (input: GetUserIdInputDTO): Promise<string> => {
		const payload = this.tokenManager.getPayload(input.token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		return payload.id;
	};
}
