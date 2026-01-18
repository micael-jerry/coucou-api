import { UserRole } from '../../../prisma/generated/client';

export class AuthTokenPayload {
	user_id: string;
	user_username: string;
	user_role: UserRole;
}
