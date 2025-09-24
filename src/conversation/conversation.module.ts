import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [ConversationService],
})
export class ConversationModule {}
