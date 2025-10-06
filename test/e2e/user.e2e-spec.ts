import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { LoginResponse } from '../../src/auth/dto/login-response.dto';
import { UpdateUserDto } from '../../src/user/dto/update-user.dto';
import { UserResponse } from '../../src/user/dto/user-response.dto';

describe('UserController (e2e)', () => {
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

	it('/users (GET) - should get all users', async () => {
		return request(app.getHttpServer())
			.get('/users')
			.set('Authorization', `Bearer ${authToken}`)
			.expect(200)
			.then((res: { body: UserResponse[] }) => {
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
			.then((res: { body: UserResponse }) => {
				expect(res.body.id).toBe(userId);
				expect(res.body.username).toBe('testuser1');
			});
	});

	it('/users/update (PUT) - should update the connected user', async () => {
		const updateUserDto: UpdateUserDto = {
			firstname: 'Test',
			lastname: 'User 1 Updated',
			email: 'testuser1@example.com',
			password: 'test1@example.com',
			username: 'testuser1',
		};
		return request(app.getHttpServer())
			.put('/users/me')
			.set('Authorization', `Bearer ${authToken}`)
			.send(updateUserDto)
			.expect(200)
			.then((res: { body: UserResponse }) => {
				expect(res.body.firstname).toBe(updateUserDto.firstname);
				expect(res.body.lastname).toBe(updateUserDto.lastname);
			});
	});

	it('/users (GET) - should fail without auth token', async () => {
		await request(app.getHttpServer()).get('/users').expect(401);
	});

	it('/users/update (PUT) - should fail without auth token', async () => {
		await request(app.getHttpServer()).put('/users/me').send({}).expect(401);
	});
});
