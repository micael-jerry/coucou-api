import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthUtils } from '../auth/auth.utils';
import { MailerService } from '../../infrastructure/mailer/mailer.service';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, AuthUtils, MailerService],
})
export class UserModule {}
