import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiTooManyRequestsResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { HttpExceptionResponseDto } from '../dto/http-exception-response.dto';

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
		}),
	);
}
