import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from '../../../../prisma/generated/enums';
import { UserResponse } from '../../user/dto/user-response.dto';

export class FriendRequestResponse {
	@ApiProperty({ enum: FriendRequestStatus })
	status: FriendRequestStatus;

	@ApiProperty({ type: UserResponse, description: 'User who sent the friend request' })
	sender: UserResponse;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'Friend request created datetime' })
	createdAt: Date;

	@ApiProperty({ type: 'string', format: 'date-time', description: 'Friend request updated datetime' })
	updatedAt: Date;
}
