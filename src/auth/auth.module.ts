import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from './guard/auth.guard';
import { MailerService } from '../mailer/mailer.service';
import { AuthUtils } from './auth.utils';
import { RolesGuard } from './guard/roles.guard';

@Module({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, AuthUtils, MailerService, RolesGuard],
})
export class AuthModule {}
