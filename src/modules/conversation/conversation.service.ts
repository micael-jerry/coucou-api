import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConversationType } from '../../../prisma/generated/client';
import { AuthTokenPayload } from '../auth/interfaces/auth-token.payload';
import { ConversationRepository } from './conversation.repository';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationEntity } from './entity/conversation.entity';

@Injectable()
export class ConversationService {
	constructor(private readonly conversationRepository: ConversationRepository) {}

	// TODO: verify all members are friends and exist
	async createConversation(
		authTokenPayload: AuthTokenPayload,
		conversationInput: ConversationInput,
	): Promise<ConversationEntity> {
		const conversationAlreadyExist: boolean = await this.privateConversationAlreadyExist(conversationInput);

		if (conversationAlreadyExist) {
			throw new BadRequestException('Conversation already exist');
		}
		if (!conversationInput.membersId.includes(authTokenPayload.user_id)) {
			throw new BadRequestException('You are not a member of this conversation');
		}

		return await this.conversationRepository.createConversationWithMembers(conversationInput, authTokenPayload.user_id);
	}

	async getConversationById(authTokenPayload: AuthTokenPayload, conversationId: string): Promise<ConversationEntity> {
		const conversation: ConversationEntity = await this.conversationRepository.findById(conversationId);

		if (!conversation.members.some((member) => member.user.id === authTokenPayload.user_id))
			throw new UnauthorizedException('You are not a member of this conversation');

		return conversation;
	}

	async getConversationsByConnectedUser(authTokenPayload: AuthTokenPayload): Promise<ConversationEntity[]> {
		return this.conversationRepository.findByUserId(authTokenPayload.user_id);
	}

	private async privateConversationAlreadyExist(conversationInput: ConversationInput): Promise<boolean> {
		if (conversationInput.type === ConversationType.PRIVATE) {
			return await this.conversationRepository.checkPrivateConversationExists(conversationInput.membersId);
		}
		return false;
	}
}
