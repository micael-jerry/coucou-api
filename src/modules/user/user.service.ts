import { Injectable } from '@nestjs/common';
import { User } from '../../../prisma/generated/client';
import { AuthUtils } from '../auth/auth.utils';
import { AuthTokenPayload } from '../auth/interfaces/auth-token.payload';
import { MailerService } from '../mailer/mailer.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly authUtils: AuthUtils,
		private readonly mailerService: MailerService,
	) {}

	async findAll(): Promise<User[]> {
		return await this.userRepository.findAll();
	}

	async findById(id: string): Promise<User> {
		return await this.userRepository.findById(id);
	}

	async updateUser(authTokenPayload: AuthTokenPayload, userUpdateVal: UpdateUserDto) {
		const user = await this.findById(authTokenPayload.user_id);
		const isChangedEmail = user.email !== userUpdateVal.email;
		const updatedUser = await this.userRepository.update(authTokenPayload.user_id, {
			...userUpdateVal,
			...(userUpdateVal.password && { password: await this.authUtils.hashPassword(userUpdateVal.password) }),
			is_verified: isChangedEmail ? false : user.is_verified,
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
