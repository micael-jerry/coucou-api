import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import { VerifyEmailPayload } from '../auth/payload/verify-email.payload';
import { PrismaService } from '../prisma/prisma.service';
import { SendEmailObject } from './entity/send-mail-object.entity';
import { VerifyEmail } from './template/verify-email';
import { WelcomeEmail } from './template/welcome';

@Injectable()
export class MailerService {
	private readonly resend: Resend;
	private readonly logger: Logger = new Logger(MailerService.name);

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
			return this.logger.error({ error });
		}

		this.logger.log({ data });
	}

	async sendWelcomeEmail(createdUser: User) {
		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Welcome to Coucou App',
			html: WelcomeEmail.getTemplate(createdUser),
		});
	}

	async sendVerificationEmailRequest(createdUser: User) {
		const verifyEmailPayload: VerifyEmailPayload = {
			id: createdUser.id,
			email: createdUser.email,
			timestamp: Date.now(),
		};
		const verifyEmailToken = await this.jwtService.signAsync(verifyEmailPayload);

		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Verify your email address for Coucou App',
			html: VerifyEmail.getTemplate(createdUser, verifyEmailToken),
		});
	}
}
