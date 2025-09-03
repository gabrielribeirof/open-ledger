import type { ITransactionRepository } from '@/domain/transaction/itransaction.repository'
import type { Transaction } from '@/domain/transaction/transaction'

export class InMemoryTransactionRepository implements ITransactionRepository {
	public transactions = new Map<string, Transaction>()

	async save(transaction: Transaction): Promise<void> {
		this.transactions.set(transaction.id.value, transaction)
	}
}
