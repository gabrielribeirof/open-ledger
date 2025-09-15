import { InMemoryAccountRepository } from '@/infrastructure/repositories/in-memory/in-memory-account.repository'
import { InMemoryTransactionRepository } from '@/infrastructure/repositories/in-memory/in-memory-transaction.repository'
import type { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

export function generateFakeUnitOfWork(): IUnitOfWork {
	return {
		transactionRepository: new InMemoryTransactionRepository(),
		accountRepository: new InMemoryAccountRepository(),
		begin: jest.fn().mockResolvedValue(undefined),
		commit: jest.fn().mockResolvedValue(undefined),
		rollback: jest.fn().mockResolvedValue(undefined),
	}
}
