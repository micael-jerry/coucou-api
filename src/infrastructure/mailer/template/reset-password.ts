import { User } from '../../../../prisma/generated/client';

export class ResetPassword {
	static getTemplate(user: User, resetToken: string, frontendBaseUrl: string) {
		const logoUrl = `${frontendBaseUrl}/logo.png`;
		const resetLink = `${frontendBaseUrl}/auth/reset-password?token=${resetToken}`;

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Reset your password - Coucou App</title>
				<style>
					body {
						font-family: Arial, sans-serif;
						background-color: #9B6EF3; /* violet du logo */
						margin: 0;
						padding: 0;
					}
					.container {
						width: 100%;
						max-width: 600px;
						margin: 0 auto;
						background-color: #ffffff;
						padding: 20px;
						border-radius: 12px;
						box-shadow: 0 2px 8px rgba(0,0,0,0.1);
					}
					.header {
						text-align: center;
						padding-bottom: 20px;
					}
					.header img {
						width: 120px;
					}
					.content {
						text-align: left;
						color: #333333;
					}
					.content h1 {
						font-size: 24px;
						color: #9B6EF3; /* accent violet */
					}
					.content p {
						font-size: 16px;
						line-height: 1.5;
						color: #333333;
					}
					.button {
						display: inline-block;
						background-color: #9B6EF3;
						color: #ffffff !important;
						padding: 12px 20px;
						margin: 20px 0;
						border-radius: 8px;
						text-decoration: none;
						font-weight: bold;
						font-size: 16px;
					}
					.footer {
						text-align: center;
						padding-top: 20px;
						font-size: 12px;
						color: #ffffff;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<img src="${logoUrl}" alt="Coucou App Logo">
					</div>
					<div class="content">
						<h1>Hello, ${user.firstname}!</h1>
						<p>We received a request to reset your password for your <strong>Coucou App</strong> account.</p>
						<p>If you did not request a password reset, please ignore this email.</p>
						<p>Please click the button below to reset your password:</p>
						<p style="text-align: center;">
							<a href="${resetLink}" class="button">Reset My Password</a>
						</p>
						<p>If the button does not work, copy and paste the following link into your browser:</p>
						<p><a href="${resetLink}">${resetLink}</a></p>
						<p>This link will expire in 1 hour.</p>
						<p>Best regards,<br>The Coucou Team</p>
					</div>
				</div>
				<div class="footer">
					<p>&copy; ${new Date().getFullYear()} Coucou App. All rights reserved.</p>
				</div>
			</body>
			</html>
		`;
	}
}
