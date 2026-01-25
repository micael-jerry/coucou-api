import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { HealthModule } from './modules/health/health.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { appConfig, appConfigSchema } from './config/app';
import { FriendRequestModule } from './modules/friend-request/friend-request.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			load: [appConfig],
			validationSchema: appConfigSchema,
			isGlobal: true,
			cache: true,
		}),
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('app.jwt.secretKey'),
				signOptions: {
					expiresIn: configService.get<string>('app.jwt.expiresIn'),
				},
			}),
		}),
		PrismaModule,
		UserModule,
		AuthModule,
		HealthModule,
		ConversationModule,
		MessageModule,
		FriendRequestModule,
	],
})
export class AppModule {}
