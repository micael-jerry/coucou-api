import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FriendRequestInput {
	@ApiProperty()
	@IsUUID('4', { message: 'Invalid receiverId' })
	receiverId: string;
}
