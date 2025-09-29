import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageInput } from './dto/message-input.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
	constructor(private readonly prismaService: PrismaService) {}

	async sendMessage(message: MessageInput): Promise<Message> {
		return this.prismaService.message.create({
			data: { sender_id: message.senderId, conversation_id: message.conversationId, content: message.content },
		});
	}

	async findMessageById(messageId: string): Promise<Message> {
		return this.prismaService.message.findUniqueOrThrow({
			where: { id: messageId },
		});
	}

	async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
		return this.prismaService.message.findMany({
			where: { conversation_id: conversationId },
		});
	}
}
