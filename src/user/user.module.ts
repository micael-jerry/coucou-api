import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthUtils } from '../auth/auth.utils';
import { MailerService } from '../mailer/mailer.service';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, AuthUtils, MailerService],
})
export class UserModule {}
