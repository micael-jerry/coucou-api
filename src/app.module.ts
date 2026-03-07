import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { appConfig, appConfigSchema } from './config/app';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { ConversationModule } from './modules/conversation/conversation.module';
import { FriendRequestModule } from './modules/friend-request/friend-request.module';
import { HealthModule } from './modules/health/health.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

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
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
