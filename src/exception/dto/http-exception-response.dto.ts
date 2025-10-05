import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionResponseDto {
	@ApiProperty({ description: 'HTTP status code' })
	status: number;

	@ApiProperty({ description: 'Error type' })
	type: string;

	@ApiProperty({ description: 'Error message' })
	message: string;

	@ApiProperty({ description: 'Timestamp of the error' })
	timestamp: Date;

	@ApiProperty({ description: 'Request path that caused the error' })
	path: string;
}
