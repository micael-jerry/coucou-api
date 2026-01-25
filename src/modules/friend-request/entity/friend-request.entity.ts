import { FriendRequest, User } from '../../../../prisma/generated/client';

export type FriendRequestEntity = FriendRequest & {
	user: User;
};
