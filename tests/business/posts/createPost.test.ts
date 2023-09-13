import { PostBusiness } from '../../../src/business/PostBusiness';
import { createPostSchema } from '../../../src/dtos/posts/createPost.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';

describe('Testando createPost', () => {
	const postBusiness = new PostBusiness(
		new IdGeneratorMock(),
		new TokenManagerMock(),
		new PostDatabaseMock()
	);

	test('Deve retornar nulo ao criar um novo post', async () => {
		const input = createPostSchema.parse({
			content: 'Seju não é de nada',
			token: 'token-mock-madara',
		});

		const output = postBusiness.createPost(input);
		expect(output).toBeNull;
	});

	test('Deve retornar erro se o token for inválido', async () => {
		expect.assertions(2);
		try {
			const input = createPostSchema.parse({
				content: 'Preguiça da desgraça',
				token: 'token-mock-shikamaru',
			});

			await postBusiness.createPost(input);
		} catch (error) {
			if (error instanceof BadRequestError) {
				expect(error.statusCode).toBe(400);
				expect(error.message).toBe('Token inválido');
			}
		}
	});
});
