import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
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

		// TODO: only send email in prod
		await this.mailerService.sendWelcomeEmail(createdUser);
		await this.mailerService.sendVerificationEmailRequest(createdUser);
		return createdUser;
	}

	async signIn(signInDto: LoginDto): Promise<LoginResponse> {
		const user: User = await this.prismaService.user.findUniqueOrThrow({
			where: { username: signInDto.username },
		});
		if (this.isValidPassword(signInDto.password, user.password)) {
			const payload: AuthTokenPayload = { user_id: user.id, user_username: user.username };
			return {
				access_token: await this.jwtService.signAsync(payload),
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

	private hashPassword(password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync());
	}

	private isValidPassword(password: string, hashedPassword: string): boolean {
		return bcrypt.compareSync(password, hashedPassword);
	}
}
