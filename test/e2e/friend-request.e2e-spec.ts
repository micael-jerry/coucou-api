import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { FriendRequestStatus } from '../../prisma/generated/client';
import { AppModule } from '../../src/app.module';
import { LoginResponse } from '../../src/modules/auth/dto/login-response.dto';
import { FriendRequestResponse } from '../../src/modules/friend-request/dto/friend-request-response.dto';

describe('FriendRequestController (e2e)', () => {
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

	afterAll(async () => {
		await app.close();
	});

	it('/friend-requests (GET) - should get all friend requests', async () => {
		return request(app.getHttpServer())
			.get('/friend-requests')
			.set('Authorization', `Bearer ${authToken}`)
			.expect(HttpStatus.OK)
			.then((res: { body: FriendRequestResponse[] }) => {
				expect(Array.isArray(res.body)).toBe(true);
				expect(res.body.length).toBeGreaterThanOrEqual(1);
				const request = res.body.find((r) => r.receiver.username === 'testuser1');
				expect(request).toBeDefined();
				expect(request!.status).toBe(FriendRequestStatus.PENDING);
			});
	});

	it('/friend-requests (POST) - should send a friend request', async () => {
		const receiverId = '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d'; // testuser3
		return request(app.getHttpServer())
			.post('/friend-requests')
			.set('Authorization', `Bearer ${authToken}`)
			.send([{ receiverId }])
			.expect(HttpStatus.CREATED)
			.then((res: { body: FriendRequestResponse[] }) => {
				expect(res.body.length).toBe(1);
				expect(res.body[0].receiver.id).toBe(receiverId);
				expect(res.body[0].status).toBe(FriendRequestStatus.PENDING);
			});
	});

	it('/friend-requests (PUT) - should update a friend request status', async () => {
		const receiverId = '1f2e3d4c-5b6a-7890-1234-567890abcdef'; // testuser4
		return request(app.getHttpServer())
			.put('/friend-requests')
			.set('Authorization', `Bearer ${authToken}`)
			.send([{ receiverId, status: FriendRequestStatus.ACCEPTED }])
			.expect(HttpStatus.OK)
			.then((res: { body: FriendRequestResponse[] }) => {
				expect(res.body.length).toBe(1);
				expect(res.body[0].status).toBe(FriendRequestStatus.ACCEPTED);
			});
	});

	it('/friend-requests (GET) - should fail without auth token', async () => {
		await request(app.getHttpServer()).get('/friend-requests').expect(HttpStatus.UNAUTHORIZED);
	});
});
