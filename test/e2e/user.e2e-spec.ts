import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { App } from 'supertest/types';
import { LoginResponse } from '../../src/auth/dto/login-response.dto';

describe('UserController (e2e)', () => {
	let app: INestApplication<App>;
	let authToken: string;

	beforeEach(async () => {
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

	it('/users (GET) - should get all users', async () => {
		return request(app.getHttpServer())
			.get('/users')
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200)
			.then((res) => {
				expect(Array.isArray(res.body)).toBe(true);
				expect(res.body.length).toBeGreaterThanOrEqual(2);
			});
	});

	it('/users/:userId (GET) - should get a user by id', async () => {
		const userId = 'c46ffdce-8ee7-470e-8b22-4e83c84481d2';
		return request(app.getHttpServer())
			.get(`/users/${userId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200)
			.then((res) => {
				expect(res.body.id).toBe(userId);
				expect(res.body.username).toBe('testuser1');
			});
	});

	it('/users (GET) - should fail without auth token', async () => {
		await request(app.getHttpServer()).get('/users').expect(401);
	});
});
