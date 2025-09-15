import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ITransactionRepository } from '@/domain/transaction/itransaction.repository'
import { Transaction } from '@/domain/transaction/transaction'
import { TransactionMapper } from '@/infrastructure/http/mappers/transaction.mapper'
import { TransactionEntity } from '@/infrastructure/typeorm/entities/transaction.entity'

export class TypeORMTransactionRepository implements ITransactionRepository {
	constructor(
		@InjectRepository(TransactionEntity)
		public transactionRepository: Repository<TransactionEntity>,
	) {}

	async save(transaction: Transaction): Promise<void> {
		const entity = TransactionMapper.toPersistence(transaction)
		await this.transactionRepository.save(entity)
	}
}
