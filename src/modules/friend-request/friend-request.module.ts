import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [FriendRequestController],
	providers: [FriendRequestService],
})
export class FriendRequestModule {}
