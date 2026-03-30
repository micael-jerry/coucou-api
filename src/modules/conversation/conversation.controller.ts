import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '../../../prisma/generated/client';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { Auth, AuthType } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthTokenPayload } from '../auth/interfaces/auth-token.payload';
import { ConversationService } from './conversation.service';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationResponse } from './dto/conversation-response.dto';
import { ConversationMapper } from './mapper/conversation.mapper';

@Controller('/conversations')
export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	@ApiOperation({
		summary: 'Create a new conversation',
		description: 'Create a new conversation with the given members',
	})
	@ApiBearerAuth()
	@ApiBody({ type: ConversationInput })
	@ApiResponse({ status: HttpStatus.CREATED, type: ConversationResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/')
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async postConversation(
		@CurrentUser() user: AuthTokenPayload,
		@Body() conversationInput: ConversationInput,
	): Promise<ConversationResponse> {
		return ConversationMapper.toDto(await this.conversationService.createConversation(user, conversationInput));
	}

	@ApiOperation({
		summary: 'Get conversation by id',
		description: 'Get conversation by id',
	})
	@ApiBearerAuth()
	@ApiParam({
		name: 'conversationId',
		type: 'string',
		required: true,
		description: 'The id of the conversation to retrieve.',
	})
	@ApiResponse({ status: HttpStatus.OK, type: ConversationResponse })
	@ApiCommonExceptionsDecorator()
	@Get('/:conversationId')
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async getConversationById(
		@CurrentUser() user: AuthTokenPayload,
		@Param('conversationId') conversationId: string,
	): Promise<ConversationResponse> {
		return ConversationMapper.toDto(await this.conversationService.getConversationById(user, conversationId));
	}

	@ApiOperation({
		summary: 'Get conversations by user',
		description: 'Get conversations by connected user',
	})
	@ApiBearerAuth()
	@ApiResponse({ status: HttpStatus.OK, type: [ConversationResponse] })
	@ApiCommonExceptionsDecorator()
	@Get('/')
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async getConversationsByUserId(@CurrentUser() user: AuthTokenPayload): Promise<ConversationResponse[]> {
		return (await this.conversationService.getConversationsByConnectedUser(user)).map((entity) =>
			ConversationMapper.toDto(entity),
		);
	}
}
