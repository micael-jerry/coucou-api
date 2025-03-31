import { User } from '@prisma/client';
import { UserResponse } from '../dto/user-response.dto';

export class UserMapper {
	static toDto(entity: User): UserResponse {
		return {
			id: entity.id,
			username: entity.username,
			email: entity.email,
			firstname: entity.firstname,
			lastname: entity.lastname,
		};
	}
}
