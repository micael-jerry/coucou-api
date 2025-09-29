import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationResponse } from './dto/conversation-response.dto';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';
import { ConversationMapper } from './mapper/convesation.mapper';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('/conversations')
export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	@ApiOperation({
		summary: 'Create a new conversation',
		description: 'Create a new conversation with the given members',
	})
	@ApiBearerAuth()
	@ApiBody({ type: ConversationInput })
	@ApiResponse({ status: HttpStatus.OK, type: ConversationResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async postConversation(@Body() conversationInput: ConversationInput): Promise<ConversationResponse> {
		return ConversationMapper.toDto(await this.conversationService.createConversation(conversationInput));
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
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getConversationById(@Param('conversationId') conversationId: string): Promise<ConversationResponse> {
		return ConversationMapper.toDto(await this.conversationService.getConversationById(conversationId));
	}

	@ApiOperation({
		summary: 'Get conversations by user id',
		description: 'Get conversations by user id',
	})
	@ApiBearerAuth()
	@ApiQuery({
		name: 'userId',
		type: 'string',
		required: true,
		description: 'The id of the user to retrieve conversations for.',
	})
	@ApiResponse({ status: HttpStatus.OK, type: [ConversationResponse] })
	@ApiCommonExceptionsDecorator()
	@Get('/')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getConversationsByUserId(@Query('userId') userId: string): Promise<ConversationResponse[]> {
		return (await this.conversationService.getConversationsByUserId(userId)).map((entity) =>
			ConversationMapper.toDto(entity),
		);
	}
}
