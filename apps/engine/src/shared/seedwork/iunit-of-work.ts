import type { IAccountRepository } from '@/domain/account/iaccount.repository'
import type { ITransactionRepository } from '@/domain/transaction/itransaction.repository'

export interface IUnitOfWork {
	transactionRepository: ITransactionRepository
	accountRepository: IAccountRepository
	begin(): Promise<void>
	commit(): Promise<void>
	rollback(error: unknown): Promise<void>
}

export const UNIT_OF_WORK_TOKEN = 'IUnitOfWork'
