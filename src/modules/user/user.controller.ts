import { Body, Controller, Get, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserService } from './user.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller({ path: '/users' })
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		summary: 'Get all users',
		description: 'Returns a list of all users.',
	})
	@ApiBearerAuth()
	@ApiResponse({ status: HttpStatus.OK, type: [UserResponse] })
	@ApiCommonExceptionsDecorator()
	@Get('/')
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async getAllUsers(): Promise<UserResponse[]> {
		return (await this.userService.findAll()).map((u) => UserMapper.toDto(u));
	}

	@ApiOperation({
		summary: 'Get user by id',
		description: 'Returns a user by id.',
	})
	@ApiBearerAuth()
	@ApiParam({ name: 'userId', type: 'string', required: true, description: 'The id of the user to retrieve.' })
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	@ApiCommonExceptionsDecorator()
	@Get('/:userId')
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async getUserById(@Param('userId') userId: string): Promise<UserResponse> {
		return UserMapper.toDto(await this.userService.findById(userId));
	}

	@ApiOperation({
		summary: 'Update connected user',
		description: 'Update a user connected.',
	})
	@ApiBearerAuth()
	@ApiBody({ type: UpdateUserDto })
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	@ApiCommonExceptionsDecorator()
	@Put('/me')
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
	async updateUser(@Req() req: Request, @Body() userUpdateVal: UpdateUserDto) {
		return UserMapper.toDto(await this.userService.updateUser(req.user!, userUpdateVal));
	}
}
