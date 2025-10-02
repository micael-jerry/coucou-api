import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConversationModule } from '../conversation/conversation.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketGateway } from '../socket/socket.gateway';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
	imports: [PrismaModule, ConversationModule, AuthModule],
	controllers: [MessageController],
	providers: [MessageService, SocketGateway],
})
export class MessageModule {}
