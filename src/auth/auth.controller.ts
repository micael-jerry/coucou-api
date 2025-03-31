import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { UserMapper } from 'src/user/mapper/user.mapper';

@Controller({ path: '/auth' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({ type: SignUpDto })
	@ApiResponse({ status: 201, type: UserResponse })
	@Post('/sign-up')
	@HttpCode(201)
	async signUp(@Body() signUpDto: SignUpDto): Promise<UserResponse> {
		return UserMapper.toDto(await this.authService.signUp(signUpDto));
	}
}
