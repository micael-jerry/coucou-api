import { ApiProperty } from '@nestjs/swagger';
import { ConversationType } from '@prisma/client';

export class ConversationResponse {
	@ApiProperty()
	id: string;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User created datetime' })
	createdAt: Date;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User updated datetime' })
	updatedAt: Date;

	@ApiProperty({ type: 'string', enum: ['PRIVATE', 'GROUP'] })
	type: ConversationType;
}
