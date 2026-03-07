import { Injectable } from '@nestjs/common';
import { User } from '../../../prisma/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUtils } from '../auth/auth.utils';
import { AuthTokenPayload } from '../auth/interfaces/auth-token.payload';
import { MailerService } from '../mailer/mailer.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
		const user = await this.findById(authTokenPayload.user_id);
		const isChangedEmail = user.email !== userUpdateVal.email;
		const updatedUser = await this.prismaService.user.update({
			where: { id: authTokenPayload.user_id },
			data: {
				...userUpdateVal,
				...(userUpdateVal.password && { password: await this.authUtils.hashPassword(userUpdateVal.password) }),
				is_verified: isChangedEmail ? false : user.is_verified,
			},
		});
		if (isChangedEmail) {
			await this.mailerService.sendVerificationEmailRequest(
				updatedUser,
				await this.authUtils.genSpecificRequestToken(updatedUser),
			);
		}
		return updatedUser;
	}
}
