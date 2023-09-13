import { PostBusiness } from '../../../src/business/PostBusiness';
import { deletePostSchema } from '../../../src/dtos/posts/deletePost.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';

describe('Testando checkLike', () => {
	const postBusiness = new PostBusiness(
		new IdGeneratorMock(),
		new TokenManagerMock(),
		new PostDatabaseMock()
	);

	test('Deve retornar status None', async () => {
		const input = deletePostSchema.parse({
			id: 'id-mock-postDois',
			token: 'token-mock-hashirama',
		});

		const output = await postBusiness.checkLike(input);
		expect(output).toBe('none');
	});

	test('Deve retornar status Like', async () => {
		const input = deletePostSchema.parse({
			id: 'id-mock-postUm',
			token: 'token-mock-hashirama',
		});

		const output = await postBusiness.checkLike(input);
		expect(output).toBe('like');
	});

	test('Deve retornar status Dislike', async () => {
		const input = deletePostSchema.parse({
			id: 'id-mock-postUm',
			token: 'token-mock-madara',
		});

		const output = await postBusiness.checkLike(input);
		expect(output).toBe('dislike');
	});

	test('Deve retornar erro se o token for inválido', async () => {
		expect.assertions(2);
		try {
			const input = deletePostSchema.parse({
				id: 'id-mock-postDois',
				token: 'token-mock-tobirama',
			});

			await postBusiness.checkLike(input);
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
			const input = deletePostSchema.parse({
				id: 'id-mock-postTrês',
				token: 'token-mock-madara',
			});

			await postBusiness.checkLike(input);
		} catch (error) {
			if (error instanceof NotFoundError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Post não encontrado');
			}
		}
	});
});
