import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationController } from './conversation.controller';

@Module({
	imports: [PrismaModule],
	controllers: [ConversationController],
	providers: [ConversationService],
})
export class ConversationModule {}
