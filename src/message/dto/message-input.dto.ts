import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, MinLength } from 'class-validator';

export class MessageInput {
	@ApiProperty()
	@IsUUID('4', { message: 'Invalid conversationId' })
	conversationId: string;

	@ApiProperty()
	@MinLength(1, { message: 'Content must have at least 1 character' })
	content: string;
}
