import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationType } from '@prisma/client';
import { ConversationEntity } from './entity/conversation.entity';

@Injectable()
export class ConversationService {
	constructor(private readonly prismaService: PrismaService) {}

	async createConversation(conversationInput: ConversationInput): Promise<ConversationEntity> {
		console.log(conversationInput);

		return this.prismaService.conversation.create({
			data: {
				type: this.getType(conversationInput.type),
				members: {
					createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
				},
			},
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}

	async getConversationById(conversationId: string): Promise<ConversationEntity> {
		return this.prismaService.conversation.findUniqueOrThrow({
			where: { id: conversationId },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}

	async getConversationsByUserId(userId: string): Promise<ConversationEntity[]> {
		return this.prismaService.conversation.findMany({
			where: { members: { some: { user_id: userId } } },
			orderBy: { updated_at: 'desc' },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}

	private getType(type: string): ConversationType {
		return type === 'PRIVATE' ? ConversationType.PRIVATE : ConversationType.GROUP;
	}
}
