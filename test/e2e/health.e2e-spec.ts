import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { Coucou } from '../../src/modules/health/dto/coucou.dto';

describe('HealthController (e2e)', () => {
	let app: INestApplication<App>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it('/coucou (GET)', async () => {
		const response = (await request(app.getHttpServer()).get('/coucou').expect(HttpStatus.OK)) as { body: Coucou };

		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toBe('HELLO ❤️❤️❤️');
	});
});
