import { ITransferRepository } from '@/domain/transfer/itransfer.repository';
import { Transfer } from '@/domain/transfer/transfer';
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier';

export class InMemoryTransferRepository implements ITransferRepository {
	public transfers = new Map<string, Transfer>();

	async findById(id: UniqueIdentifier): Promise<Transfer | null> {
		return this.transfers.get(id.value) ?? null;
	}

	async save(transfer: Transfer): Promise<void> {
		this.transfers.set(transfer.id.value, transfer);
	}
}
