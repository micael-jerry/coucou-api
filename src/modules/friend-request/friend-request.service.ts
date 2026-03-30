import { Injectable } from '@nestjs/common';
import { FriendRequestStatus } from '../../../prisma/generated/client';
import { FriendRequestInput } from './dto/friend-request-input.dto';
import { FriendRequestUpdateInput } from './dto/friend-request-update-input.dto';
import { FriendRequestEntity } from './entity/friend-request.entity';
import { FriendRequestRepository } from './friend-request.repository';

@Injectable()
export class FriendRequestService {
	constructor(private readonly friendRequestRepository: FriendRequestRepository) {}

	async getAllFriendRequests(receiverId: string, status?: FriendRequestStatus): Promise<FriendRequestEntity[]> {
		return await this.friendRequestRepository.findAllByReceiverId(receiverId, status);
	}

	async sendFriendRequests(senderId: string, receivers: FriendRequestInput[]): Promise<FriendRequestEntity[]> {
		const receiversId = receivers.map((receiver) => receiver.receiverId);
		return await this.friendRequestRepository.createManyAndReturn(senderId, receiversId);
	}

	async updateFriendRequestStatus(
		receiverId: string,
		friendReqUpdateInputs: FriendRequestUpdateInput[],
	): Promise<FriendRequestEntity[]> {
		return await this.friendRequestRepository.updateStatusTransaction(receiverId, friendReqUpdateInputs);
	}
}
