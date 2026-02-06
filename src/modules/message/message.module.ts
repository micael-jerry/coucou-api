import { Module } from '@nestjs/common';
import { ConversationModule } from '../conversation/conversation.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
	imports: [PrismaModule, ConversationModule],
	controllers: [MessageController],
	providers: [MessageService],
})
export class MessageModule {}
