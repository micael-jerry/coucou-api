import { UserMapper } from '../../user/mapper/user.mapper';
import { ConversationResponse } from '../dto/conversation-response.dto';
import { ConversationEntity } from '../entity/conversation.entity';
import { MessageMapper } from '../../message/mapper/message.mapper';

export class ConversationMapper {
	static toDto(entity: ConversationEntity): ConversationResponse {
		return {
			id: entity.id,
			type: entity.type,
			createdAt: entity.created_at,
			updatedAt: entity.updated_at,
			members: entity.members.map((member) => UserMapper.toDto(member.user)),
			message: entity.messages.map((message) => MessageMapper.toDto(message)),
		};
	}
}
