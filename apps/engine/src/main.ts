import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, getSchemaPath, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'

import { AppModule } from './app.module'
import { ErrorDTO } from './shared/lib/error.dto'
import { InvalidParametersErrorDTO } from './shared/lib/invalid-parameters.error.dto'
import { parseValidationErrorsToErrorsUtil } from './shared/utils/parse-validation-errors-to-errors.util'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)

	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory(errors) {
				return parseValidationErrorsToErrorsUtil(errors)
			},
		}),
	)

	const swaggerConfig = new DocumentBuilder()
		.setTitle(`OpenLedger API (${configService.get('NODE_ENV')})`)
		.setVersion('0.1')
		.addGlobalResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			schema: {
				$ref: getSchemaPath(ErrorDTO),
			},
		})
		.build()

	SwaggerModule.setup(
		'swagger',
		app,
		SwaggerModule.createDocument(app, swaggerConfig, {
			extraModels: [ErrorDTO, InvalidParametersErrorDTO],
		}),
	)

	await app.listen(configService.getOrThrow('HTTP_PORT'))

	const logger = new Logger('Bootstrap')
	logger.log('\n' + fs.readFileSync(path.join(__dirname, '..', '..', 'scripts', 'ol-logo.txt'), 'utf8'))
	logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
