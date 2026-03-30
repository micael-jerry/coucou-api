import { Injectable } from '@nestjs/common';
import { Message } from '../../../prisma/generated/client';
import { AuthTokenPayload } from '../auth/interfaces/auth-token.payload';
import { ConversationService } from '../conversation/conversation.service';
import { MessageInput } from './dto/message-input.dto';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
	constructor(
		private readonly messageRepository: MessageRepository,
		private readonly conversationService: ConversationService,
	) {}

	async sendMessage(authTokenPayload: AuthTokenPayload, message: MessageInput): Promise<Message> {
		await this.conversationService.getConversationById(authTokenPayload, message.conversationId);

		return this.messageRepository.createMessageAndUpdateConversation(
			{
				sender_id: authTokenPayload.user_id,
				conversation_id: message.conversationId,
				content: message.content,
			},
			message.conversationId,
		) satisfies Promise<Message>;
	}

	async findMessageById(messageId: string): Promise<Message> {
		return this.messageRepository.findById(messageId);
	}

	async getMessagesByConversationId(authTokenPayload: AuthTokenPayload, conversationId: string): Promise<Message[]> {
		await this.conversationService.getConversationById(authTokenPayload, conversationId);

		return this.messageRepository.findByConversationId(conversationId);
	}
}
