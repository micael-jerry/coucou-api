import { FriendRequest, User } from '../../../../prisma/generated/client';

export type FriendRequestEntity = FriendRequest & {
	user: User;
	user__target: User;
};
