import type { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

import { InMemoryAccountRepository } from './in-memory-account.repository'
import { InMemoryTransactionRepository } from './in-memory-transaction.repository'

export class InMemoryUnitOfWork implements IUnitOfWork {
	constructor(
		public transactionRepository = new InMemoryTransactionRepository(),
		public accountRepository = new InMemoryAccountRepository(),
	) {}

	async begin() {
		return Promise.resolve()
	}

	async commit() {
		return Promise.resolve()
	}

	async rollback() {
		return Promise.resolve()
	}
}
