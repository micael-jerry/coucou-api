import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	firstname: string;

	@ApiProperty()
	lastname: string;
}
