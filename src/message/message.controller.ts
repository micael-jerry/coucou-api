import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageInput } from './dto/message-input.dto';
import { MessageResponse } from './dto/message-response.dto';
import { MessageMapper } from './mapper/message.mapper';
import { ApiOperation, ApiBearerAuth, ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';
import { Request } from 'express';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('/messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@ApiOperation({
		summary: 'Send a message',
		description: 'Send a message to a conversation',
	})
	@ApiBearerAuth()
	@ApiBody({ type: MessageInput })
	@ApiResponse({ status: HttpStatus.OK, type: MessageResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/')
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	@HttpCode(HttpStatus.OK)
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async getMessagesByConversationId(
		@Req() req: Request,
		@Query('conversationId') conversationId: string,
	): Promise<MessageResponse[]> {
		return (await this.messageService.getMessagesByConversationId(req.user!, conversationId)).map((message) =>
			MessageMapper.toDto(message),
		);
	}
}
