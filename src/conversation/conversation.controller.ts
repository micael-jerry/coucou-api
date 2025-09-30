import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ConversationInput } from './dto/conversation-input.dto';
import { ConversationResponse } from './dto/conversation-response.dto';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';
import { ConversationMapper } from './mapper/conversation.mapper';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Request } from 'express';

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
	async getConversationById(
		@Req() req: Request,
		@Param('conversationId') conversationId: string,
	): Promise<ConversationResponse> {
		return ConversationMapper.toDto(await this.conversationService.getConversationById(req.user!, conversationId));
	}

	@ApiOperation({
		summary: 'Get conversations by user',
		description: 'Get conversations by connected user',
	})
	@ApiBearerAuth()
	@ApiResponse({ status: HttpStatus.OK, type: [ConversationResponse] })
	@ApiCommonExceptionsDecorator()
	@Get('/')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getConversationsByUserId(@Req() req: Request): Promise<ConversationResponse[]> {
		return (await this.conversationService.getConversationsByConnectedUser(req.user!)).map((entity) =>
			ConversationMapper.toDto(entity),
		);
	}
}
