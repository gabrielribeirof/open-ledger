import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { parseValidationErrorsToErrorsUtil } from './shared/utils/parse-validation-errors-to-errors.util';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory(errors) {
				return parseValidationErrorsToErrorsUtil(errors);
			},
		}),
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle(`OpenLedger API (${configService.get('NODE_ENV')})`)
		.setVersion('0.1')
		.build();

	SwaggerModule.setup(
		'swagger',
		app,
		SwaggerModule.createDocument(app, swaggerConfig),
	);

	await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
