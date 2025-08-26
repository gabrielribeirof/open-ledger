import { InMemoryAccountRepository } from '@/infrastructure/repositories/in-memory/in-memory-account.repository'
import { InMemoryTransactionRepository } from '@/infrastructure/repositories/in-memory/in-memory-transaction.repository'
import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work'

interface GenerateFakeUnitOfWorkProperties {
	commit?: jest.Mock
}

export function generateFakeUnitOfWork(props: GenerateFakeUnitOfWorkProperties = {}): IUnitOfWork {
	return {
		transactionRepository: new InMemoryTransactionRepository(),
		accountRepository: new InMemoryAccountRepository(),
		begin: jest.fn().mockResolvedValue(undefined),
		commit: props.commit ?? jest.fn().mockResolvedValue(undefined),
		rollback: jest.fn().mockResolvedValue(undefined),
	}
}
