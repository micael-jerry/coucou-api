import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConversationType } from '@prisma/client';
import { AuthTokenPayload } from '../../common/payloads/auth-token.payload';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationEntity } from './entity/conversation.entity';

@Injectable()
export class ConversationService {
	constructor(private readonly prismaService: PrismaService) {}

	async createConversation(conversationInput: ConversationInput): Promise<ConversationEntity> {
		const conversationAlreadyExist: boolean = await this.privateConversationAlreadyExist(conversationInput);

		if (conversationAlreadyExist) {
			throw new BadRequestException('Conversation already exist');
		}

		const conversation = await this.prismaService.conversation.create({
			data: {
				type: conversationInput.type,
				members: {
					createMany: { data: conversationInput.membersId.map((memberId) => ({ user_id: memberId })) },
				},
			},
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		});

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
