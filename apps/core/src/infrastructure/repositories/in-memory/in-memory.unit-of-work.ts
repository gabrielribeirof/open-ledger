import { IUnitOfWork } from '@/shared/seedwork/iunit-of-work';
import { InMemoryTransferRepository } from './in-memory-transfer.repository';
import { InMemoryWalletRepository } from './in-memory-wallet.repository';

export class InMemoryUnitOfWork implements IUnitOfWork {
	transferRepository = new InMemoryTransferRepository();
	walletRepository = new InMemoryWalletRepository();

	async begin() {}

	async commit() {}

	async rollback() {}
}
