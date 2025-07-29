import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class TransactionMustHaveAtLeastOneDebitAndCreditOperationError extends Error {
	constructor() {
		super(ErrorCode.TRANSACTION_MUST_HAVE_AT_LEAST_ONE_DEBIT_AND_CREDIT_OPERATION)
	}
}
