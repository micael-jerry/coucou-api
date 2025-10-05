import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponse {
	@ApiProperty()
	email: string;

	@ApiProperty()
	message: string;

	@ApiProperty()
	timestamp: number;
}
