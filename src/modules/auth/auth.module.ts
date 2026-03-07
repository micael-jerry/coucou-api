import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailerService } from '../mailer/mailer.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, AuthUtils, MailerService, RolesGuard, GoogleStrategy],
})
export class AuthModule {}
