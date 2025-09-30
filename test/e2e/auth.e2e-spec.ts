import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { App } from 'supertest/types';
import { LoginResponse } from '../../src/auth/dto/login-response.dto';
import { UserResponse } from '../../src/user/dto/user-response.dto';

describe('AuthController (e2e)', () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/sign-in (POST) - valid credentials', async () => {
		const response = (await request(app.getHttpServer())
			.post('/auth/sign-in')
			.send({
				username: 'testuser1',
				password: 'test1@example.com',
			})
			.expect(200)) as { body: LoginResponse };

		expect(response.body).toHaveProperty('access_token');
		expect(typeof response.body.access_token).toBe('string');
	});

	it('/auth/sign-in (POST) - invalid credentials', async () => {
		await request(app.getHttpServer())
			.post('/auth/sign-in')
			.send({
				username: 'testuser1',
				password: 'wrongpassword',
			})
			.expect(401);
	});

	it('/auth/sign-up (POST)', async () => {
		const response = (await request(app.getHttpServer())
			.post('/auth/sign-up')
			.send({
				username: 'newuser',
				email: 'newuser@example.com',
				password: 'newpassword',
				firstname: 'New',
				lastname: 'User',
			})
			.expect(201)) as { body: UserResponse };

		expect(response.body).toHaveProperty('id');
		expect(response.body.username).toBe('newuser');
		expect(response.body.email).toBe('newuser@example.com');
	});
});
