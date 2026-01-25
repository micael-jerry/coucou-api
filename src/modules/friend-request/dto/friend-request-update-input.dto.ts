import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from '../../../../prisma/generated/enums';
import { IsEnum, IsUUID } from 'class-validator';

export class FriendRequestUpdateInput {
	@ApiProperty()
	@IsUUID('4', { message: 'Invalid receiverId' })
	receiverId: string;

	@ApiProperty()
	@IsEnum(FriendRequestStatus, { message: 'Invalid status' })
	status: FriendRequestStatus;
}
