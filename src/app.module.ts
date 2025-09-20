import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

@Module({
	imports: [PrismaModule, UserModule, AuthModule, HealthModule, ConversationModule, MessageModule],
})
export class AppModule {}
