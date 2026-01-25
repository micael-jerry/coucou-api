import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthTokenPayload } from '../payloads/auth-token.payload';

declare module 'express' {
	export interface Request {
		user?: AuthTokenPayload;
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger: Logger = new Logger(AuthGuard.name);

	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const httpArgumentHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentHost.getRequest<Request>();

		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) {
				throw new UnauthorizedException('No token provided');
			}
			const token: string = authHeader.split(' ')[1];
			req.user = this.jwtService.verify<AuthTokenPayload>(token);

			return true;
		} catch (error) {
			this.logger.error(error);
			throw new UnauthorizedException(`Invalid token`);
		}
	}
}
