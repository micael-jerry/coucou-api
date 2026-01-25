import { BadRequestException, PipeTransform } from '@nestjs/common';
import { FriendRequestStatus } from '../../../../prisma/generated/enums';

export class ParseFriendRequestStatusPipe implements PipeTransform<string, FriendRequestStatus | undefined> {
	transform(status?: string): FriendRequestStatus | undefined {
		if (!status) return undefined;
		if (!Object.values(FriendRequestStatus).includes(status as FriendRequestStatus)) {
			throw new BadRequestException('Invalid friend request status');
		}
		return status as FriendRequestStatus;
	}
}
