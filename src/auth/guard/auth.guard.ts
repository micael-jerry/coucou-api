import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthTokenPayload } from '../payload/auth-token.payload';

export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const ctx = context.switchToHttp();
		const req: Request = ctx.getRequest<Request>();
		const res = ctx.getResponse();

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
