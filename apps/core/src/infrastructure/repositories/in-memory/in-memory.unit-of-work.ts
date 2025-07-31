import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

import { InMemoryAccountRepository } from './in-memory-account.repository'
import { InMemoryTransactionRepository } from './in-memory-transaction.repository'

export class InMemoryUnitOfWork implements IUnitOfWork {
	transactionRepository = new InMemoryTransactionRepository()
	accountRepository = new InMemoryAccountRepository()

	async begin() {}

	async commit() {}

	async rollback() {}
}
