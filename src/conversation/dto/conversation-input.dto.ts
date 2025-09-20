import { ApiProperty } from '@nestjs/swagger';
import { ConversationType } from '@prisma/client';

export class ConversationInput {
	@ApiProperty({ enum: ConversationType })
	type: ConversationType;

	@ApiProperty({ description: 'Array of user id' })
	membersId: string[];
}
