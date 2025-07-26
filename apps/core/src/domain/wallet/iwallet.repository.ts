import { UniqueIdentifier } from '../../shared/seedwork/unique-identifier';
import { Wallet } from './wallet';

export interface IWalletRepository {
	findById(id: UniqueIdentifier): Promise<Wallet | null>;
	save(wallet: Wallet): Promise<void>;
}

export const WALLET_REPOSITORY = 'IWalletRepository';
