import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestResponse {
	@ApiProperty()
	message: string;

	@ApiProperty()
	timestamp: number;
}
