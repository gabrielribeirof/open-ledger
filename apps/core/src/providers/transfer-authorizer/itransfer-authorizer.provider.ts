import { Wallet } from '@/domain/wallet/wallet';
import { Monetary } from '@/shared/domain/monetary';

export interface ITransferAuthorizerProvider {
	execute(
		originWallet: Wallet,
		targetWallet: Wallet,
		amount: Monetary,
	): Promise<boolean>;
}

export const TRANSFER_AUTHORIZER_PROVIDER = 'ITransferAuthorizerProvider';
