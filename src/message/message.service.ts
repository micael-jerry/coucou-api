import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageInput } from './dto/message-input.dto';
import { Message } from '@prisma/client';
import { AuthTokenPayload } from '../auth/payload/auth-token.payload';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class MessageService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly conversationService: ConversationService,
	) {}

	async sendMessage(authTokenPayload: AuthTokenPayload, message: MessageInput): Promise<Message> {
		await this.conversationService.getConversationById(authTokenPayload, message.conversationId);

		return this.prismaService.$transaction(async (prisma) => {
			const messageSended = await prisma.message.create({
				data: { sender_id: message.senderId, conversation_id: message.conversationId, content: message.content },
			});
			await prisma.conversation.update({
				where: { id: message.conversationId },
				data: { updated_at: messageSended.created_at },
			});
			return messageSended;
		});
	}

	async findMessageById(messageId: string): Promise<Message> {
		return this.prismaService.message.findUniqueOrThrow({
			where: { id: messageId },
		});
	}

	async getMessagesByConversationId(authTokenPayload: AuthTokenPayload, conversationId: string): Promise<Message[]> {
		await this.conversationService.getConversationById(authTokenPayload, conversationId);

		return this.prismaService.message.findMany({
			where: { conversation_id: conversationId },
		});
	}
}
