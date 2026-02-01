import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '../../../prisma/generated/client';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { MessageInput } from './dto/message-input.dto';
import { MessageResponse } from './dto/message-response.dto';
import { MessageMapper } from './mapper/message.mapper';
import { MessageService } from './message.service';
import { Auth, AuthType } from '../../common/decorators/auth.decorator';

@Controller('/messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@ApiOperation({
		summary: 'Send a message',
		description: 'Send a message to a conversation',
	})
	@ApiBearerAuth()
	@ApiBody({ type: MessageInput })
	@ApiResponse({ status: HttpStatus.CREATED, type: MessageResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/')
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async postMessage(@Req() req: Request, @Body() message: MessageInput): Promise<MessageResponse> {
		return MessageMapper.toDto(await this.messageService.sendMessage(req.user!, message));
	}

	@ApiOperation({
		summary: 'Get a message by id',
		description: 'Get a message by id',
	})
	@ApiBearerAuth()
	@ApiParam({ name: 'messageId', type: 'string' })
	@ApiResponse({ status: HttpStatus.OK, type: MessageResponse })
	@ApiCommonExceptionsDecorator()
	@Get('/:messageId')
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async getMessageById(@Param('messageId') messageId: string): Promise<MessageResponse> {
		return MessageMapper.toDto(await this.messageService.findMessageById(messageId));
	}

	@ApiOperation({
		summary: 'Get messages by conversation id',
		description: 'Get messages by conversation id',
	})
	@ApiBearerAuth()
	@ApiQuery({ name: 'conversationId', type: 'string', description: 'Conversation id in which the user is a member' })
	@ApiResponse({ status: HttpStatus.OK, type: [MessageResponse] })
	@ApiCommonExceptionsDecorator()
	@Get('/')
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async getMessagesByConversationId(
		@Req() req: Request,
		@Query('conversationId') conversationId: string,
	): Promise<MessageResponse[]> {
		return (await this.messageService.getMessagesByConversationId(req.user!, conversationId)).map((message) =>
			MessageMapper.toDto(message),
		);
	}
}
