import { PostBusiness } from '../../../src/business/PostBusiness';
import { getPostsSchema } from '../../../src/dtos/posts/getPosts.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';

describe('Testando getPosts', () => {
	const postBusiness = new PostBusiness(
		new IdGeneratorMock(),
		new TokenManagerMock(),
		new PostDatabaseMock()
	);

	test('Deve retornar uma lista com todos os posts', async () => {
		const input = getPostsSchema.parse({
			token: 'token-mock-hashirama',
		});

		const output = await postBusiness.getPosts(input);

		expect(output).toHaveLength(2);
		expect(output).toEqual([
			{
				id: 'id-mock-postUm',
				content: 'Senju são o melhor clã',
				likes: 0,
				dislikes: 2,
				createdAt: expect.any(String),
				creator: {
					id: 'id-mock-hashirama',
					nick: 'Hashirama',
				},
				comments: 2,
			},
			{
				id: 'id-mock-postDois',
				content: 'Uchiga são o melhor clã',
				likes: 2,
				dislikes: 0,
				createdAt: expect.any(String),
				creator: {
					id: 'id-mock-madara',
					nick: 'Madara',
				},
				comments: 1,
			},
		]);
	});

    test('Deve retornar erro se o token for inválido', async () => {
        expect.assertions(2)
        try {
            const input = getPostsSchema.parse({
                token: 'token-mock-obito',
            });
    
            await postBusiness.getPosts(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe('Token inválido')
            }
        }
    })
});
