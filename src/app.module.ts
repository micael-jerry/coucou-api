import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '30d' },
		}),
		PrismaModule,
		UserModule,
		AuthModule,
		HealthModule,
		ConversationModule,
		MessageModule,
	],
})
export class AppModule {}
