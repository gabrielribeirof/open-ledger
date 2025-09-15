import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class TransactionOperationsTotalAmountMismatchError extends Error {
	constructor() {
		super(ErrorCode.TRANSACTION_OPERATIONS_TOTAL_AMOUNT_MISMATCH)
	}
}
