import { Error } from '../../seedwork/error';
import { ErrorCode } from '../../seedwork/error-code';

export class InsufficientWalletTypePermissionsError extends Error {
	constructor() {
		super(ErrorCode.INSUFFICIENT_WALLET_TYPE_PERMISSIONS);
	}
}
