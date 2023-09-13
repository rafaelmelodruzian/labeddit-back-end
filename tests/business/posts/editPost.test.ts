import { PostBusiness } from '../../../src/business/PostBusiness';
import { editPostSchema } from '../../../src/dtos/posts/editPost.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';

describe('Testando editPost', () => {
	const postBusiness = new PostBusiness(
		new IdGeneratorMock(),
		new TokenManagerMock(),
		new PostDatabaseMock()
	);

	test('Deve retornar nulo ao editar um post', async () => {
		const input = editPostSchema.parse({
			id: 'id-mock-postUm',
			token: 'token-mock-hashirama',
			content: 'Clã seju é superior',
		});

		const output = await postBusiness.editPost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar erro se o token for inválido', async () => {
		expect.assertions(2);
		try {
			const input = editPostSchema.parse({
				id: 'id-mock-postDois',
				content: 'Uchiha bom é uchiha cego',
				token: 'token-mock-tobirama',
			});

			await postBusiness.editPost(input);
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
			const input = editPostSchema.parse({
				id: 'id-mock-postTrês',
				content: 'Sharingan é melhor que byakugan',
				token: 'token-mock-madara',
			});

			await postBusiness.editPost(input);
		} catch (error) {
			if (error instanceof NotFoundError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Post não encontrado');
			}
		}
	});

	test('Deve retornar erro se outra pessoa além do criador tentar editar', async () => {
		expect.assertions(2);
		try {
			const input = editPostSchema.parse({
				id: 'id-mock-postUm',
				content: 'Hashirama do clã da madeira',
				token: 'token-mock-madara',
			});

			await postBusiness.editPost(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe(
					'Somente quem criou o post pode editá-lo'
				);
			}
		}
	});
});
