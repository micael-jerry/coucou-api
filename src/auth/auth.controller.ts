import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiCommonExceptionsDecorator } from '../exception/decorator/api-common-exceptions.decorator';
import { HttpExceptionResponseDto } from '../exception/dto/http-exception-response.dto';
import { MailerService } from '../mailer/mailer.service';
import { UserResponse } from '../user/dto/user-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller({ path: '/auth' })
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly mailerService: MailerService,
	) {}

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

	@ApiOperation({
		summary: 'Verify email address',
		description: 'Verify email address with token sended into email of user.',
	})
	@ApiQuery({ name: 'token', type: 'string', required: true, description: 'Token to verify email address' })
	@ApiResponse({ status: HttpStatus.OK, type: HttpExceptionResponseDto })
	@ApiCommonExceptionsDecorator()
	@Get('/verify-email')
	@HttpCode(HttpStatus.OK)
	async verifyEmail(@Req() req: Request, @Query('token') token: string): Promise<HttpExceptionResponseDto> {
		const response = await this.mailerService.verifyEmail(token);
		return {
			status: HttpStatus.OK,
			type: 'success',
			message: `Email verified successfully for ${response.email}`,
			path: req.path,
			typestamp: new Date(),
		};
	}
}
