import { User } from '@prisma/client';

export class VerifyEmail {
	static getTemplate(createdUser: User, emailVerificationToken: string) {
		const verificationLink = `${process.env.FRONT_END_BASE_URL}/verify-email?token=${emailVerificationToken}`;

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Verify your email - Coucou App</title>
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
						<img src="${process.env.FRONT_END_BASE_URL}/logo.png" alt="Coucou App Logo">
					</div>
					<div class="content">
						<h1>Verify Your Email Address</h1>
						<p>Hello, ${createdUser.firstname}!</p>
						<p>Please click the button below to confirm your email address.</p>
						<p style="text-align: center;">
							<a href="${verificationLink}" class="button">Verify My Email</a>
						</p>
						<p>If the button does not work, copy and paste the following link into your browser:</p>
						<p><a href="${verificationLink}">${verificationLink}</a></p>
						<p>If you did not request this verification, please ignore this email.</p>
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
