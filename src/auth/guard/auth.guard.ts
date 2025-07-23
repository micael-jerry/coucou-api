import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthTokenPayload } from '../payload/auth-token.payload';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

declare module 'express' {
	export interface Request {
		user?: AuthTokenPayload;
	}
}

export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const httpArgumentHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentHost.getRequest<Request>();

		try {
			const authHeader = req.headers.authorization;
			const token: string = authHeader!.split(' ')[1];
			req.user = this.jwtService.verify<AuthTokenPayload>(token);

			return true;
		} catch (error) {
			console.error(error);
			throw new UnauthorizedException(`Invalid token`);
		}
	}
}
