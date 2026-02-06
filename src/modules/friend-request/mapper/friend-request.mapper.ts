import { UserMapper } from '../../user/mapper/user.mapper';
import { FriendRequestResponse } from '../dto/friend-request-response.dto';
import { FriendRequestEntity } from '../entity/friend-request.entity';

export class FriendRequestMapper {
	static toDto(friendRequest: FriendRequestEntity): FriendRequestResponse {
		return {
			status: friendRequest.status,
			sender: UserMapper.toDto(friendRequest.user),
			receiver: UserMapper.toDto(friendRequest.user__target),
			createdAt: friendRequest.created_at,
			updatedAt: friendRequest.updated_at,
		};
	}
}
