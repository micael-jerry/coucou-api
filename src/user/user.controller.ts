import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './dto/user-response.dto';
import { UserMapper } from './mapper/user.mapper';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';

@Controller({ path: '/users' })
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		summary: 'Get all users',
		description: 'Returns a list of all users.',
	})
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
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	@ApiCommonExceptionsDecorator()
	@Get('/:userId')
	@UseGuards(AuthGuard)
	async getUserById(@Param('userId') userId: string): Promise<UserResponse> {
		return UserMapper.toDto(await this.userService.findById(userId));
	}
}
