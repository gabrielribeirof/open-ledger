import { Error } from '../../seedwork/error';
import { ErrorCode } from '../../seedwork/error-code';

export class TransferAmountMustBeGreaterThanZeroError extends Error {
	constructor() {
		super(ErrorCode.TRANSFER_AMOUNT_MUST_BE_GREATER_THAN_ZERO);
	}
}
