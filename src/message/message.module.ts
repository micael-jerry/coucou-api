import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationService } from '../conversation/conversation.service';

@Module({
	imports: [PrismaModule],
	controllers: [MessageController],
	providers: [MessageService, ConversationService],
})
export class MessageModule {}
