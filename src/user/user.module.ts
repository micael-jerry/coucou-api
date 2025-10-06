import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthUtils } from '../auth/auth.utils';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, AuthUtils],
})
export class UserModule {}
