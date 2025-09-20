import { ApiProperty } from '@nestjs/swagger';

export class MessageInput {
	@ApiProperty()
	senderId: string;

	@ApiProperty()
	conversationId: string;

	@ApiProperty()
	content: string;
}
