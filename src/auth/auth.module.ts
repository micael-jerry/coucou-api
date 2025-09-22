import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { MailerService } from '../mailer/mailer.service';

@Module({
	imports: [
		PrismaModule,
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '30d' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, MailerService],
})
export class AuthModule {}
