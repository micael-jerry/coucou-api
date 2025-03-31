import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
	@ApiProperty({ description: 'JWT token' })
	access_token: string;
}
