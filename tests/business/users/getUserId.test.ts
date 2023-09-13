import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabaseMock } from '../../mocks/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';
import { HashManagerMock } from '../../mocks/HashManagerMock';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { getUserIdSchema } from '../../../src/dtos/users/getUserId.dto';

describe('Testando getUserId', () => {
	const userBusiness = new UserBusiness(
		new UserDatabaseMock(),
		new IdGeneratorMock(),
		new HashManagerMock(),
		new TokenManagerMock()
	);

	test('Deve retornar o id do usuário', async () => {
		const input = getUserIdSchema.parse({
			token: 'token-mock-hashirama',
		});

		const output = await userBusiness.getUserId(input);

		expect(output).toEqual('id-mock-hashirama');
	});

	test('Deve retornar erro se o email não for encontrado', async () => {
		expect.assertions(2);

		try {
			const input = getUserIdSchema.parse({
				token: 'token-mock-lee',
			});

			await userBusiness.getUserId(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe('Token inválido');
			}
		}
	});
});
