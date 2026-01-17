import { registerAs } from '@nestjs/config';

export enum NodeEnv {
	DEVELOPMENT = 'dev',
	PRODUCTION = 'prod',
	TEST = 'test',
}

export default registerAs('app', () => ({
	env: process.env.NODE_ENV as NodeEnv,
	port: Number.parseInt(process.env.PORT || '8080', 10),
	frontendBaseUrl: process.env.FRONT_END_BASE_URL,
	database: {
		url: process.env.DATABASE_URL,
	},
	jwt: {
		secretKey: process.env.JWT_SECRET_KEY,
		expiresIn: process.env.JWT_EXPIRES_IN,
	},
	resend: {
		apiKey: process.env.RESEND_API_KEY,
	},
}));
