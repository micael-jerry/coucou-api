import { ApiProperty } from '@nestjs/swagger';
import { ConversationType } from '../../../../prisma/generated/client';
import { MessageResponse } from '../../message/dto/message-response.dto';
import { UserResponse } from '../../user/dto/user-response.dto';

export class ConversationResponse {
	@ApiProperty()
	id: string;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User created datetime' })
	createdAt: Date;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'User updated datetime' })
	updatedAt: Date;

	@ApiProperty({ description: 'Conversation name' })
	name?: string;

	@ApiProperty({ enum: ConversationType })
	type: ConversationType;

	@ApiProperty({ type: [UserResponse] })
	members: UserResponse[];

	@ApiProperty({ type: [MessageResponse] })
	messages: MessageResponse[];
}
