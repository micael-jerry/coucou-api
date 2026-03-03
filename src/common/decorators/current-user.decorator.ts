import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthTokenPayload } from '../payloads/auth-token.payload';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthTokenPayload => {
	const request = ctx.switchToHttp().getRequest<Request>();
	return request.user!;
});
