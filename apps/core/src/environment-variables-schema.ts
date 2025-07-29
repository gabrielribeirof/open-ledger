import Joi from 'joi'

export const environmentVariablesSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
	TRANSFER_AUTHORIZER_SERVICE_PROVIDER: Joi.string()
		.valid('in-memory', 'devitools')
		.required(),
	TRANSFER_AUTHORIZER_SERVICE_URL: Joi.string().required(),
	NOTIFY_SERVICE_URL: Joi.string().required(),
	HTTP_PORT: Joi.number().required(),
	DATABASE_URI: Joi.string().required(),
})

export const ENVIRONMENT_VARIABLES = {
	NODE_ENV: 'NODE_ENV',
	TRANSFER_AUTHORIZER_SERVICE_PROVIDER: 'TRANSFER_AUTHORIZER_SERVICE_PROVIDER',
	TRANSFER_AUTHORIZER_SERVICE_URL: 'TRANSFER_AUTHORIZER_SERVICE_URL',
	NOTIFY_SERVICE_URL: 'NOTIFY_SERVICE_URL',
	HTTP_PORT: 'HTTP_PORT',
	DATABASE_URI: 'DATABASE_URI',
}
