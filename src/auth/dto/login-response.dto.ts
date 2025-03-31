import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
	@ApiProperty({ description: 'JWT token' })
	access_token: string;
}
