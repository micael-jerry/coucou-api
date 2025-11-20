import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthGuard } from '../../common/guards/auth.guard';
import { MailerService } from '../../infrastructure/mailer/mailer.service';
import { AuthUtils } from './auth.utils';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, AuthUtils, MailerService, RolesGuard],
})
export class AuthModule {}
