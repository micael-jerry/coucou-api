import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import { SendEmailObject } from './entity/send-mail-object.entity';
import { VerifyEmail } from './template/verify-email';
import { WelcomeEmail } from './template/welcome';
import { ResetPassword } from './template/reset-password';

@Injectable()
export class MailerService {
	private readonly resend: Resend;
	private readonly logger: Logger = new Logger(MailerService.name);

	constructor() {
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
			this.logger.error({ error });
			throw new BadGatewayException('Failed to send the email via external service. Please try again later.');
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

	async sendVerificationEmailRequest(createdUser: User, verifyEmailToken: string) {
		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Verify your email address for Coucou App',
			html: VerifyEmail.getTemplate(createdUser, verifyEmailToken),
		});
	}

	async sendResetPasswordEmailRequest(user: User, authTokenToSend: string) {
		await this.sendEmail({
			to: [user.email],
			subject: 'Reset your password for Coucou App',
			html: ResetPassword.getTemplate(user, authTokenToSend),
		});
	}
}
