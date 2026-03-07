import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestRepository } from './friend-request.repository';
import { FriendRequestService } from './friend-request.service';

@Module({
	imports: [PrismaModule],
	controllers: [FriendRequestController],
	providers: [FriendRequestService, FriendRequestRepository],
	exports: [FriendRequestService, FriendRequestRepository],
})
export class FriendRequestModule {}
