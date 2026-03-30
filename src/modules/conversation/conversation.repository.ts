import { Injectable } from '@nestjs/common';
import { ConversationMemberRole, ConversationType } from '../../../prisma/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationEntity } from './entity/conversation.entity';

@Injectable()
export class ConversationRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createConversationWithMembers(
		conversationInput: ConversationInput,
		authUserId: string,
	): Promise<ConversationEntity> {
		return this.prisma.$transaction(async (prisma) => {
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
						in: conversationInput.type === ConversationType.PRIVATE ? conversationInput.membersId : [authUserId],
					},
				},
				data: {
					role: ConversationMemberRole.ADMIN,
				},
			});
			return conversation satisfies ConversationEntity;
		});
	}

	findById(conversationId: string): Promise<ConversationEntity> {
		return this.prisma.conversation.findUniqueOrThrow({
			where: { id: conversationId },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		}) satisfies Promise<ConversationEntity>;
	}

	findByUserId(userId: string): Promise<ConversationEntity[]> {
		return this.prisma.conversation.findMany({
			where: { members: { some: { user_id: userId } } },
			orderBy: { updated_at: 'desc' },
			include: { members: { include: { user: true } }, messages: { orderBy: { created_at: 'desc' } } },
		}) satisfies Promise<ConversationEntity[]>;
	}

	async checkPrivateConversationExists(membersId: string[]): Promise<boolean> {
		const conversation = await this.prisma.conversation.findFirst({
			where: {
				type: ConversationType.PRIVATE,
				AND: [
					...membersId.map((memberId) => ({
						members: { some: { user_id: memberId } },
					})),
					{
						members: {
							every: {
								user_id: {
									in: membersId,
								},
							},
						},
					},
				],
			},
		});
		return !!conversation;
	}
}
