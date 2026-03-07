import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { User } from '../../../prisma/generated/client';
import { NodeEnv } from '../../config/app';
import { SendEmailObject } from './entity/send-mail-object.entity';
import { ResetPassword } from './template/reset-password';
import { VerifyEmail } from './template/verify-email';
import { WelcomeEmail } from './template/welcome';

@Injectable()
export class MailerService {
	private readonly resend: Resend;
	private readonly logger: Logger = new Logger(MailerService.name);

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.getOrThrow<string>('app.resend.apiKey');
		this.resend = new Resend(apiKey);
	}

	private get frontEndBaseUrl(): string {
		return this.configService.getOrThrow<string>('app.frontendBaseUrl');
	}

	private async sendEmail({ to, subject, html }: SendEmailObject): Promise<void> {
		// INFO: Not send email on test environment
		if (this.configService.getOrThrow<NodeEnv>('app.env') === NodeEnv.TEST) {
			return;
		}

		const { data, error } = await this.resend.emails.send({
			from: 'Coucou app <no-reply@resend.dev>',
			to: to,
			subject: subject,
			html: html,
		});

		if (error) {
			this.logger.error('MAIL NOT SENDED', error);
			// TODO: VERIFY IF THE ERROR IS FROM RESEND OR FROM THE FRONTEND
			// throw new BadGatewayException('Failed to send the email via external service. Please try again later.');
		}

		this.logger.log(data);
	}

	async sendWelcomeEmail(createdUser: User): Promise<void> {
		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Welcome to Coucou App',
			html: WelcomeEmail.getTemplate(createdUser, this.frontEndBaseUrl),
		});
	}

	async sendVerificationEmailRequest(createdUser: User, verifyEmailToken: string): Promise<void> {
		await this.sendEmail({
			to: [createdUser.email],
			subject: 'Verify your email address for Coucou App',
			html: VerifyEmail.getTemplate(createdUser, verifyEmailToken, this.frontEndBaseUrl),
		});
	}

	async sendResetPasswordEmailRequest(user: User, authTokenToSend: string): Promise<void> {
		await this.sendEmail({
			to: [user.email],
			subject: 'Reset your password for Coucou App',
			html: ResetPassword.getTemplate(user, authTokenToSend, this.frontEndBaseUrl),
		});
	}
}
