import { ApiProperty } from '@nestjs/swagger';

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

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User created datetime' })
	createdAt: Date;
}
