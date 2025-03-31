import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponse } from './dto/sign-in-response.dto';

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

	@ApiBody({ type: SignInDto })
	@ApiResponse({ status: HttpStatus.OK, type: SignInResponse })
	@Post('/sign-in')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
		return await this.authService.signIn(signInDto);
	}
}
