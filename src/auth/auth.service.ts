import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponse } from './dto/sign-in-response.dto';
import { JwtService } from '@nestjs/jwt';

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
				password: bcrypt.hashSync(signUpDto.password, bcrypt.genSaltSync()),
			},
		});
	}

	async signIn(signInDto: SignInDto): Promise<SignInResponse> {
		const user: User = await this.prismaService.user.findUniqueOrThrow({
			where: { username: signInDto.username },
		});
		if (bcrypt.compareSync(signInDto.password, user.password)) {
			const payload = { user_id: user.id, user_username: user.username };
			return {
				access_token: await this.jwtService.signAsync(payload),
			};
		}
		throw new UnauthorizedException('Invalid Password');
	}
}
