import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
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

		if (!req.user || !this.hasPermission(req.user, this.getRequiredRoles(context)))
			throw new ForbiddenException('You do not have the required permissions to access this resource.');

		return true;
	}

	private getRequiredRoles(context: ExecutionContext): UserRole[] | undefined {
		return this.reflector.get<UserRole[]>(Roles, context.getHandler());
	}

	private hasPermission(payload: AuthTokenPayload, requiredRoles: UserRole[] | undefined) {
		if (!requiredRoles) return true;
		return requiredRoles.includes(payload.user_role);
	}
}
