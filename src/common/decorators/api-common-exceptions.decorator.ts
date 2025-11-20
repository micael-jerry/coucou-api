import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiTooManyRequestsResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { HttpExceptionResponseDto } from '../dtos/http-exception-response.dto';

export function ApiCommonExceptionsDecorator() {
	return applyDecorators(
		ApiBadRequestResponse({
			type: HttpExceptionResponseDto,
			example: {
				status: HttpStatus.BAD_REQUEST,
				type: 'BadRequestException',
				message: 'Invalid request parameters',
				timestamp: new Date(),
				path: '/example',
			},
			description: 'Bad Request - The request could not be understood or was missing required parameters.',
		}),
		ApiForbiddenResponse({
			type: HttpExceptionResponseDto,
			example: {
				status: HttpStatus.FORBIDDEN,
				type: 'ForbiddenException',
				message: 'Access to this resource is forbidden',
				timestamp: new Date(),
				path: '/example',
			},
			description: 'Forbidden - The server understood the request, but refuses to authorize it.',
		}),
		ApiNotFoundResponse({
			type: HttpExceptionResponseDto,
			example: {
				status: HttpStatus.NOT_FOUND,
				type: 'NotFoundException',
				message: 'Resource not found',
				timestamp: new Date(),
				path: '/example',
			},
			description: 'Not Found - The requested resource could not be found on the server.',
		}),
		ApiTooManyRequestsResponse({
			type: HttpExceptionResponseDto,
			example: {
				status: HttpStatus.TOO_MANY_REQUESTS,
				type: 'TooManyRequestsException',
				message: 'Too many requests, please try again later',
				timestamp: new Date(),
				path: '/example',
			},
			description: 'Too Many Requests - The user has sent too many requests in a given amount of time.',
		}),
		ApiInternalServerErrorResponse({
			type: HttpExceptionResponseDto,
			example: {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				type: 'InternalServerErrorException',
				message: 'An unexpected error occurred',
				timestamp: new Date(),
				path: '/example',
			},
			description: 'Internal Server Error - An unexpected condition was encountered by the server.',
		}),
	);
}
