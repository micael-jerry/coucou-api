import { Injectable } from '@nestjs/common';
import { FriendRequestStatus } from '../../../prisma/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FriendRequestUpdateInput } from './dto/friend-request-update-input.dto';
import { FriendRequestEntity } from './entity/friend-request.entity';

@Injectable()
export class FriendRequestRepository {
	constructor(private readonly prisma: PrismaService) {}

	findAllByReceiverId(receiverId: string, status?: FriendRequestStatus): Promise<FriendRequestEntity[]> {
		return this.prisma.friendRequest.findMany({
			where: {
				...(status && { status }),
				user_target_id: receiverId,
			},
			orderBy: {
				created_at: 'desc',
			},
			include: {
				user: true,
				user__target: true,
			},
		}) satisfies Promise<FriendRequestEntity[]>;
	}

	createManyAndReturn(senderId: string, receiversId: string[]): Promise<FriendRequestEntity[]> {
		return this.prisma.friendRequest.createManyAndReturn({
			data: receiversId.map((receiverId) => ({
				user_id: senderId,
				user_target_id: receiverId,
				status: FriendRequestStatus.PENDING,
			})),
			include: {
				user: true,
				user__target: true,
			},
		}) satisfies Promise<FriendRequestEntity[]>;
	}

	async updateStatusTransaction(
		receiverId: string,
		friendReqUpdateInputs: FriendRequestUpdateInput[],
	): Promise<FriendRequestEntity[]> {
		return this.prisma.$transaction(async (prisma) => {
			const results = [];
			for (const friendReqUpdateInput of friendReqUpdateInputs) {
				const result = await prisma.friendRequest.update({
					where: {
						user_id_user_target_id: {
							user_id: friendReqUpdateInput.senderId,
							user_target_id: receiverId,
						},
					},
					data: {
						status: friendReqUpdateInput.status,
					},
					include: {
						user: true,
						user__target: true,
					},
				});
				results.push(result);
			}
			return results satisfies FriendRequestEntity[];
		});
	}
}
