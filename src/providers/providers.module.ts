import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ITransferAuthorizerProvider } from './transfer-authorizer/itransfer-authorizer.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { findTransferAuthorizerProviders } from './transfer-authorizer';

@Module({
	imports: [HttpModule],
	exports: [
		{
			provide: ITransferAuthorizerProvider,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const environment = configService.getOrThrow('NODE_ENV');

				return findTransferAuthorizerProviders(
					environment === 'test' ? 'in-memory' : 'devitools',
				);
			},
		},
	],
})
export class ProvidersModule {}
