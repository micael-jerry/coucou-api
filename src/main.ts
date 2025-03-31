import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function run() {
	const port = process.env.PORT ?? 8080;

	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new PrismaExceptionFilter());

	const documentBuilderConfig = new DocumentBuilder()
		.setTitle('Coucou api')
		.setDescription('Chat app API')
		.setVersion('0.1')
		.addBasicAuth()
		.build();
	const document = SwaggerModule.createDocument(app, documentBuilderConfig, {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
	});
	SwaggerModule.setup('api', app, document, {
		jsonDocumentUrl: 'swagger/json',
	});

	await app.listen(port);
	console.info(`API is running on: ${await app.getUrl()}`);
}

void run();
