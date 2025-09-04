import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, QueryRunner } from 'typeorm'

import { IAccountRepository } from '@/domain/account/iaccount.repository'
import { ITransactionRepository } from '@/domain/transaction/itransaction.repository'
import { AccountEntity } from '@/infrastructure/typeorm/entities/account.entity'
import { TransactionEntity } from '@/infrastructure/typeorm/entities/transaction.entity'
import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

import { TypeORMAccountRepository } from './typeorm-account.repository'
import { TypeORMTransactionRepository } from './typeorm-transaction.repository'

@Injectable()
export class TypeORMUnitOfWork implements IUnitOfWork {
	private queryRunner: QueryRunner
	public readonly transactionRepository: ITransactionRepository
	public readonly accountRepository: IAccountRepository

	constructor(@InjectDataSource() private readonly dataSource: DataSource) {
		this.queryRunner = this.dataSource.createQueryRunner()
		this.transactionRepository = new TypeORMTransactionRepository(this.dataSource.getRepository(TransactionEntity))
		this.accountRepository = new TypeORMAccountRepository(this.dataSource.getRepository(AccountEntity))
	}

	async begin() {
		await this.queryRunner.connect()
		await this.queryRunner.startTransaction()
	}

	async commit() {
		return this.queryRunner.commitTransaction()
	}

	async rollback() {
		return this.queryRunner.rollbackTransaction()
	}
}
