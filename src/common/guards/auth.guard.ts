import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthTokenPayload } from '../payloads/auth-token.payload';
import { Reflector } from '@nestjs/core';

declare module 'express' {
	export interface Request {
		user?: AuthTokenPayload;
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger: Logger = new Logger(AuthGuard.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpArgumentHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentHost.getRequest<Request>();

		if (this.isPublic(context)) {
			return true;
		}

		const authHeader: string | undefined = req.headers.authorization;

		if (this.isAnonymous(context) && authHeader) {
			throw new UnauthorizedException('Anonymous users cannot use this endpoint');
		}

		if (!authHeader) {
			throw new UnauthorizedException('No token provided');
		}

		const token: string = authHeader.split(' ')[1];
		await this.jwtService
			.verifyAsync<AuthTokenPayload>(token)
			.then((u: AuthTokenPayload): void => {
				req.user = u;
			})
			.catch((err) => {
				this.logger.error(err);
				throw new UnauthorizedException(`Invalid token`);
			});

		return true;
	}

	private isPublic(context: ExecutionContext): boolean {
		return !!this.reflector.get<string>('isPublic', context.getHandler());
	}

	private isAnonymous(context: ExecutionContext): boolean {
		return !!this.reflector.get<string>('isAnonymous', context.getHandler());
	}
}
