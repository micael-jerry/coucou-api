import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserMapper } from '../user/mapper/user.mapper';
import { AuthUtils } from './auth.utils';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordRequestResponse } from './dto/reset-password-request-response.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailResponse } from './dto/verify-email-response.dto';
import { AuthTokenPayload } from './payload/auth-token.payload';
import { SpecificReqTokenPayload } from './payload/specific-req-token.payload';

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
		private readonly authUtils: AuthUtils,
	) {}

	async signUp(signUpDto: SignUpDto): Promise<User> {
		const createdUser = await this.prismaService.user.create({
			data: {
				...signUpDto,
				password: this.authUtils.hashPassword(signUpDto.password),
			},
		});

		await this.mailerService.sendWelcomeEmail(createdUser);
		await this.mailerService.sendVerificationEmailRequest(
			createdUser,
			await this.authUtils.genSpecificRequestToken(createdUser),
		);
		return createdUser;
	}

	async signIn(signInDto: LoginDto): Promise<LoginResponse> {
		const user: User = await this.prismaService.user.findUniqueOrThrow({
			where: { username: signInDto.username },
		});
		if (this.authUtils.isValidPassword(signInDto.password, user.password)) {
			return {
				access_token: await this.authUtils.genAuthToken(user),
				user: UserMapper.toDto(user),
			};
		}
		throw new UnauthorizedException('Invalid Password');
	}

	async whoAmI(authTokenPayload: AuthTokenPayload): Promise<User> {
		const user: User = await this.prismaService.user.findUniqueOrThrow({
			where: { id: authTokenPayload.user_id },
		});
		return user;
	}

	async verifyEmail(verificationEmailToken: string): Promise<VerifyEmailResponse> {
		try {
			const payload = await this.authUtils.getPayloadToken<SpecificReqTokenPayload>(verificationEmailToken);
			await this.prismaService.user.update({
				where: { email: payload.email },
				data: { is_verified: true },
			});
			return {
				email: payload.email,
				message: 'The email address has been checked successfully',
				timestamp: Date.now(),
			};
		} catch (err) {
			this.logger.error(err);
			throw new BadRequestException('Invalid token');
		}
	}

	async resetPasswordRequest(resetPasswordRequestDto: ResetPasswordRequestDto): Promise<ResetPasswordRequestResponse> {
		const user: User = await this.prismaService.user.findUniqueOrThrow({
			where: { email: resetPasswordRequestDto.email },
		});
		const resetPasswordToken: string = await this.authUtils.genSpecificRequestToken(user);
		await this.mailerService.sendResetPasswordEmailRequest(user, resetPasswordToken);
		return {
			message: `The email for the password reset was successfully sent to the following email address ${resetPasswordRequestDto.email}`,
			timestamp: Date.now(),
		};
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
		const authTokenPayload = await this.authUtils.getPayloadToken<SpecificReqTokenPayload>(resetPasswordDto.token);
		return await this.prismaService.user.update({
			where: { id: authTokenPayload.id },
			data: { password: this.authUtils.hashPassword(resetPasswordDto.newPassword) },
		});
	}
}
