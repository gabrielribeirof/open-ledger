import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ACCOUNT_REPOSITORY_TOKEN } from './domain/account/iaccount.repository'
import { ASSET_REPOSITORY_TOKEN } from './domain/asset/iasset.repository'
import { CreateTransactionDomainService } from './domain/services/create-transaction.domain-service'
import { TRANSACTION_REPOSITORY_TOKEN } from './domain/transaction/itransaction.repository'
import { ENVIRONMENT_VARIABLES, environmentVariablesSchema } from './environment-variables-schema'
import { AccountController } from './infrastructure/http/controllers/account.controller'
import { AssetController } from './infrastructure/http/controllers/asset.controller'
import { TransactionController } from './infrastructure/http/controllers/transaction.controller'
import { TypeORMUnitOfWork } from './infrastructure/repositories/typeorm/typeorm.unit-of-work'
import { TypeORMAccountRepository } from './infrastructure/repositories/typeorm/typeorm-account.repository'
import { TypeORMAssetRepository } from './infrastructure/repositories/typeorm/typeorm-asset.repository'
import { TypeORMTransactionRepository } from './infrastructure/repositories/typeorm/typeorm-transaction.repository'
import { AccountEntity } from './infrastructure/typeorm/entities/account.entity'
import { AssetEntity } from './infrastructure/typeorm/entities/asset.entity'
import { OperationEntity } from './infrastructure/typeorm/entities/operation.entity'
import { TransactionEntity } from './infrastructure/typeorm/entities/transaction.entity'
import { CreateAccountService } from './services/create-account.service'
import { CreateAssetService } from './services/create-asset.service'
import { CreateTransactionService } from './services/create-transaction.service'
import { GetAccountByAliasService } from './services/get-account-by-alias.service'
import { GetAssetByCodeService } from './services/get-asset-by-code.service'
import { ErrorFilter } from './shared/filters/error.filter'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import { NativeErrorFilter } from './shared/filters/native-error.filter'
import { UNIT_OF_WORK_TOKEN } from './shared/seedwork/iunit-of-work'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: false,
			validationSchema: environmentVariablesSchema,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				type: 'postgres',
				url: configService.get<string>(ENVIRONMENT_VARIABLES.DATABASE_URI),
				autoLoadEntities: true,
			}),
		}),
		TypeOrmModule.forFeature([AssetEntity, AccountEntity, TransactionEntity, OperationEntity]),
		HttpModule,
	],
	providers: [
		{
			provide: ACCOUNT_REPOSITORY_TOKEN,
			useClass: TypeORMAccountRepository,
		},
		{
			provide: TRANSACTION_REPOSITORY_TOKEN,
			useClass: TypeORMTransactionRepository,
		},
		{
			provide: ASSET_REPOSITORY_TOKEN,
			useClass: TypeORMAssetRepository,
		},
		{
			provide: UNIT_OF_WORK_TOKEN,
			useClass: TypeORMUnitOfWork,
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
