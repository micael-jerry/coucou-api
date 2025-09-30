import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	conversationId: string;

	@ApiProperty()
	senderId: string;

	@ApiProperty()
	content: string;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User created datetime' })
	createdAt: Date;
}
