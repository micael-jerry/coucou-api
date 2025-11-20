import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function documentBuilderConfig(app: INestApplication) {
	const documentBuilderConfig = new DocumentBuilder()
		.setTitle('Coucou api')
		.setDescription('Chat app API')
		.setVersion('0.1')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, documentBuilderConfig, {
		operationIdFactory: (_: string, methodKey: string) => methodKey,
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
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
	app.useGlobalFilters(new PrismaExceptionFilter());
	app.useGlobalFilters(new HttpExceptionFilter());

	documentBuilderConfig(app);

	await app.listen(port);
	console.info(`API is running on: ${await app.getUrl()}`);
}

void run();
