import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class AlreadyExistsError extends Error {
	constructor() {
		super(ErrorCode.ALREADY_EXISTS)
	}
}
