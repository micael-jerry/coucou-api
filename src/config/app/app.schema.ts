import * as Joi from 'joi';
import { NodeEnv } from './app.type';

export const appConfigSchema = Joi.object({
	NODE_ENV: Joi.string().required().valid(NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.TEST),
	PORT: Joi.number().required().port(),
	FRONT_END_BASE_URL: Joi.string().required().uri(),
	DATABASE_URL: Joi.string().required().uri(),
	JWT_SECRET_KEY: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().required(),
	RESEND_API_KEY: Joi.string().required(),
});
