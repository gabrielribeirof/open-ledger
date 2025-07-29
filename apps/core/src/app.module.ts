import { MikroOrmModule } from '@mikro-orm/nestjs'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'

import { ACCOUNT_REPOSITORY } from './domain/account/iaccount.repository'
import { CreateTransferDomainService } from './domain/services/create-transfer.domain-service'
import { TRANSFER_REPOSITORY } from './domain/transfer/itransfer.repository'
import {
	ENVIRONMENT_VARIABLES,
	environmentVariablesSchema,
} from './environment-variables-schema'
import { TransfersController } from './infrastructure/http/controllers/transfers.controller'
import { AccountEntity } from './infrastructure/mikro-orm/entities/account.entity'
import { TransferEntity } from './infrastructure/mikro-orm/entities/transfer.entity'
import { UserEntity } from './infrastructure/mikro-orm/entities/user.entity'
import { MikroOrmUnitOfWork } from './infrastructure/repositories/mikro-orm/mikro-orm.unit-of-work'
import { MikroOrmAccountRepository } from './infrastructure/repositories/mikro-orm/mikro-orm-account.repository'
import { MikroOrmTransferRepository } from './infrastructure/repositories/mikro-orm/mikro-orm-transfer.repository'
import { DevitoolsTransferAuthorizerProvider } from './providers/transfer-authorizer/devitools/devitools-transfer-authorizer.provider'
import { InMemoryTransferAuthorizerProvider } from './providers/transfer-authorizer/in-memory/in-memory-transfer-authorizer.provider'
import { TRANSFER_AUTHORIZER_PROVIDER } from './providers/transfer-authorizer/itransfer-authorizer.provider'
import { CreateTransferService } from './services/create-transfer.service'
import { ProviderNotFoundError } from './shared/domain/_errors/provider-not-found.error'
import { ErrorFilter } from './shared/filters/error.filter'
import { NativeErrorFilter } from './shared/filters/native-error.filter'
import { UNIT_OF_WORK } from './shared/seedwork/iunit-of-work'
import { getConfigOrThrowUtil } from './shared/utils/get-config-or-throw.util'

function findTransferAuthorizerProviders(type: string) {
	switch (type) {
		case 'in-memory':
			return InMemoryTransferAuthorizerProvider
		case 'devitools':
			return DevitoolsTransferAuthorizerProvider
		default:
			throw new ProviderNotFoundError()
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
