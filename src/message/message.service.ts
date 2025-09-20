import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageInput } from './dto/message-input.dto';
import { Message } from '@prisma/client';

@Injectable()
export class ModuleService {
	constructor(private readonly prismaService: PrismaService) {}

	sendMessage(message: MessageInput): Promise<Message> {
		return this.prismaService.message.create({
			data: { sender_id: message.senderId, conversation_id: message.conversationId, content: message.content },
		});
	}
}
