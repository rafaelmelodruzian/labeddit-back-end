import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabaseMock } from '../../mocks/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';
import { HashManagerMock } from '../../mocks/HashManagerMock';
import { signupSchema } from '../../../src/dtos/users/signup.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('Testando signup', () => {
	const userBusiness = new UserBusiness(
		new UserDatabaseMock(),
		new IdGeneratorMock(),
		new HashManagerMock(),
		new TokenManagerMock()
	);

	test('Deve retornar um token ao cadastrar', async () => {
		const input = signupSchema.parse({
			nick: 'Naruto',
			email: 'thebestkageofkonoha@gmail.com',
			password: 'iloveramen',
		});

		const output = await userBusiness.signup(input);

		expect(output).toEqual('token-mock');
	});

	test('Deve gerar um erro se o e-mail já existir', async () => {
		expect.assertions(2);

		try {
			const input = signupSchema.parse({
				nick: 'Hashirama',
				email: 'hashirama@email.com',
				password: 'godofshinobi',
			});

			await userBusiness.signup(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe("O 'email' já existe");
			}
		}
	});
});
