import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

function documentBuilderConfig(app: INestApplication): void {
	const documentBuilderConfig = new DocumentBuilder()
		.setTitle('Coucou api')
		.setDescription('Chat app API')
		.setVersion('0.1')
		.addBearerAuth()
		.build();
	const document: OpenAPIObject = SwaggerModule.createDocument(app, documentBuilderConfig, {
		operationIdFactory: (_: string, methodKey: string): string => methodKey,
	});
	SwaggerModule.setup('api', app, document, {
		jsonDocumentUrl: 'swagger/json',
	});
}

async function run() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.getOrThrow<number>('app.port');

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
