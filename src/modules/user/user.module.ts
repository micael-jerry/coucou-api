import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthUtils } from '../auth/auth.utils';
import { MailerService } from '../mailer/mailer.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, AuthUtils, MailerService, UserRepository],
	exports: [UserRepository],
})
export class UserModule {}
