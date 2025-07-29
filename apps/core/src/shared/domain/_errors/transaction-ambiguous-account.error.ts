import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class TransactionAmbiguousAccountError extends Error {
	constructor() {
		super(ErrorCode.TRANSACTION_AMBIGUOUS_ACCOUNT)
	}
}
