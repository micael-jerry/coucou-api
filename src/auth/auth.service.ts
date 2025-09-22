import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from './payload/auth-token.payload';
import { UserMapper } from '../user/mapper/user.mapper';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	async signUp(signUpDto: SignUpDto): Promise<User> {
		return await this.prismaService.user.create({
			data: {
				...signUpDto,
				password: this.hashPassword(signUpDto.password),
			},
		});
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
