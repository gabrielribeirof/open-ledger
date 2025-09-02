import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'

import { ACCOUNT_REPOSITORY_TOKEN } from './domain/account/iaccount.repository'
import { ASSET_REPOSITORY_TOKEN } from './domain/asset/iasset.repository'
import { CreateTransactionDomainService } from './domain/services/create-transaction.domain-service'
import { TRANSACTION_REPOSITORY_TOKEN } from './domain/transaction/itransaction.repository'
import { environmentVariablesSchema } from './environment-variables-schema'
import { AccountController } from './infrastructure/http/controllers/account.controller'
import { AssetController } from './infrastructure/http/controllers/asset.controller'
import { TransactionController } from './infrastructure/http/controllers/transaction.controller'
import { InMemoryUnitOfWork } from './infrastructure/repositories/in-memory/in-memory.unit-of-work'
import { InMemoryAccountRepository } from './infrastructure/repositories/in-memory/in-memory-account.repository'
import { InMemoryAssetRepository } from './infrastructure/repositories/in-memory/in-memory-asset.repository'
import { InMemoryTransactionRepository } from './infrastructure/repositories/in-memory/in-memory-transaction.repository'
import { CreateAccountService } from './services/create-account.service'
import { CreateAssetService } from './services/create-asset.service'
import { CreateTransactionService } from './services/create-transaction.service'
import { GetAccountByAliasService } from './services/get-account-by-alias.service'
import { GetAssetByCodeService } from './services/get-asset-by-code.service'
import { ErrorFilter } from './shared/filters/error.filter'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import { NativeErrorFilter } from './shared/filters/native-error.filter'
import { UNIT_OF_WORK } from './shared/seedwork/iunit-of-work'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: false,
			validationSchema: environmentVariablesSchema,
		}),
		HttpModule,
	],
	providers: [
		{
			provide: ACCOUNT_REPOSITORY_TOKEN,
			useClass: InMemoryAccountRepository,
		},
		{
			provide: TRANSACTION_REPOSITORY_TOKEN,
			useClass: InMemoryTransactionRepository,
		},
		{
			provide: ASSET_REPOSITORY_TOKEN,
			useClass: InMemoryAssetRepository,
		},
		{
			provide: UNIT_OF_WORK,
			useClass: InMemoryUnitOfWork,
		},
		CreateAssetService,
		GetAssetByCodeService,
		CreateAccountService,
		GetAccountByAliasService,
		CreateTransactionDomainService,
		CreateTransactionService,
		{
			provide: APP_FILTER,
			useClass: NativeErrorFilter,
		},
		{
			provide: APP_FILTER,
			useClass: ErrorFilter,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
	controllers: [AssetController, AccountController, TransactionController],
})
export class AppModule {}
