import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { Conversation, ConversationType } from '@prisma/client';

@Injectable()
export class ConversationService {
	constructor(private readonly prismaService: PrismaService) {}

	createConversation(conversationInput: ConversationInput): Promise<Conversation> {
		console.log(conversationInput);

		return this.prismaService.conversation.create({
			data: {
				type: this.getType(conversationInput.type),
				members: {
					createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
				},
			},
		});
	}

	getConversationById(conversationId: string): Promise<Conversation> {
		return this.prismaService.conversation.findUniqueOrThrow({
			where: { id: conversationId },
		});
	}

	getConversationsByUserId(userId: string): Promise<Conversation[]> {
		return this.prismaService.conversation.findMany({
			where: { members: { some: { user_id: userId } } },
			orderBy: { updated_at: 'desc' },
		});
	}

	private getType(type: string): ConversationType {
		return type === 'PRIVATE' ? ConversationType.PRIVATE : ConversationType.GROUP;
	}
}
