import { ITransferRepository } from '@/domain/transfer/itransfer.repository';
import { IAccountRepository } from '@/domain/account/iaccount.repository';

export interface IUnitOfWork {
	transferRepository: ITransferRepository;
	accountRepository: IAccountRepository;
	begin(): Promise<void>;
	commit(): Promise<void>;
	rollback(error: unknown): Promise<void>;
}

export const UNIT_OF_WORK = 'IUnitOfWork';
