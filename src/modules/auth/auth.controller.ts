import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '../../../prisma/generated/client';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { HttpExceptionResponseDto } from '../../common/dtos/http-exception-response.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserResponse } from '../user/dto/user-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordRequestResponse } from './dto/reset-password-request-response.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailResponse } from './dto/verify-email-response.dto';
import { GoogleAuthGuard } from '../../common/guards/google-auth.guard';

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
	@Roles([UserRole.ADMIN, UserRole.USER])
	@UseGuards(AuthGuard, RolesGuard)
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
	async verifyEmail(@Query('token') token: string): Promise<VerifyEmailResponse> {
		return await this.authService.verifyEmail(token);
	}

	@ApiOperation({
		summary: 'Send reset password email',
		description: 'Send reset password email to user.',
	})
	@ApiBody({ type: ResetPasswordRequestDto })
	@ApiResponse({ status: HttpStatus.OK, type: ResetPasswordRequestResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/reset-password-request')
	@HttpCode(HttpStatus.OK)
	async resetPasswordRequest(
		@Body() resetPasswordRequestDto: ResetPasswordRequestDto,
	): Promise<ResetPasswordRequestResponse> {
		return await this.authService.resetPasswordRequest(resetPasswordRequestDto);
	}

	@ApiOperation({
		summary: 'Reset password',
		description: 'Reset password with token sended into email of user.',
	})
	@ApiBody({ type: ResetPasswordDto })
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	@ApiCommonExceptionsDecorator()
	@Post('/reset-password')
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<UserResponse> {
		return UserMapper.toDto(await this.authService.resetPassword(resetPasswordDto));
	}

	@Get('/google/sign-in')
	@UseGuards(GoogleAuthGuard)
	googleAuthSignIn() {}

	@Get('/google/redirect')
	@UseGuards(GoogleAuthGuard)
	googleAuthRedirect() {}
}
