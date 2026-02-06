import { Conversation, Message, User } from '../../../../prisma/generated/client';

export interface ConversationEntity extends Conversation {
	members: {
		user: User;
	}[];
	messages: Message[];
}
