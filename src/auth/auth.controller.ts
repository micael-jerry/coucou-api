import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from '../user/dto/user-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';
import { Request } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Controller({ path: '/auth' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'User registration endpoint',
		description: 'Allows a new user to register by providing their details.',
	})
	@ApiBody({ type: SignUpDto })
	@ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/sign-up')
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() signUpDto: SignUpDto): Promise<UserResponse> {
		return UserMapper.toDto(await this.authService.signUp(signUpDto));
	}

	@ApiOperation({
		summary: 'User login endpoint',
		description: 'Allows a user to log in by providing their username and password.',
	})
	@ApiBody({ type: LoginDto })
	@ApiResponse({ status: HttpStatus.OK, type: LoginResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/sign-in')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() signInDto: LoginDto): Promise<LoginResponse> {
		return await this.authService.signIn(signInDto);
	}

	@ApiOperation({
		summary: 'Get current user information',
		description: 'Returns the details of the currently authenticated user.',
	})
	@ApiBearerAuth()
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	@ApiCommonExceptionsDecorator()
	@Get('/who-am-i')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async whoAmI(@Req() req: Request): Promise<UserResponse> {
		const user = await this.authService.whoAmI(req.user!);
		return UserMapper.toDto(user);
	}
}
