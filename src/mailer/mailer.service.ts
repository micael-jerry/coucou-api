import { Resend } from 'resend';
import { SendMailObject } from './entity/send-mail-object.entity';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WelcomeMail } from './template/welcome';

@Injectable()
export class MailerService {
	private readonly resend: Resend;

	constructor() {
		this.resend = new Resend(process.env.RESEND_API_KEY);
	}

	async sendWelcomeMail(createdUser: User) {
		await this.sendMail({
			to: [createdUser.email],
			subject: 'Welcome to Coucou App',
			html: WelcomeMail.getTemplate(createdUser),
		});
	}

	private async sendMail({ to, subject, html }: SendMailObject) {
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
}
