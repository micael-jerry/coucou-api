import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { SocketModule } from '../../infrastructure/socket/socket.module';

@Module({
	imports: [PrismaModule, SocketModule],
	controllers: [ConversationController],
	providers: [ConversationService],
	exports: [ConversationService],
})
export class ConversationModule {}
