import { PostBusiness } from '../../../src/business/PostBusiness';
import { likePostChema } from '../../../src/dtos/posts/likePost.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';

describe('Testando likePost', () => {
	const postBusiness = new PostBusiness(
		new IdGeneratorMock(),
		new TokenManagerMock(),
		new PostDatabaseMock()
	);

	test('Deve retornar nulo ao dar like', async () => {
		const input = likePostChema.parse({
			id: 'id-mock-postDois',
			token: 'token-mock-hashirama',
			like: true,
		});

		const output = await postBusiness.likePost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar nulo ao dar dislike', async () => {
		const input = likePostChema.parse({
			id: 'id-mock-postDois',
			token: 'token-mock-hashirama',
			like: false,
		});

		const output = await postBusiness.likePost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar nulo ao excluir like', async () => {
		const input = likePostChema.parse({
			id: 'id-mock-postUm',
			token: 'token-mock-hashirama',
			like: true,
		});

		const output = await postBusiness.likePost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar nulo ao alterar like para dislike', async () => {
		const input = likePostChema.parse({
			id: 'id-mock-postUm',
			token: 'token-mock-hashirama',
			like: false,
		});

		const output = await postBusiness.likePost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar erro se o token for inválido', async () => {
		expect.assertions(2);
		try {
			const input = likePostChema.parse({
				id: 'id-mock-postDois',
				token: 'token-mock-tobirama',
				like: true,
			});

			await postBusiness.likePost(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe('Token inválido');
			}
		}
	});

	test('Deve retornar erro se o post não existir', async () => {
		expect.assertions(2);
		try {
			const input = likePostChema.parse({
				id: 'id-mock-postTrês',
				token: 'token-mock-madara',
				like: true,
			});

			await postBusiness.likePost(input);
		} catch (error) {
			if (error instanceof NotFoundError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Post não encontrado');
			}
		}
	});
});
