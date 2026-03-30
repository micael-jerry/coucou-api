import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
	imports: [PrismaModule, ConversationModule],
	controllers: [MessageController],
	providers: [MessageService, MessageRepository],
	exports: [MessageRepository],
})
export class MessageModule {}
