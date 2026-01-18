import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConversationMemberRole, ConversationType } from '../../../prisma/generated/client';
import { AuthTokenPayload } from '../../common/payloads/auth-token.payload';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationEntity } from './entity/conversation.entity';

@Injectable()
export class ConversationService {
	constructor(private readonly prismaService: PrismaService) {}

	async createConversation(
		authTokenPayload: AuthTokenPayload,
		conversationInput: ConversationInput,
	): Promise<ConversationEntity> {
		const conversationAlreadyExist: boolean = await this.privateConversationAlreadyExist(conversationInput);

		if (conversationAlreadyExist) {
			throw new BadRequestException('Conversation already exist');
		}

		return await this.prismaService.$transaction(async (prisma) => {
			const conversation = await prisma.conversation.create({
				data: {
					type: conversationInput.type,
					name: conversationInput.name,
					members: {
						createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
					},
				},
				include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
			});
			await prisma.conversationMember.updateMany({
				where: {
					conversation_id: conversation.id,
					user_id: {
						in:
							conversationInput.type === ConversationType.PRIVATE
								? conversationInput.membersId
								: [authTokenPayload.user_id],
					},
				},
				data: {
					role: ConversationMemberRole.ADMIN,
				},
			});
			return conversation;
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

	async getConversationsByConnectedUser(authTokenPayload: AuthTokenPayload): Promise<ConversationEntity[]> {
		return this.prismaService.conversation.findMany({
			where: { members: { some: { user_id: authTokenPayload.user_id } } },
			orderBy: { updated_at: 'desc' },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});
	}

	private async privateConversationAlreadyExist(conversationInput: ConversationInput): Promise<boolean> {
		if (conversationInput.type === ConversationType.PRIVATE) {
			const conversation = await this.prismaService.conversation.findFirst({
				where: {
					type: ConversationType.PRIVATE,
					AND: [
						...conversationInput.membersId.map((memberId) => ({
							members: { some: { user_id: memberId } },
						})),
						{
							members: {
								every: {
									user_id: {
										in: conversationInput.membersId,
									},
								},
							},
						},
					],
				},
			});
			return !!conversation;
		}
		return false;
	}
}
