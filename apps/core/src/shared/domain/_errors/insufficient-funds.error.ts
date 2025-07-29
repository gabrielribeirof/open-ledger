import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class InsufficientFundsError extends Error {
	constructor() {
		super(ErrorCode.INSUFFICIENT_FUNDS)
	}
}
