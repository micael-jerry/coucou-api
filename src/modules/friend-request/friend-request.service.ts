import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FriendRequestStatus } from '../../../prisma/generated/client';
import { FriendRequestEntity } from './entity/friend-request.entity';
import { FriendRequestInput } from './dto/friend-request-input.dto';
import { FriendRequestUpdateInput } from './dto/friend-request-update-input.dto';

@Injectable()
export class FriendRequestService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllFriendRequests(receiverId: string, status?: FriendRequestStatus): Promise<FriendRequestEntity[]> {
		return await this.prisma.friendRequest.findMany({
			where: {
				status,
				user_target_id: receiverId,
			},
			orderBy: {
				created_at: 'desc',
			},
			include: {
				user: true,
			},
		});
	}

	async sendFriendRequests(senderId: string, receivers: FriendRequestInput[]): Promise<FriendRequestEntity[]> {
		const receiversId = receivers.map((receiver) => receiver.receiverId);

		return await this.prisma.friendRequest.createManyAndReturn({
			data: receiversId.map((receiverId) => ({
				user_id: senderId,
				user_target_id: receiverId,
				status: FriendRequestStatus.PENDING,
			})),
			include: {
				user: true,
			},
		});
	}

	async updateFriendRequestStatus(
		senderId: string,
		friendReqUpdateInputs: FriendRequestUpdateInput[],
	): Promise<FriendRequestEntity[]> {
		const dbReq = friendReqUpdateInputs.map((friendReqUpdateInput) =>
			this.prisma.friendRequest.update({
				where: {
					user_id_user_target_id: {
						user_id: senderId,
						user_target_id: friendReqUpdateInput.receiverId,
					},
				},
				data: {
					status: friendReqUpdateInput.status,
				},
				include: {
					user: true,
				},
			}),
		);

		return await this.prisma.$transaction(dbReq);
	}
}
