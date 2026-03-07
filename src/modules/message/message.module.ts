import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
	imports: [PrismaModule, ConversationModule],
	controllers: [MessageController],
	providers: [MessageService],
})
export class MessageModule {}
