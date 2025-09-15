import * as Joi from 'joi'

export const environmentVariablesSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
	HTTP_PORT: Joi.number().required(),
	DATABASE_URI: Joi.string().required(),
})

export const ENVIRONMENT_VARIABLES = {
	NODE_ENV: 'NODE_ENV',
	HTTP_PORT: 'HTTP_PORT',
	DATABASE_URI: 'DATABASE_URI',
}
