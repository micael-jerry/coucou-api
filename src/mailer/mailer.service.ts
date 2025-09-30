import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import { SendEmailObject } from './entity/send-mail-object.entity';
import { VerifyEmailPayload } from './payload/verify-email.payload';
import { VerifyEmail } from './template/verify-email';
import { WelcomeEmail } from './template/welcome';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailerService {
	private readonly resend: Resend;

	constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {
		this.resend = new Resend(process.env.RESEND_API_KEY);
	}

	private async sendEmail({ to, subject, html }: SendEmailObject): Promise<void> {
		// INFO: Not send email on test environement
		if (process.env.NODE_ENV === 'test') {
			return Promise.resolve();
		}

		const { data, error } = await this.resend.emails.send({
			from: 'Coucou app <no-reply@resend.dev>',
			to: to,
			subject: subject,
			html: html,
		});

		if (error) {
			return console.error({ error });
		}

		console.log({ data });
	}

	async sendWelcomeEmail(createdUser: User) {
		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Welcome to Coucou App',
			html: WelcomeEmail.getTemplate(createdUser),
		});
	}

	async sendVerificationEmailRequest(createdUser: User) {
		const verifyEmailPayload: VerifyEmailPayload = { email: createdUser.email };
		const verifyEmailToken = await this.jwtService.signAsync(verifyEmailPayload);

		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Verify your email address for Coucou App',
			html: VerifyEmail.getTemplate(createdUser, verifyEmailToken),
		});
	}

	async checkEmailVerificationRequest(token: string): Promise<VerifyEmailPayload> {
		try {
			const payload = await this.jwtService.verifyAsync<VerifyEmailPayload>(token);
			await this.prismaService.user.update({
				where: { email: payload.email },
				data: { is_verified: true },
			});
			return payload;
		} catch (err) {
			console.error(err);
			throw new BadRequestException('Invalid token');
		}
	}
}
