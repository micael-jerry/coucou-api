import { User } from '@prisma/client';

export class WelcomeEmail {
	static getTemplate(createdUser: User) {
		return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Coucou App</title>
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
          .content p, 
          .content li {
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
          }
          ul {
            padding-left: 20px;
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
            <h1>Welcome, ${createdUser.firstname} ${createdUser.lastname}!</h1>
            <p>We are thrilled to have you join Coucou App. Your account has been created successfully.</p>
            <p>Here are your account details:</p>
            <ul>
              <li><strong>Username:</strong> ${createdUser.username}</li>
              <li><strong>Email:</strong> ${createdUser.email}</li>
            </ul>
            <p>You can now log in to your account and start connecting.</p>
            <p>If you have any questions, feel free to contact our support team.</p>
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
