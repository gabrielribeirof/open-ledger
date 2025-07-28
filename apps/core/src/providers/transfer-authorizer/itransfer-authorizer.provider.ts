import { Account } from '@/domain/account/account';
import { Monetary } from '@/shared/domain/monetary';

export interface ITransferAuthorizerProvider {
	execute(
		originAccount: Account,
		targetAccount: Account,
		amount: Monetary,
	): Promise<boolean>;
}

export const TRANSFER_AUTHORIZER_PROVIDER = 'ITransferAuthorizerProvider';
