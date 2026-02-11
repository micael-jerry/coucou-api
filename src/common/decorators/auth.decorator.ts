import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../../../prisma/generated/enums';
import { Roles } from './roles.decorator';
import { AUTH_TYPE_KEY } from '../constants/auth.constant';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

export enum AuthType {
	PUBLIC = 99,
	ANONYMOUS = 100,
	AUTHENTICATED = 101,
	ROLES = 102,
	GOOGLE = 103,
}

export function Auth(type: AuthType, roles: UserRole[] = []) {
	if (type === AuthType.PUBLIC) {
		return applyDecorators(SetMetadata(AUTH_TYPE_KEY, AuthType.PUBLIC), UseGuards(AuthGuard));
	} else if (type === AuthType.ANONYMOUS) {
		return applyDecorators(SetMetadata(AUTH_TYPE_KEY, AuthType.ANONYMOUS), UseGuards(AuthGuard));
	} else if (type === AuthType.AUTHENTICATED) {
		return applyDecorators(SetMetadata(AUTH_TYPE_KEY, AuthType.AUTHENTICATED), UseGuards(AuthGuard));
	} else if (type === AuthType.GOOGLE) {
		return applyDecorators(SetMetadata(AUTH_TYPE_KEY, AuthType.GOOGLE), UseGuards(AuthGuard, GoogleAuthGuard));
	}
	return applyDecorators(SetMetadata(AUTH_TYPE_KEY, AuthType.ROLES), Roles(roles), UseGuards(AuthGuard, RolesGuard));
}
