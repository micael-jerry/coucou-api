import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsEnum,
	IsNotEmpty,
	IsUUID,
	MaxLength,
	MinLength,
	ValidateIf,
} from 'class-validator';
import { ConversationType } from '../../../../prisma/generated/client';

export class ConversationInput {
	@ApiProperty({ enum: ConversationType })
	@IsEnum(ConversationType)
	type: ConversationType;

	@ApiProperty({ description: 'Conversation name' })
	@IsNotEmpty({ message: 'Conversation name is required for group conversations' })
	@MinLength(1, { message: 'Conversation name must be between 1 and 50 characters' })
	@MaxLength(50, { message: 'Conversation name must be between 1 and 50 characters' })
	@ValidateIf((o: ConversationInput) => o.type === ConversationType.GROUP || o.name !== undefined)
	name?: string;

	@ApiProperty({ description: 'Array of user id' })
	@ArrayMinSize(2)
	@ValidateIf((o: ConversationInput) => o.type === ConversationType.PRIVATE)
	@ArrayMaxSize(2, { message: 'A private conversation can only have 2 members' })
	@IsUUID('4', { each: true, message: 'Invalid members id' })
	membersId: string[];
}
