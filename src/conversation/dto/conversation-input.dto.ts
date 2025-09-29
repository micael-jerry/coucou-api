import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsEnum, IsUUID } from 'class-validator';
import { ConversationType } from '@prisma/client';

export class ConversationInput {
	@ApiProperty({ enum: ConversationType })
	@IsEnum(ConversationType)
	type: ConversationType;

	@ApiProperty({ description: 'Array of user id' })
	@ArrayMinSize(2)
	@IsUUID('4', { each: true, message: 'Invalid members id' })
	membersId: string[];
}
