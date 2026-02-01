import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../../../prisma/generated/enums';
import { Roles } from './roles.decorator';

export enum AuthType {
	PUBLIC,
	ANONYMOUS,
	AUTHENTICATED,
	ROLES,
}

export function Auth(type: AuthType, roles: UserRole[] = []) {
	if (type === AuthType.PUBLIC) {
		return applyDecorators(SetMetadata('isPublic', true), UseGuards(AuthGuard));
	} else if (type === AuthType.ANONYMOUS) {
		return applyDecorators(SetMetadata('isAnonymous', true), UseGuards(AuthGuard));
	} else if (type === AuthType.AUTHENTICATED) {
		return applyDecorators(UseGuards(AuthGuard));
	}
	return applyDecorators(Roles(roles), UseGuards(AuthGuard, RolesGuard));
}
