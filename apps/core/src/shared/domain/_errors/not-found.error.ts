import { Error } from '../../seedwork/error'
import { ErrorCode } from '../../seedwork/error-code'

export class NotFoundError extends Error {
	constructor() {
		super(ErrorCode.NOT_FOUND)
	}
}
