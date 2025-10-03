import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenPayload } from '../auth/payload/auth-token.payload';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationEntity } from './entity/conversation.entity';

@Injectable()
export class ConversationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly socketGateway: SocketGateway,
	) {}

	async createConversation(conversationInput: ConversationInput): Promise<ConversationEntity> {
		const conversation = await this.prismaService.conversation.create({
			data: {
				type: conversationInput.type,
				members: {
					createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
				},
			},
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});

		this.socketGateway.emitNewConversation(conversation);

		return conversation;
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

	async getConversationsByConnectedUser(authTokenPayload: AuthTokenPayload): Promise<ConversationEntity[]> {
		return this.prismaService.conversation.findMany({
			where: { members: { some: { user_id: authTokenPayload.user_id } } },
			orderBy: { updated_at: 'desc' },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}
}
