import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthTokenPayload } from '../payload/auth-token.payload';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const httpArgumentHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentHost.getRequest<Request>();
		const res = httpArgumentHost.getResponse();

		try {
			const authHeader = req.headers.authorization;
			const token: string = authHeader!.split(' ')[1];
			const payload: AuthTokenPayload = this.jwtService.verify<AuthTokenPayload>(token);
			res.user = payload;
			return true;
		} catch (err) {
			throw new UnauthorizedException(`Invalid token`);
		}
	}
}
