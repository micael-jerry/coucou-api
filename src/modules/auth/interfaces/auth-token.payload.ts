import { UserRole } from '../../../../prisma/generated/client';

export interface AuthTokenPayload {
	user_id: string;
	user_username: string;
	user_role: UserRole;
}
