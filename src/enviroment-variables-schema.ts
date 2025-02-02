import * as Joi from 'joi';

export const enviromentVariablesSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
	TRANSFER_AUTHORIZER_SERVICE_URL: Joi.string().required(),
	NOTIFY_SERVICE_URL: Joi.string().required(),
	HTTP_PORT: Joi.number().required(),
	WALLET_DATABASE_URI: Joi.string().required(),
});
