import { Error } from '../seedwork/error';
import { ErrorCode } from '../seedwork/error-code';

export class UnauthorizedTransferError extends Error {
	constructor() {
		super(ErrorCode.UNAUTHORIZED_TRANSFER);
	}
}
