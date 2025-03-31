import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(private readonly prismaService: PrismaService) {}

	async signUp(signUpDto: SignUpDto): Promise<User> {
		return await this.prismaService.user.create({
			data: {
				...signUpDto,
				password: bcrypt.hashSync(signUpDto.password, bcrypt.genSaltSync()),
			},
		});
	}
}
