import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionResponseDto } from '../dto/http-exception-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception.getStatus();
		const exceptionResponse: HttpExceptionResponseDto = {
			status: status,
			type: exception.name,
			message: exception.message,
			typestamp: new Date(),
			path: request.url,
		};

		response.status(status).json(exceptionResponse);
	}
}
