import { Conversation } from '@prisma/client';
import { ConversationResponse } from '../dto/conversation-response.dto';

export class ConversationMapper {
	static toDto(entity: Conversation): ConversationResponse {
		return {
			id: entity.id,
			type: entity.type,
			createdAt: entity.created_at,
			updatedAt: entity.updated_at,
		};
	}
}
