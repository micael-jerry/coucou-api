import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsEnum } from 'class-validator';
import { ConversationType } from '@prisma/client';

export class ConversationInput {
	@ApiProperty({ enum: ConversationType })
	@IsEnum(ConversationType)
	type: ConversationType;

	@ApiProperty({ description: 'Array of user id' })
	@ArrayMinSize(2)
	membersId: string[];
}
