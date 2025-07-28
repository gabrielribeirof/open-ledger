import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
	ENVIRONMENT_VARIABLES,
	environmentVariablesSchema,
} from './environment-variables-schema';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './shared/filters/error.filter';
import { TRANSFER_REPOSITORY } from './domain/transfer/itransfer.repository';
import { ACCOUNT_REPOSITORY } from './domain/account/iaccount.repository';
import { CreateTransferService } from './services/create-transfer.service';
import { UserEntity } from './infrastructure/mikro-orm/entities/user.entity';
import { AccountEntity } from './infrastructure/mikro-orm/entities/account.entity';
import { TransferEntity } from './infrastructure/mikro-orm/entities/transfer.entity';
import { TransfersController } from './infrastructure/http/controllers/transfers.controller';
import { HttpModule } from '@nestjs/axios';
import { TRANSFER_AUTHORIZER_PROVIDER } from './providers/transfer-authorizer/itransfer-authorizer.provider';
import { getConfigOrThrowUtil } from './shared/utils/get-config-or-throw.util';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UNIT_OF_WORK } from './shared/seedwork/iunit-of-work';
import { MikroOrmUnitOfWork } from './infrastructure/repositories/mikro-orm/mikro-orm.unit-of-work';
import { MikroOrmTransferRepository } from './infrastructure/repositories/mikro-orm/mikro-orm-transfer.repository';
import { MikroOrmAccountRepository } from './infrastructure/repositories/mikro-orm/mikro-orm-account.repository';
import { NativeErrorFilter } from './shared/filters/native-error.filter';
import { InMemoryTransferAuthorizerProvider } from './providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider';
import { DevitoolsTransferAuthorizerProvider } from './providers/transfer-authorizer/devitools/devitools-transfer-authorizer.provider';
import { ProviderNotFoundError } from './shared/domain/_errors/provider-not-found.error';
import { CreateTransferDomainService } from './domain/services/create-transfer.domain-service';

function findTransferAuthorizerProviders(type: string) {
	switch (type) {
		case 'in-memory':
			return InMemoryTransferAuthorizerProvider;
		case 'devitools':
			return DevitoolsTransferAuthorizerProvider;
		default:
			throw new ProviderNotFoundError();
	}
}

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: false,
			validationSchema: environmentVariablesSchema,
		}),
		MikroOrmModule.forRoot({
			autoLoadEntities: true,
			forceUtcTimezone: true,
		}),
		MikroOrmModule.forFeature([UserEntity, AccountEntity, TransferEntity]),
		HttpModule,
	],
	providers: [
		{
			provide: TRANSFER_REPOSITORY,
			useClass: MikroOrmTransferRepository,
		},
		{
			provide: ACCOUNT_REPOSITORY,
			useClass: MikroOrmAccountRepository,
		},
		{
			provide: UNIT_OF_WORK,
			useClass: MikroOrmUnitOfWork,
		},
		CreateTransferDomainService,
		CreateTransferService,
		{
			provide: TRANSFER_AUTHORIZER_PROVIDER,
			useClass: findTransferAuthorizerProviders(
				getConfigOrThrowUtil(
					ENVIRONMENT_VARIABLES.TRANSFER_AUTHORIZER_SERVICE_PROVIDER,
				),
			),
		},
		{
			provide: APP_FILTER,
			useClass: ErrorFilter,
		},
		{
			provide: APP_FILTER,
			useClass: NativeErrorFilter,
		},
	],
	controllers: [TransfersController],
})
export class AppModule {}
