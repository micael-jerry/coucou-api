import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthTokenPayload } from '../auth/payload/auth-token.payload';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUtils } from '../auth/auth.utils';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly authUtils: AuthUtils,
		private readonly mailerService: MailerService,
	) {}

	async findAll(): Promise<User[]> {
		return await this.prismaService.user.findMany();
	}

	async findById(id: string): Promise<User> {
		return await this.prismaService.user.findUniqueOrThrow({ where: { id } });
	}

	async updateUser(authTokenPayload: AuthTokenPayload, userUpdateVal: UpdateUserDto) {
		return await this.prismaService.$transaction(async (prisma) => {
			const user = await prisma.user.findUniqueOrThrow({ where: { id: authTokenPayload.user_id } });
			const updatedUser = await prisma.user.update({
				where: { id: authTokenPayload.user_id },
				data: {
					...userUpdateVal,
					password: await this.authUtils.hashPassword(userUpdateVal.password),
					is_verified: user.email === userUpdateVal.email,
				},
			});
			await this.mailerService.sendVerificationEmailRequest(
				updatedUser,
				await this.authUtils.genSpecificRequestToken(updatedUser),
			);
			return updatedUser;
		});
	}
}
