import { ITransferRepository } from '@/domain/transfer/itransfer.repository'
import { Transfer } from '@/domain/transfer/transfer'

export class InMemoryTransferRepository implements ITransferRepository {
	public transfers = new Map<string, Transfer>()

	async save(transfer: Transfer): Promise<void> {
		this.transfers.set(transfer.id.value, transfer)
	}
}
