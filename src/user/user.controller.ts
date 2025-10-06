import { Body, Controller, Get, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserService } from './user.service';

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
	@UseGuards(AuthGuard)
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
	@UseGuards(AuthGuard)
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
	@UseGuards(AuthGuard)
	async updateUser(@Req() req: Request, @Body() userUpdateVal: UpdateUserDto) {
		return UserMapper.toDto(await this.userService.updateUser(req.user!, userUpdateVal));
	}
}
