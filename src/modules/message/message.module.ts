import { Module } from '@nestjs/common';
import { ConversationModule } from '../conversation/conversation.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { SocketModule } from '../../infrastructure/socket/socket.module';

@Module({
	imports: [PrismaModule, ConversationModule, SocketModule],
	controllers: [MessageController],
	providers: [MessageService],
})
export class MessageModule {}
