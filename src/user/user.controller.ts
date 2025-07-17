import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './dto/user-response.dto';
import { UserMapper } from './mapper/user.mapper';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller({ path: '/users' })
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/')
	@UseGuards(AuthGuard)
	async getAllUsers(): Promise<UserResponse[]> {
		return (await this.userService.findAll()).map((u) => UserMapper.toDto(u));
	}
}
