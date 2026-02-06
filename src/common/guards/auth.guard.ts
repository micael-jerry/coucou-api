import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthTokenPayload } from '../payloads/auth-token.payload';
import { Reflector } from '@nestjs/core';
import { AuthType } from '../decorators/auth.decorator';
import { AUTH_TYPE_KEY } from '../constants/auth.constant';

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

	canActivate(context: ExecutionContext): boolean {
		const httpArgumentHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentHost.getRequest<Request>();
		const authType: AuthType | undefined = this.getAuthType(context);
		const authHeader: string | undefined = req.headers.authorization;

		if (authType === undefined) {
			throw new ForbiddenException('Access denied');
		} else if (authType === AuthType.PUBLIC || (authType === AuthType.ANONYMOUS && !authHeader)) {
			return true;
		} else if (authType === AuthType.ANONYMOUS && authHeader) {
			throw new UnauthorizedException('Anonymous users cannot use this endpoint');
		} else if (!authHeader) {
			throw new UnauthorizedException('No token provided');
		}

		const token: string = authHeader.split(' ')[1];
		const user: AuthTokenPayload | undefined = this.jwtService.verify<AuthTokenPayload>(token);

		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}

		req.user = user;
		return true;
	}

	private getAuthType(context: ExecutionContext): AuthType | undefined {
		return this.reflector.get<AuthType>(AUTH_TYPE_KEY, context.getHandler());
	}
}
