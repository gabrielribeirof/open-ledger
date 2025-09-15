import type { Account } from './account'

export interface IAccountRepository {
	findByAlias(alias: string): Promise<Account | null>
	save(account: Account): Promise<void>
}

export const ACCOUNT_REPOSITORY_TOKEN = 'IAccountRepository'
