import { Body, Controller, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '../../../prisma/generated/client';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async getConversationsByUserId(@Req() req: Request): Promise<ConversationResponse[]> {
		return (await this.conversationService.getConversationsByConnectedUser(req.user!)).map((entity) =>
			ConversationMapper.toDto(entity),
		);
	}
}
