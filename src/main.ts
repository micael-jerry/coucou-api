import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma/filter/prisma-exception.filter';
import { HttpExceptionFilter } from './exception/filter/http-exception.filter';

function documentBuilderConfig(app: INestApplication) {
	const documentBuilderConfig = new DocumentBuilder()
		.setTitle('Coucou api')
		.setDescription('Chat app API')
		.setVersion('0.1')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, documentBuilderConfig, {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
	});
	SwaggerModule.setup('api', app, document, {
		jsonDocumentUrl: 'swagger/json',
	});
}

async function run() {
	const port = process.env.PORT ?? 8080;

	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: '*',
	});
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new PrismaExceptionFilter());
	app.useGlobalFilters(new HttpExceptionFilter());

	documentBuilderConfig(app);

	await app.listen(port);
	console.info(`API is running on: ${await app.getUrl()}`);
}

void run();
