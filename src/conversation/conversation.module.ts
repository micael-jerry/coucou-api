import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketGateway } from '../socket/socket.gateway';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [ConversationController],
	providers: [ConversationService, SocketGateway],
	exports: [ConversationService],
})
export class ConversationModule {}
