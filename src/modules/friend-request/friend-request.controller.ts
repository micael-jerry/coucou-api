import { Body, Controller, Get, HttpCode, HttpStatus, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '../../../prisma/generated/client';
import { FriendRequestStatus } from '../../../prisma/generated/enums';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { Auth, AuthType } from '../auth/decorators/auth.decorator';
import { FriendRequestInput } from './dto/friend-request-input.dto';
import { FriendRequestResponse } from './dto/friend-request-response.dto';
import { FriendRequestUpdateInput } from './dto/friend-request-update-input.dto';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestMapper } from './mapper/friend-request.mapper';
import { ParseFriendRequestStatusPipe } from './pipe/friend-request.pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthTokenPayload } from '../auth/interfaces/auth-token.payload';

@Controller('friend-requests')
export class FriendRequestController {
	constructor(private readonly friendRequestService: FriendRequestService) {}

	@ApiOperation({
		summary: 'Get all friend requests',
		description: 'Get all friend requests for the current user',
	})
	@ApiBearerAuth()
	@ApiQuery({ name: 'status', enum: FriendRequestStatus, required: false, description: 'Filter by status' })
	@ApiResponse({ status: HttpStatus.OK, type: [FriendRequestResponse] })
	@ApiCommonExceptionsDecorator()
	@Get()
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async getAllFriendRequests(
		@CurrentUser() user: AuthTokenPayload,
		@Query('status', new ParseFriendRequestStatusPipe()) status?: FriendRequestStatus,
	): Promise<FriendRequestResponse[]> {
		return (await this.friendRequestService.getAllFriendRequests(user.user_id, status)).map((friendRequest) =>
			FriendRequestMapper.toDto(friendRequest),
		);
	}

	@ApiOperation({
		summary: 'Send friend requests',
		description: 'Send friend requests to the specified users',
	})
	@ApiBearerAuth()
	@ApiBody({ type: [FriendRequestInput] })
	@ApiResponse({ status: HttpStatus.CREATED, type: [FriendRequestResponse] })
	@ApiCommonExceptionsDecorator()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async sendFriendRequests(
		@CurrentUser() user: AuthTokenPayload,
		@Body(new ParseArrayPipe({ items: FriendRequestInput }))
		body: FriendRequestInput[],
	): Promise<FriendRequestResponse[]> {
		return (await this.friendRequestService.sendFriendRequests(user.user_id, body)).map((friendRequest) =>
			FriendRequestMapper.toDto(friendRequest),
		);
	}

	@ApiOperation({
		summary: 'Update friend requests status',
		description: 'Update friend requests status for the current user',
	})
	@ApiBearerAuth()
	@ApiBody({ type: [FriendRequestUpdateInput] })
	@ApiResponse({ status: HttpStatus.OK, type: [FriendRequestResponse] })
	@ApiCommonExceptionsDecorator()
	@Put()
	@Auth(AuthType.ROLES, [UserRole.ADMIN, UserRole.USER])
	async updateFriendRequestStatus(
		@CurrentUser() user: AuthTokenPayload,
		@Body(new ParseArrayPipe({ items: FriendRequestUpdateInput }))
		friendRequestUpdateInputs: FriendRequestUpdateInput[],
	): Promise<FriendRequestResponse[]> {
		return (await this.friendRequestService.updateFriendRequestStatus(user.user_id, friendRequestUpdateInputs)).map(
			(friendRequest) => FriendRequestMapper.toDto(friendRequest),
		);
	}
}
