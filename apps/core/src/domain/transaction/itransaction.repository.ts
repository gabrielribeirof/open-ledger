import { Transaction } from './transaction'

export interface ITransactionRepository {
	save(transaction: Transaction): Promise<void>
}

export const TRANSACTION_REPOSITORY_TOKEN = 'ITransactionRepository'
