import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthTokenPayload } from '../payload/auth-token.payload';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AuthUtils } from '../auth.utils';

declare module 'express' {
	export interface Request {
		user?: AuthTokenPayload;
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger: Logger = new Logger(AuthGuard.name);

	constructor(private readonly authUtils: AuthUtils) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const httpArgumentHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentHost.getRequest<Request>();

		try {
			const authHeader = req.headers.authorization;
			const token: string = authHeader!.split(' ')[1];
			req.user = this.authUtils.getPayloadFromToken(token);

			return true;
		} catch (error) {
			this.logger.error(error);
			throw new UnauthorizedException(`Invalid token`);
		}
	}
}
