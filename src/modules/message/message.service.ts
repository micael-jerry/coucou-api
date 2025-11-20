import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { AuthTokenPayload } from '../../common/payloads/auth-token.payload';
import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SocketGateway } from '../../infrastructure/socket/socket.gateway';
import { MessageInput } from './dto/message-input.dto';

@Injectable()
export class MessageService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly conversationService: ConversationService,
		private readonly socketGateway: SocketGateway,
	) {}

	async sendMessage(authTokenPayload: AuthTokenPayload, message: MessageInput): Promise<Message> {
		await this.conversationService.getConversationById(authTokenPayload, message.conversationId);

		const messageSended = await this.prismaService.$transaction(async (prisma) => {
			const messageCreated = await prisma.message.create({
				data: {
					sender_id: authTokenPayload.user_id,
					conversation_id: message.conversationId,
					content: message.content,
				},
			});
			await prisma.conversation.update({
				where: { id: message.conversationId },
				data: { updated_at: messageCreated.created_at },
			});
			return messageCreated;
		});

		this.socketGateway.emitNewMessage(messageSended);

		return messageSended;
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
