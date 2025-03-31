import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function run() {
	const port = process.env.PORT ?? 8080;
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(port);
	console.info(`Server started on port: ${port}`);
}

void run();
