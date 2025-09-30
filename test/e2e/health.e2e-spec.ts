import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { Coucou } from '../../src/health/dto/coucou.dto';

describe('HealthController (e2e)', () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/coucou (GET)', async () => {
		const response = (await request(app.getHttpServer()).get('/coucou').expect(200)) as { body: Coucou };

		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toBe('HELLO ❤️❤️❤️');
	});
});
