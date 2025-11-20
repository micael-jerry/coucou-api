import { Conversation, Message, User } from '@prisma/client';

export interface ConversationEntity extends Conversation {
	members: {
		user: User;
	}[];
	messages: Message[];
}
