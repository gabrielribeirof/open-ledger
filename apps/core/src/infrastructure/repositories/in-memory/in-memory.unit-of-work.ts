import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work';
import { InMemoryTransferRepository } from './in-memory-transfer.repository';
import { InMemoryAccountRepository } from './in-memory-account.repository';

export class InMemoryUnitOfWork implements IUnitOfWork {
	transferRepository = new InMemoryTransferRepository();
	accountRepository = new InMemoryAccountRepository();

	async begin() {}

	async commit() {}

	async rollback() {}
}
