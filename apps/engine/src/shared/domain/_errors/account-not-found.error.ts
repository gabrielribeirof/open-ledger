import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class AccountNotFoundError extends Error {
	constructor() {
		super(ErrorCode.ACCOUNT_NOT_FOUND)
	}
}
