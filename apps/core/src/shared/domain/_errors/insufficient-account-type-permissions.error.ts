import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class InsufficientAccountTypePermissionsError extends Error {
	constructor() {
		super(ErrorCode.INSUFFICIENT_ACCOUNT_TYPE_PERMISSIONS)
	}
}
