import { ITransferRepository } from '@/domain/transfer/itransfer.repository';
import { IWalletRepository } from '@/domain/wallet/iwallet.repository';

export interface IUnitOfWork {
	transferRepository: ITransferRepository;
	walletRepository: IWalletRepository;
	begin(): Promise<void>;
	commit(): Promise<void>;
	rollback(): Promise<void>;
}

export const UNIT_OF_WORK = 'IUnitOfWork';
