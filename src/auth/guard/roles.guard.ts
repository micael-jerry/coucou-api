import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthTokenPayload } from '../payload/auth-token.payload';
import { UserRole } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const httpArgumentsHost: HttpArgumentsHost = context.switchToHttp();
		const req: Request = httpArgumentsHost.getRequest<Request>();

		if (!this.hasPermission(req.user!, this.getRoles(context)))
			throw new UnauthorizedException('You do not have the authorization');
		return true;
	}

	private getRoles(context: ExecutionContext): UserRole[] {
		return this.reflector.get<UserRole[]>(Roles, context.getHandler());
	}

	private hasPermission(payload: AuthTokenPayload, roles: UserRole[]) {
		if (roles.includes(payload.user_role)) return true;
		return false;
	}
}
