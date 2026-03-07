import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';

@Module({
	imports: [PrismaModule],
	controllers: [FriendRequestController],
	providers: [FriendRequestService],
})
export class FriendRequestModule {}
