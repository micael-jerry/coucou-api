import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { LoginResponse } from '../../src/modules/auth/dto/login-response.dto';
import { MessageResponse } from '../../src/modules/message/dto/message-response.dto';

describe('MessageController (e2e)', () => {
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

	it('/messages (POST) - should send a message', async () => {
		return request(app.getHttpServer())
			.post('/messages')
			.set('Authorization', `Bearer ${authToken}`)
			.send({
				content: 'Test message',
				conversationId: '0dbea30e-9354-4bcb-964c-1b65098bcbbb',
			})
			.expect(HttpStatus.CREATED)
			.then((res: { body: MessageResponse }) => {
				expect(res.body).toHaveProperty('id');
				expect(res.body.content).toBe('Test message');
			});
	});

	it('/messages/:messageId (GET) - should get a message by id', async () => {
		const messageId = '81cb0ce7-15ac-4bf9-888e-a9919a714af2';
		return request(app.getHttpServer())
			.get(`/messages/${messageId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(HttpStatus.OK)
			.then((res: { body: MessageResponse }) => {
				expect(res.body.id).toBe(messageId);
			});
	});

	it('/messages (GET) - should get messages by conversation id', async () => {
		const conversationId = '0dbea30e-9354-4bcb-964c-1b65098bcbbb';
		return request(app.getHttpServer())
			.get(`/messages?conversationId=${conversationId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(HttpStatus.OK)
			.then((res: { body: MessageResponse[] }) => {
				expect(Array.isArray(res.body)).toBe(true);
				expect(res.body.length).toBeGreaterThanOrEqual(2);
			});
	});
});
