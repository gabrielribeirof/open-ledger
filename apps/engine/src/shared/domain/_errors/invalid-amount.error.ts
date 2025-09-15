import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class InvalidAmountError extends Error {
	constructor() {
		super(ErrorCode.INVALID_AMOUNT)
	}
}
