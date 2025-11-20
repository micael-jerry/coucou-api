import { User } from '@prisma/client';
import { UserResponse } from '../dto/user-response.dto';

export class UserMapper {
	static toDto(entity: User): UserResponse {
		return {
			id: entity.id,
			username: entity.username,
			email: entity.email,
			isVerified: entity.is_verified,
			firstname: entity.firstname,
			lastname: entity.lastname,
			createdAt: entity.created_at,
			role: entity.role,
		};
	}
}
