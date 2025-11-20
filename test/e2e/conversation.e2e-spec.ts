import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConversationType } from '@prisma/client';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { LoginResponse } from '../../src/modules/auth/dto/login-response.dto';
import { ConversationResponse } from '../../src/modules/conversation/dto/conversation-response.dto';

describe('ConversationController (e2e)', () => {
	let app: INestApplication<App>;
	let authToken: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const response = (await request(app.getHttpServer()).post('/auth/sign-in').send({
			username: 'testuser1',
			password: 'test1@example.com',
		})) as { body: LoginResponse };

		authToken = response.body.access_token;
	});

	afterEach(async () => {
		await app.close();
	});

	it('/conversations (POST) - should create a new conversation', async () => {
		return request(app.getHttpServer())
			.post('/conversations')
			.set('Authorization', `Bearer ${authToken}`)
			.send({
				type: ConversationType.PRIVATE,
				membersId: ['c46ffdce-8ee7-470e-8b22-4e83c84481d2', '3e9bc404-7958-4bd4-942e-54ea2dbe6592'],
			})
			.expect(HttpStatus.CREATED)
			.then((res: { body: ConversationResponse }) => {
				expect(res.body).toHaveProperty('id');
				expect(res.body.type).toBe(ConversationType.PRIVATE);
			});
	});

	it('/conversations/:conversationId (GET) - should get a conversation by id', async () => {
		const conversationId = '0dbea30e-9354-4bcb-964c-1b65098bcbbb';
		return request(app.getHttpServer())
			.get(`/conversations/${conversationId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(HttpStatus.OK)
			.then((res: { body: ConversationResponse }) => {
				expect(res.body.id).toBe(conversationId);
			});
	});

	it('/conversations (GET) - should get conversations by user id', async () => {
		return request(app.getHttpServer())
			.get(`/conversations`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(HttpStatus.OK)
			.then((res: { body: ConversationResponse[] }) => {
				expect(Array.isArray(res.body)).toBe(true);
				expect(res.body.length).toBeGreaterThanOrEqual(1);
			});
	});
});
