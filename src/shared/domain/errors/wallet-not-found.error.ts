import { Error } from '../../seedwork/error';
import { ErrorCode } from '../../seedwork/error-code';

export class WalletNotFoundError extends Error {
	constructor() {
		super(ErrorCode.WALLET_NOT_FOUND);
	}
}
