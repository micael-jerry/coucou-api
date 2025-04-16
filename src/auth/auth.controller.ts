import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from '../user/dto/user-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';

@Controller({ path: '/auth' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({ type: SignUpDto })
	@ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
	@Post('/sign-up')
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() signUpDto: SignUpDto): Promise<UserResponse> {
		return UserMapper.toDto(await this.authService.signUp(signUpDto));
	}

	@ApiBody({ type: LoginDto })
	@ApiResponse({ status: HttpStatus.OK, type: LoginResponse })
	@Post('/login')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() signInDto: LoginDto): Promise<LoginResponse> {
		return await this.authService.signIn(signInDto);
	}
}
