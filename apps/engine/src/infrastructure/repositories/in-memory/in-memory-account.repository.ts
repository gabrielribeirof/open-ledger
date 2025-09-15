import type { Account } from '@/domain/account/account'
import type { IAccountRepository } from '@/domain/account/iaccount.repository'

export class InMemoryAccountRepository implements IAccountRepository {
	public accounts = new Map<string, Account>()

	async findByAlias(alias: string): Promise<Account | null> {
		return this.accounts.get(alias) ?? null
	}

	async save(account: Account): Promise<void> {
		this.accounts.set(account.alias.value, account)
	}
}
