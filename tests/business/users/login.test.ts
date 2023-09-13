import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabaseMock } from '../../mocks/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';
import { HashManagerMock } from '../../mocks/HashManagerMock';
import { loginSchema } from '../../../src/dtos/users/login.dto';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('Testando login', () => {
	const userBusiness = new UserBusiness(
		new UserDatabaseMock(),
		new IdGeneratorMock(),
		new HashManagerMock(),
		new TokenManagerMock()
	);

	test('Deve retornar um token ao realizar login', async () => {
		const input = loginSchema.parse({
			email: 'hashirama@email.com',
			password: 'godofshinobi',
		});

		const output = await userBusiness.login(input);

		expect(output).toEqual('token-mock-hashirama');
	});

	test('Deve retornar erro se o email não for encontrado', async () => {
		expect.assertions(2);

		try {
			const input = loginSchema.parse({
				email: 'sasuke@email.com',
				password: 'godofshinobi',
			});

			await userBusiness.login(input);
		} catch (error) {
			if (error instanceof NotFoundError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Email não encontrado');
			}
		}
	});

	test('Deve retornar erro se a senha for incorreta', async () => {
		expect.assertions(2);

		try {
			const input = loginSchema.parse({
				email: 'hashirama@email.com',
				password: 'gennin',
			});

			await userBusiness.login(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe("'Email' ou 'Senha' incorretos");
			}
		}
	});
});
