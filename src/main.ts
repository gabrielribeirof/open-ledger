import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { parseValidationErrorsToErrors } from './shared/utils/parse-validation-errors-to-errors';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory(errors) {
				return parseValidationErrorsToErrors(errors);
			},
		}),
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle(`Wallet API (${configService.get('NODE_ENV')})`)
		.setVersion('1.0')
		.build();

	SwaggerModule.setup(
		'swagger',
		app,
		SwaggerModule.createDocument(app, swaggerConfig),
	);

	await app.listen(configService.getOrThrow('HTTP_PORT'));
}
bootstrap();
