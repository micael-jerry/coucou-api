import { UserRole } from '@prisma/client';

export class AuthTokenPayload {
	user_id: string;
	user_username: string;
	user_role: UserRole;
}
