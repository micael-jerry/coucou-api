import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '../../../prisma/generated/client';
import { FriendRequestStatus } from '../../../prisma/generated/enums';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FriendRequestResponse } from './dto/friend-request-response.dto';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestMapper } from './mapper/friend-request.mapper';
import { ParseFriendRequestStatusPipe } from './pipe/friend-request.pipe';
import { FriendRequestInput } from './dto/friend-request-input.dto';
import { FriendRequestUpdateInput } from './dto/friend-request-update-input.dto';

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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async getAllFriendRequests(
		@Req() request: Request,
		@Query('status', new ParseFriendRequestStatusPipe()) status?: FriendRequestStatus,
	): Promise<FriendRequestResponse[]> {
		return (await this.friendRequestService.getAllFriendRequests(request.user!.user_id, status)).map((friendRequest) =>
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async sendFriendRequests(
		@Req() request: Request,
		@Body() body: FriendRequestInput[],
	): Promise<FriendRequestResponse[]> {
		return (await this.friendRequestService.sendFriendRequests(request.user!.user_id, body)).map((friendRequest) =>
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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async updateFriendRequestStatus(
		@Req() request: Request,
		@Body() friendRequestUpdateInputs: FriendRequestUpdateInput[],
	): Promise<FriendRequestResponse[]> {
		console.log(request.user!.user_id == friendRequestUpdateInputs[0].receiverId);
		return (
			await this.friendRequestService.updateFriendRequestStatus(request.user!.user_id, friendRequestUpdateInputs)
		).map((friendRequest) => FriendRequestMapper.toDto(friendRequest));
	}
}
