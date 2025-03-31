import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

async function run() {
	const port = process.env.PORT ?? 8080;
	const app = await NestFactory.create(AppModule);
	await app.listen(port);
	console.info(`Server started on port: ${port}`);
}

void run();
