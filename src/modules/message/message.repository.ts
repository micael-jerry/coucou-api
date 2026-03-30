import { Injectable } from '@nestjs/common';
import { Message, Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessageRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createMessageAndUpdateConversation(
		messageData: Prisma.MessageUncheckedCreateInput,
		conversationId: string,
	): Promise<Message> {
		return this.prisma.$transaction(async (prisma) => {
			const messageCreated = await prisma.message.create({
				data: messageData,
			});
			await prisma.conversation.update({
				where: { id: conversationId },
				data: { updated_at: messageCreated.created_at },
			});
			return messageCreated;
		});
	}

	async findById(messageId: string): Promise<Message> {
		return this.prisma.message.findUniqueOrThrow({
			where: { id: messageId },
		});
	}

	async findByConversationId(conversationId: string): Promise<Message[]> {
		return this.prisma.message.findMany({
			where: { conversation_id: conversationId },
		});
	}
}
