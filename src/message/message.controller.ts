import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageInput } from './dto/message-input.dto';
import { MessageResponse } from './dto/message-response.dto';
import { MessageMapper } from './mapper/message.mapper';
import { ApiOperation, ApiBearerAuth, ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiCommonExceptionsDecorator } from 'src/exception/decorator/api-common-exceptions.decorator';

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
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async postMessage(@Body() message: MessageInput): Promise<MessageResponse> {
		return MessageMapper.toDto(await this.messageService.sendMessage(message));
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
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getMessageById(@Param('messageId') messageId: string): Promise<MessageResponse> {
		return MessageMapper.toDto(await this.messageService.findMessageById(messageId));
	}

	@ApiOperation({
		summary: 'Get messages by conversation id',
		description: 'Get messages by conversation id',
	})
	@ApiBearerAuth()
	@ApiQuery({ name: 'conversationId', type: 'string' })
	@ApiResponse({ status: HttpStatus.OK, type: [MessageResponse] })
	@ApiCommonExceptionsDecorator()
	@Get('/')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getMessagesByConversationId(@Query('conversationId') conversationId: string): Promise<MessageResponse[]> {
		return (await this.messageService.getMessagesByConversationId(conversationId)).map((message) =>
			MessageMapper.toDto(message),
		);
	}
}
