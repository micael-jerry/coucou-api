import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsUUID, ValidateIf } from 'class-validator';
import { ConversationType } from '../../../../prisma/generated/client';

export class ConversationInput {
	@ApiProperty({ enum: ConversationType })
	@IsEnum(ConversationType)
	type: ConversationType;

	@ApiProperty({ description: 'Array of user id' })
	@ArrayMinSize(2)
	@ValidateIf((o: ConversationInput) => o.type === ConversationType.PRIVATE)
	@ArrayMaxSize(2, { message: 'A private conversation can only have 2 members' })
	@IsUUID('4', { each: true, message: 'Invalid members id' })
	membersId: string[];
}
