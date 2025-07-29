import { Account } from '@/domain/account/account'
import { IAccountRepository } from '@/domain/account/iaccount.repository'
import { UniqueIdentifier } from '@/shared/seedwork/unique-identifier'

export class InMemoryAccountRepository implements IAccountRepository {
	public accounts = new Map<string, Account>()

	async findById(id: UniqueIdentifier): Promise<Account | null> {
		return this.accounts.get(id.value) ?? null
	}

	async save(wallet: Account): Promise<void> {
		this.accounts.set(wallet.id.value, wallet)
	}
}
