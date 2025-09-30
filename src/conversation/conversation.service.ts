import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationEntity } from './entity/conversation.entity';
import { AuthTokenPayload } from '../auth/payload/auth-token.payload';

@Injectable()
export class ConversationService {
	constructor(private readonly prismaService: PrismaService) {}

	async createConversation(conversationInput: ConversationInput): Promise<ConversationEntity> {
		return this.prismaService.conversation.create({
			data: {
				type: conversationInput.type,
				members: {
					createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
				},
			},
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}

	async getConversationById(authTokenPayload: AuthTokenPayload, conversationId: string): Promise<ConversationEntity> {
		const conversation: ConversationEntity = await this.prismaService.conversation.findUniqueOrThrow({
			where: { id: conversationId },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});

		if (!conversation.members.some((member) => member.user.id === authTokenPayload.user_id))
			throw new UnauthorizedException('You are not a member of this conversation');

		return conversation;
	}

	async getConversationsByUserId(userId: string): Promise<ConversationEntity[]> {
		return this.prismaService.conversation.findMany({
			where: { members: { some: { user_id: userId } } },
			orderBy: { updated_at: 'desc' },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}
}
