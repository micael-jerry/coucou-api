import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserMapper } from '../user/mapper/user.mapper';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthTokenPayload } from './payload/auth-token.payload';
import { ResetPasswordRequestResponse } from './dto/reset-password-request-response.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { VerifyEmailPayload } from './payload/verify-email.payload';
import { VerifyEmailResponse } from './dto/verify-email-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
	) {}

	async signUp(signUpDto: SignUpDto): Promise<User> {
		const createdUser = await this.prismaService.user.create({
			data: {
				...signUpDto,
				password: this.hashPassword(signUpDto.password),
			},
		});

		await this.mailerService.sendWelcomeEmail(createdUser);
		await this.mailerService.sendVerificationEmailRequest(
			createdUser,
			await this.genVerificationEmailToken(createdUser),
		);
		return createdUser;
	}

	async signIn(signInDto: LoginDto): Promise<LoginResponse> {
		const user: User = await this.prismaService.user.findUniqueOrThrow({
			where: { username: signInDto.username },
		});
		if (this.isValidPassword(signInDto.password, user.password)) {
			return {
				access_token: await this.genAuthToken(user),
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
			const payload = await this.jwtService.verifyAsync<VerifyEmailPayload>(verificationEmailToken);
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
		await this.mailerService.sendResetPasswordEmailRequest(user, await this.genAuthToken(user));
		return {
			message: `The email for the password reset was successfully sent to the following email address ${resetPasswordRequestDto.email}`,
			timestamp: Date.now(),
		};
	}

	async resetPassword(authTokenPayload: AuthTokenPayload, resetPasswordDto: ResetPasswordDto): Promise<User> {
		return await this.prismaService.user.update({
			where: { id: authTokenPayload.user_id },
			data: { password: this.hashPassword(resetPasswordDto.newPassword) },
		});
	}

	async genAuthToken(user: User): Promise<string> {
		const payload: AuthTokenPayload = { user_id: user.id, user_username: user.username };
		return await this.jwtService.signAsync(payload);
	}

	async genVerificationEmailToken(user: User): Promise<string> {
		const verifyEmailPayload: VerifyEmailPayload = {
			id: user.id,
			email: user.email,
			timestamp: Date.now(),
		};
		return await this.jwtService.signAsync(verifyEmailPayload);
	}

	private hashPassword(password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync());
	}

	private isValidPassword(password: string, hashedPassword: string): boolean {
		return bcrypt.compareSync(password, hashedPassword);
	}
}
