import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	@ApiProperty({ type: 'boolean', description: 'Email verification status' })
	isVerified: boolean;

	@ApiProperty()
	firstname: string;

	@ApiProperty()
	lastname: string;

	@ApiProperty({ enum: UserRole, description: 'User role' })
	role: UserRole;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User created datetime' })
	createdAt: Date;
}
