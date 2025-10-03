import { Message } from '@prisma/client';
import { MessageResponse } from '../dto/message-response.dto';

export class MessageMapper {
	static toDto(entity: Message): MessageResponse {
		return {
			id: entity.id,
			content: entity.content,
			createdAt: entity.created_at,
			senderId: entity.sender_id,
			conversationId: entity.conversation_id,
		};
	}
}
