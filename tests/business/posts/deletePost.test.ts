import { PostBusiness } from '../../../src/business/PostBusiness';
import { deletePostSchema } from '../../../src/dtos/posts/deletePost.dto';
import { editPostSchema } from '../../../src/dtos/posts/editPost.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';

describe('Testando deletePost', () => {
	const postBusiness = new PostBusiness(
		new IdGeneratorMock(),
		new TokenManagerMock(),
		new PostDatabaseMock()
	);

	test('Deve retornar nulo ao deletar um post', async () => {
		const input = deletePostSchema.parse({
			id: 'id-mock-postUm',
			token: 'token-mock-hashirama',
		});

		const output = await postBusiness.deletePost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar erro se o token for inválido', async () => {
		expect.assertions(2);
		try {
			const input = deletePostSchema.parse({
				id: 'id-mock-postDois',
				token: 'token-mock-tobirama',
			});

			await postBusiness.deletePost(input);
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

			await postBusiness.deletePost(input);
		} catch (error) {
			if (error instanceof NotFoundError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Post não encontrado');
			}
		}
	});

	test('Deve retornar erro se outra pessoa além do criador tentar deletá-lo', async () => {
		expect.assertions(2);
		try {
			const input = deletePostSchema.parse({
				id: 'id-mock-postUm',
				token: 'token-mock-madara',
			});

			await postBusiness.deletePost(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe(
					'Só quem criou o post pode deletá-lo'
				);
			}
		}
	});
});
