import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationService {
	constructor(private readonly prismaService: PrismaService) {}

	createConversation(conversationInput: ConversationInput): Promise<Conversation> {
		return this.prismaService.conversation.create({
			data: {
				type: conversationInput.type,
				members: {
					createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
				},
			},
		});
	}
}
