import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../../user/dto/user-response.dto';

export class LoginResponse {
	@ApiProperty({ description: 'JWT token' })
	access_token: string;
	@ApiProperty({ description: 'User details' })
	user: UserResponse;
}
